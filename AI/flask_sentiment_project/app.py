from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import numpy as np
import os

app = Flask(__name__)

# Load mô hình và tokenizer
model = load_model("model/model.h5")
with open("model/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

def to_percent_no_round(x):
    percent = int(x * 10000) / 100
    return "{:.2f}".format(percent)

# Hàm tiền xử lý (bạn có thể chỉnh sửa thêm nếu cần)
def preprocess_text(text):
    text = text.lower().strip()
    # Có thể thêm xử lý như loại bỏ dấu câu, từ dừng, v.v.
    return text

# Hàm phân tích cảm xúc
def analyze_sentiment(text):
    # Tiền xử lý
    processed_text = preprocess_text(text)
    sequence = tokenizer.texts_to_sequences([processed_text])
    padded = pad_sequences(sequence, maxlen=30, padding='post', truncating='post')

    # Dự đoán
    prediction = model.predict(padded)
    score = float(prediction[0][0])
    confidence = 0
    
    # Phân loại cảm xúc
    if score > 0.6:
        sentiment = "positive"
        confidence = (score - 0.6) / (1 - 0.6)
    elif score < 0.4:
        sentiment = "negative"
        confidence = (0.4 - score) / 0.4
    else:
        sentiment = "neutral"
        confidence = 1 - abs(score - 0.5) / 0.1 
        
    return sentiment, to_percent_no_round(confidence)

# Trang chủ
@app.route("/")
def home():
    return render_template("index.html")

# Trang phân tích
@app.route("/analyze", methods=["GET", "POST"])
def analyze():
    if request.method == "POST":
        data = request.get_json()
        text = data.get("text", "")
        
        sentiment, confidence = analyze_sentiment(text)

        return jsonify({
            "sentiment": sentiment,
            "confidence": confidence
        })

    return render_template("analyze.html")

# API endpoint
@app.route("/api/sentiment", methods=["POST"])
def sentiment_api():
    # Kiểm tra dữ liệu đầu vào
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    
    # Kiểm tra xem có trường comment không
    if "comment" not in data:
        return jsonify({"error": "Missing 'comment' field"}), 400
    
    text = data.get("comment")
    
    # Phân tích cảm xúc
    sentiment, confidence = analyze_sentiment(text)
    
    # Trả về kết quả
    return jsonify({
        "result": {
            "text": text,
            "sentiment": sentiment,
            "confidence": confidence
        }
    })

if __name__ == "__main__":
    # Get port from environment variable (Render sets this) or use 3030 as default
    port = int(os.environ.get("PORT", 3030))
    # Use 0.0.0.0 to listen on all interfaces
    app.run(host="0.0.0.0", debug=False, port=port)