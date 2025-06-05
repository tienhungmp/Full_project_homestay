
import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Flag, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { useGetAllReviews } from "@/hooks/userAdminAnalys";

export function AdminReviews() {
  // Sample data - in a real app, this would come from an API
  const [reviews, setReviews] = useState([
    // { id: 1, property: "Villa Green Garden", user: "Nguyễn Văn A", date: "10/08/2023", rating: 5, content: "Tuyệt vời! Dịch vụ chất lượng, view đẹp, nhân viên thân thiện.", status: "visible" },
    // { id: 2, property: "Homestay Mountainview", user: "Trần Thị B", date: "05/08/2023", rating: 4, content: "Không gian thoáng đãng, sạch sẽ. Tuy nhiên, hơi xa trung tâm.", status: "visible" },
    // { id: 3, property: "Khách sạn Panorama", user: "Lê Văn C", date: "28/07/2023", rating: 2, content: "Phòng không sạch sẽ, dịch vụ kém, giá quá cao so với chất lượng.", status: "visible" },
    // { id: 4, property: "Resort Ocean Pearl", user: "Phạm Thị D", date: "20/07/2023", rating: 5, content: "Resort tuyệt đẹp, bãi biển riêng, nhân viên chu đáo.", status: "visible" },
    // { id: 5, property: "Khách sạn Sunlight", user: "Hoàng Văn E", date: "15/07/2023", rating: 1, content: "Dịch vụ tệ, ồn ào, không đúng như quảng cáo. Rất thất vọng.", status: "hidden" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const {getAllReviews} = useGetAllReviews()

  // Toggle visibility of a review
  const handleToggleVisibility = (reviewId: number) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const newStatus = review.status === 'visible' ? 'hidden' : 'visible';
        return { ...review, status: newStatus };
      }
      return review;
    }));
    
    const review = reviews.find(r => r.id === reviewId);
    const newStatus = review?.status === 'visible' ? 'hidden' : 'visible';
    
    toast.success(`Đã ${newStatus === 'visible' ? 'hiển thị' : 'ẩn'} đánh giá`);
  };

  // Flag a review as inappropriate
  const handleFlagReview = (reviewId: number) => {
    toast.success("Đã đánh dấu đánh giá là không phù hợp");
  };

  // Filter reviews based on search query
  const filteredReviews = reviews.filter(review => {
    return review.homestay.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           review.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           review.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    getAllReviews().then((res) => {
      setReviews(res.data.data.reviews);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đánh giá</h2>
        <p className="text-muted-foreground">
          Quản lý và giám sát đánh giá từ người dùng
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle>Danh sách đánh giá gần đây</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Chỗ nghỉ</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews && filteredReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>#{review._id.slice(-4)}</TableCell>
                  <TableCell className="font-medium">{review.homestay.name}</TableCell>
                  <TableCell>{review.user.name}</TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                  })}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">{review.rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={review.text}>
                    {review.text}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      review.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {review.status === 'active' ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {review.status === 'visible' ? (
                        <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(review.id)}>
                          <EyeOff className="h-4 w-4 mr-1" /> Ẩn
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(review.id)}>
                          <Eye className="h-4 w-4 mr-1" /> Hiện
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleFlagReview(review.id)}>
                        <Flag className="h-4 w-4 mr-1" /> Báo cáo
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
