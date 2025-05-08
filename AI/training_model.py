import pandas as pd
import re
import torch
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments

def load_data(data_path, stopwords_path):
    """Load and preprocess data"""
    df = pd.read_csv(data_path)
    with open(stopwords_path, 'r', encoding='utf-8') as f:
        stopwords = set(f.read().splitlines())
    return df, stopwords

def preprocess_text(text, stopwords):
    """Clean and normalize Vietnamese text"""
    text = text.lower()
    text = re.sub(r'[^a-zA-Zàáảãạăắẳẵặâấẩẫậbcdéèẻẽẹêếềểễệfghíìỉĩịjklmnoóòỏõọôốồổỗộơớờởỡợpqrstuúùủũụưứừửữựvwxyz]+', ' ', text)
    return ' '.join(word for word in text.split() if word not in stopwords)

def prepare_datasets(df, stopwords, test_size=0.2, random_state=42):
    """Prepare train/test datasets"""
    df['clean'] = df['clean'].apply(lambda x: preprocess_text(x, stopwords))
    X = df['clean']
    y = df['sentiment'].map({'neg': 0, 'neutral': 1, 'pos': 2})
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    return X_train, X_test, y_train, y_test

def tokenize_data(tokenizer, texts, max_length=128):
    """Tokenize text data"""
    return tokenizer(list(texts), padding=True, truncation=True, max_length=max_length)

class SentimentDataset(torch.utils.data.Dataset):
    """Custom dataset for sentiment analysis"""
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

def train_model(train_dataset, test_dataset, model_name='bert-base-multilingual-cased', num_labels=3):
    """Train and evaluate the model"""
    model = BertForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)
    
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=16,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        report_to="none",
        save_strategy="epoch",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
    )

    trainer.train()
    return trainer, model

def evaluate_model(trainer, test_dataset, y_test):
    """Evaluate model performance"""
    y_pred = trainer.predict(test_dataset).predictions.argmax(axis=1)
    print(f'Accuracy: {accuracy_score(y_test, y_pred)}')
    print(f'Classification Report: \n{classification_report(y_test, y_pred, target_names=["neg", "neutral", "pos"])}')

def predict_new_comments(model, tokenizer, comments):
    """Make predictions on new comments"""
    encodings = tokenizer(comments, padding=True, truncation=True, max_length=128, return_tensors="pt")
    predictions = model(encodings['input_ids']).logits.argmax(axis=1)
    return ['neg', 'neutral', 'pos'][predictions]

def main():
    # Load and prepare data
    df, stopwords = load_data('/content/command.csv', '/content/vietnamese-stopwords.txt')
    X_train, X_test, y_train, y_test = prepare_datasets(df, stopwords)
    
    # Tokenize data
    tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')
    train_encodings = tokenize_data(tokenizer, X_train)
    test_encodings = tokenize_data(tokenizer, X_test)
    
    # Create datasets
    train_dataset = SentimentDataset(train_encodings, y_train.tolist())
    test_dataset = SentimentDataset(test_encodings, y_test.tolist())
    
    # Train and evaluate
    trainer, model = train_model(train_dataset, test_dataset)
    evaluate_model(trainer, test_dataset, y_test)
    
    # Predict new comments
    new_comments = ["homestay rất tuyệt!", "Tôi không thích địa điểm này.", "Bình thường thôi."]
    predictions = predict_new_comments(model, tokenizer, new_comments)
    print(f'Predictions for new comments: {predictions}')
    
    # Save model
    model.save_pretrained('./saved_model')
    tokenizer.save_pretrained('./saved_model')

if __name__ == '__main__':
    main()
