
import React, { useState } from 'react';
import { Star, MessageSquarePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

interface PropertyReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

const PropertyReviews = ({ rating, reviewCount, reviews }: PropertyReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const { user, isAuthenticated } = useAuth();

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để viết đánh giá");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét của bạn");
      return;
    }

    // Thông báo thành công
    toast.success("Cảm ơn bạn đã gửi đánh giá!");
    
    // Reset form và đóng form
    setNewReview({ comment: '', rating: 5 });
    setShowReviewForm(false);
  };

  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 fill-brand-yellow text-brand-yellow" />
        <span className="text-lg font-medium">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">· {reviewCount} đánh giá</span>
        
        {isAuthenticated ? (
          !showReviewForm && (
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={() => setShowReviewForm(true)}
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Viết đánh giá
            </Button>
          )
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => toast.error("Vui lòng đăng nhập để viết đánh giá")}
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Viết đánh giá
          </Button>
        )}
      </div>
      
      {showReviewForm && isAuthenticated && (
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Viết đánh giá của bạn</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReviewForm(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="rating">Đánh giá</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer">
                    <input
                      type="radio"
                      value={star}
                      checked={newReview.rating === star}
                      onChange={() => handleRatingChange(star)}
                      className="sr-only"
                    />
                    <Star 
                      className={`h-6 w-6 ${newReview.rating >= star ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'}`} 
                    />
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="comment">Nhận xét</Label>
              <Textarea 
                id="comment"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={newReview.comment}
                onChange={handleCommentChange}
              />
            </div>
            
            <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
              Gửi đánh giá
            </Button>
          </form>
        </div>
      )}
      
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{review.user}</span>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyReviews;
