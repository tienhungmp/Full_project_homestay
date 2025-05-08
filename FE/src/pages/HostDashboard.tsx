
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { 
  Home, 
  PlusCircle, 
  Calendar, 
  Users, 
  Settings,
  Upload,
  Search,
  Star,
  BarChart,
  DollarSign,
  Package
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";

// Sample data
const revenueData = [
  { name: "T1", revenue: 2100 },
  { name: "T2", revenue: 1800 },
  { name: "T3", revenue: 2400 },
  { name: "T4", revenue: 2700 },
  { name: "T5", revenue: 3100 },
  { name: "T6", revenue: 3600 },
  { name: "T7", revenue: 4200 },
  { name: "T8", revenue: 3900 },
  { name: "T9", revenue: 3400 },
  { name: "T10", revenue: 2900 },
  { name: "T11", revenue: 2500 },
  { name: "T12", revenue: 3200 },
];

const properties = [
  { id: 1, name: "Villa Đà Lạt View Đồi", location: "Đà Lạt", price: 1200000, bookings: 24, status: "active" },
  { id: 2, name: "Căn hộ Seaside", location: "Nha Trang", price: 850000, bookings: 18, status: "active" },
  { id: 3, name: "Nhà vườn Hội An", location: "Hội An", price: 1500000, bookings: 15, status: "maintenance" },
];

const bookings = [
  { id: "B1001", property: "Villa Đà Lạt View Đồi", guest: "Nguyễn Văn A", checkIn: "12/09/2023", checkOut: "15/09/2023", guests: 4, status: "completed" },
  { id: "B1002", property: "Căn hộ Seaside", guest: "Trần Thị B", checkIn: "20/09/2023", checkOut: "22/09/2023", guests: 2, status: "upcoming" },
  { id: "B1003", property: "Villa Đà Lạt View Đồi", guest: "Lê Văn C", checkIn: "05/10/2023", checkOut: "10/10/2023", guests: 6, status: "pending" },
  { id: "B1004", property: "Nhà vườn Hội An", guest: "Phạm Thị D", checkIn: "15/10/2023", checkOut: "20/10/2023", guests: 3, status: "canceled" },
];

const reviews = [
  { id: 1, property: "Villa Đà Lạt View Đồi", guest: "Nguyễn Văn A", date: "16/09/2023", rating: 5, content: "Căn villa rất đẹp, view tuyệt vời, chủ nhà thân thiện." },
  { id: 2, property: "Căn hộ Seaside", guest: "Trần Thị B", date: "23/09/2023", rating: 4, content: "Vị trí thuận tiện, gần biển, phòng sạch sẽ." },
  { id: 3, property: "Villa Đà Lạt View Đồi", guest: "Hoàng Văn E", date: "12/09/2023", rating: 3, content: "Phòng ổn, nhưng hơi ồn vào buổi tối." },
];

const HostDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [bookingStatus, setBookingStatus] = useState("all");

  const { data, isLoading, error } = useCategories();
  console.log(data)

  // Handle property operations
  const handleAddProperty = () => {
    toast.success("Chức năng thêm chỗ nghỉ mới sẽ được cập nhật sau!");
  };

  const handleEditProperty = (id: number) => {
    toast.success(`Chỉnh sửa chỗ nghỉ ID: ${id}`);
  };

  const handleDeleteProperty = (id: number) => {
    toast.success(`Đã xóa chỗ nghỉ ID: ${id}`);
  };

  // Handle booking operations
  const handleApproveBooking = (id: string) => {
    toast.success(`Đã xác nhận đơn đặt phòng: ${id}`);
  };

  const handleCancelBooking = (id: string) => {
    toast.success(`Đã hủy đơn đặt phòng: ${id}`);
  };

  const handleSendConfirmationEmail = (id: string) => {
    toast.success(`Đã gửi email xác nhận cho đơn đặt phòng: ${id}`);
  };

  // Filter properties
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(propertySearchQuery.toLowerCase())
  );

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guest.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
                          booking.property.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
                          booking.id.toLowerCase().includes(bookingSearchQuery.toLowerCase());
    const matchesStatus = bookingStatus === "all" ? true : booking.status === bookingStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute allowedRoles={['host', 'admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quản lý chỗ nghỉ</h1>
              <p className="text-gray-600">Quản lý các chỗ nghỉ và đặt phòng của bạn</p>
            </div>
            <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={handleAddProperty}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm chỗ nghỉ mới
            </Button>
          </div>

          <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8 w-full max-w-3xl">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Chỗ nghỉ</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Đặt phòng</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Đánh giá</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Tổng quan</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Content */}
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chỗ nghỉ đang hoạt động</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">+1 so với tháng trước</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đơn đặt phòng tháng này</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+8% so với tháng trước</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42.5M VND</div>
                    <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2</div>
                    <p className="text-xs text-muted-foreground">+0.3 so với tháng trước</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Doanh thu theo tháng (Triệu VND)</CardTitle>
                  <CardDescription>Biểu đồ doanh thu theo tháng trong năm 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value/1000}M VND`, 'Doanh thu']} />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#4f46e5" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Properties Content */}
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Danh sách chỗ nghỉ của tôi</CardTitle>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Tìm kiếm..." 
                        className="pl-8" 
                        value={propertySearchQuery}
                        onChange={(e) => setPropertySearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredProperties.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Tên chỗ nghỉ</TableHead>
                          <TableHead>Địa điểm</TableHead>
                          <TableHead>Giá/đêm (VND)</TableHead>
                          <TableHead>Số lượt đặt</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProperties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell>{property.id}</TableCell>
                            <TableCell className="font-medium">{property.name}</TableCell>
                            <TableCell>{property.location}</TableCell>
                            <TableCell>{property.price.toLocaleString()}</TableCell>
                            <TableCell>{property.bookings}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {property.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProperty(property.id)}>
                                  Chỉnh sửa
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteProperty(property.id)}>
                                  Xóa
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Home className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p>Bạn chưa có chỗ nghỉ nào</p>
                      <Button className="mt-4 bg-brand-blue hover:bg-brand-blue/90" onClick={handleAddProperty}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm chỗ nghỉ mới
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thêm chỗ nghỉ mới</CardTitle>
                  <CardDescription>
                    Điền thông tin và tải lên hình ảnh cho chỗ nghỉ mới của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tên chỗ nghỉ</label>
                        <Input placeholder="Nhập tên chỗ nghỉ" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Địa điểm</label>
                        <Input placeholder="Nhập địa điểm" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Giá/đêm (VND)</label>
                        <Input type="number" placeholder="Nhập giá tiền" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Loại chỗ nghỉ</label>
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm">Chọn loại chỗ nghỉ (có thể chọn nhiều):</label>
                          <div className="flex flex-wrap gap-2">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="form-checkbox" value="villa" />
                              <span>Villa</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="form-checkbox" value="apartment" />
                              <span>Căn hộ</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="form-checkbox" value="homestay" />
                              <span>Homestay</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="form-checkbox" value="hotel" />
                              <span>Khách sạn</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed rounded-lg p-4 h-64 flex flex-col items-center justify-center text-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium mb-1">Tải lên hình ảnh</h3>
                      <p className="text-sm text-gray-500 mb-4">Kéo thả hoặc click để chọn hình ảnh</p>
                      <Button variant="outline" size="sm">
                        Chọn hình ảnh
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-brand-blue hover:bg-brand-blue/90">
                    Lưu chỗ nghỉ mới
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Content */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Danh sách đặt phòng</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Tìm kiếm..." 
                          className="pl-8" 
                          value={bookingSearchQuery}
                          onChange={(e) => setBookingSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={bookingStatus} onValueChange={setBookingStatus}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="pending">Chờ xác nhận</SelectItem>
                          <SelectItem value="upcoming">Sắp tới</SelectItem>
                          <SelectItem value="completed">Đã hoàn thành</SelectItem>
                          <SelectItem value="canceled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredBookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã đặt phòng</TableHead>
                          <TableHead>Chỗ nghỉ</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Nhận phòng</TableHead>
                          <TableHead>Trả phòng</TableHead>
                          <TableHead>Số khách</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{booking.property}</TableCell>
                            <TableCell>{booking.guest}</TableCell>
                            <TableCell>{booking.checkIn}</TableCell>
                            <TableCell>{booking.checkOut}</TableCell>
                            <TableCell>{booking.guests}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status === 'completed' ? 'Đã hoàn thành' : 
                                 booking.status === 'upcoming' ? 'Sắp tới' :
                                 booking.status === 'pending' ? 'Chờ xác nhận' :
                                 'Đã hủy'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {booking.status === 'pending' && (
                                  <Button variant="outline" size="sm" className="text-green-500" onClick={() => handleApproveBooking(booking.id)}>
                                    Xác nhận
                                  </Button>
                                )}
                                
                                {(booking.status === 'pending' || booking.status === 'upcoming') && (
                                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleCancelBooking(booking.id)}>
                                    Hủy
                                  </Button>
                                )}
                                
                                {booking.status === 'upcoming' && (
                                  <Button variant="outline" size="sm" onClick={() => handleSendConfirmationEmail(booking.id)}>
                                    Gửi email
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p>Không có đơn đặt phòng nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Content */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Đánh giá từ khách hàng</CardTitle>
                  <CardDescription>
                    Xem các đánh giá mà khách hàng gửi về chỗ nghỉ của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{review.guest}</h3>
                              <p className="text-sm text-gray-500">{review.date} - {review.property}</p>
                            </div>
                            <div className="flex items-center bg-white px-2 py-1 rounded-full">
                              <span className="mr-1 font-medium">{review.rating}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            </div>
                          </div>
                          <p className="text-gray-600">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p>Chưa có đánh giá nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thống kê đánh giá</CardTitle>
                  <CardDescription>Trung bình đánh giá theo từng chỗ nghỉ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{property.name}</h3>
                          <p className="text-sm text-gray-500">{property.location}</p>
                        </div>
                        <div className="flex items-center bg-white px-3 py-1 rounded-full">
                          <span className="mr-1 font-medium">4.{Math.floor(Math.random() * 9) + 1}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default HostDashboard;
