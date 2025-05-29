import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Textarea } from "@/components/ui/textarea";
import PropertyDetailsModal from "@/components/dashboard/PropertyDetailsModal";
import PropertyEditModal from "@/components/dashboard/PropertyEditModal";
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
  Package,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Eye,
  Check,
  BedDouble
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

import { toast } from "sonner";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Review } from "@/types/property";
import { useGetReviewsByHostId } from "@/hooks/useReviews";
import { useGetAllBookingOfHost, useGetInfoHostDashboard, useUpadteStatusOrder } from "@/hooks/useOrder";
import { useDeleteHomestay, useGetAllHomestayByHost } from "@/hooks/useHomestays";
import AddHomeStay from "@/components/dashboard/AddHomeStay";
import { useCategories } from "@/hooks/useCategories";


const properties = [
  { id: 1, name: "Villa Đà Lạt View Đồi", location: "Đà Lạt", price: 1200000, bookings: 24, status: "active", totalRoom: 10 },
  { id: 2, name: "Căn hộ Seaside", location: "Nha Trang", price: 850000, bookings: 18, status: "active" },
  { id: 3, name: "Nhà vườn Hội An", location: "Hội An", price: 1500000, bookings: 15, status: "maintenance" },
];

const HostDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<{id: string, name: string}>(null);
  const [reviewsUser, setReviewsUser] = useState<any[]>();
  const [homestayReviews, setHomestayReviews] = useState<any[]>([]);
  const [infoHostDashboard, setInfoHostDashboard] = useState<any>();  
  const [viewingProperty, setViewingProperty] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([])
  const [homestays, setHomestays] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const {getGetReviewsByHostId} =  useGetReviewsByHostId()
  const {getGetInfoHostDashboard} =  useGetInfoHostDashboard();
  const {getAllBookingOfHost} = useGetAllBookingOfHost();
  const {getAllHomestayByHost} = useGetAllHomestayByHost();
  const {deleteHomestay} = useDeleteHomestay();
  const {getCategories} = useCategories();
  const {updateOrderStatus} = useUpadteStatusOrder();
  const [editingProperty, setEditingProperty] = useState<typeof properties[0] | null>(null);
  const [eventAddHomestay, setEventAddHomestay] = useState<boolean>(false);
  // Handle property operations
  const handleAddProperty = () => {
    toast.success("Chức năng thêm chỗ nghỉ mới sẽ được cập nhật sau!");
  };

  const handleEditProperty = (property: typeof properties[0]) => {
    setEditingProperty(property);
  };

  const handleSaveEditedProperty = (updatedProperty: typeof properties[0]) => {
    toast.success(`Đã cập nhật thông tin chỗ nghỉ: ${updatedProperty.name}`);
    setEditingProperty(null);
  };

  const handleDeleteProperty = async (id: string) => {
    const responseDelete =  await deleteHomestay(id);
    if(responseDelete.success) {
      toast.success(`Đã xóa chỗ nghỉ: ${id}`);
      const updatedHomestays = homestays.filter(homestay => homestay._id !== id);
      setHomestays(updatedHomestays);
    }
  };

  // Handle booking operations
  // 'pending', 'confirmed', 'cancelled', 'completed'
  const handleApproveBooking = async (id: string) => {
    const response = await updateOrderStatus({orderId: id, bookingStatus: 'confirmed'});
    if(response.success) {
      toast.success(`Đã duyệt đơn đặt phòng: ${id}`);
      const updatedBooking= bookings.map((booking) => {
        if(booking._id === id) {
          booking.bookingStatus = 'confirmed';
        }
        return booking;
      });
      setBookings(updatedBooking)
    }
  };

  const handleCancelBooking = async (id: string) => {
    const response = await updateOrderStatus({orderId: id, bookingStatus: 'cancelled'});
    if(response.success) {
      toast.success(`Đã hủy đơn đặt phòng: ${id}`)
      const updatedBooking= bookings.map((booking) => {
        if(booking._id === id) {
          booking.bookingStatus = 'cancelled';
        }
        return booking;
      });
      setBookings(updatedBooking)
    }
  };

  const handleSendConfirmationEmail = async (id: string) => {
    const response = await updateOrderStatus({orderId: id, bookingStatus: 'completed'});
    if(response.success) {
      toast.success(`Đã gửi email xác nhận cho đơn đặt phòng: ${id}`);
      const updatedBooking= bookings.map((booking) => {
        if(booking._id === id) {
          booking.bookingStatus = 'completed';
        }
        return booking;
      });
      setBookings(updatedBooking)
    }
  };

  // Handle showing reviews for a specific property
  const handleShowPropertyReviews = (propertyName: {id:string, name:string}) => {
    setSelectedProperty(propertyName);
  };

  const handleViewProperty = (property: typeof properties[0]) => {
    setViewingProperty(property);
  };

  // Get sentiment icon
  const getSentimentIcon = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Meh className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  // Filter properties
  const filteredProperties = homestays.filter(homestay =>
    homestay.name.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
    homestay.address.toLowerCase().includes(propertySearchQuery.toLowerCase())
  );

  // Filter bookings
  const filteredBookings = bookings.length > 0 ? bookings.filter(booking => {
    const matchesSearch = booking.homestay.name.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
                          (booking.invoiceCode).toLowerCase().includes(bookingSearchQuery.toLowerCase());
    const matchesStatus = bookingStatus ? booking.bookingStatus === bookingStatus : true;
    return matchesSearch && matchesStatus;
  }): bookings;

  // Filter reviews based on selected property
  const filteredReviews = selectedProperty 
    ? reviewsUser.filter(review => review.homestay._id === selectedProperty.id)
    : reviewsUser;
  useEffect(() => {
    const fetchData = async () => {
      const responseReviews = await getGetReviewsByHostId();
      const responseInfoHostDashboard = await getGetInfoHostDashboard();
      const responseAllBookingOfHost = await getAllBookingOfHost();
      const responseAllHomestayByHost = await getAllHomestayByHost();
      const responseCategories = await getCategories();
      if(responseReviews.success && responseInfoHostDashboard.success) {
        setReviewsUser(responseReviews.data.data);
        setInfoHostDashboard(responseInfoHostDashboard.data.data);
        setHomestayReviews(responseReviews.data.homestays);
        setBookings(responseAllBookingOfHost.data.data);
        setHomestays(responseAllHomestayByHost.data.data);
        setCategories(responseCategories.data.data)
      }
    };
    fetchData();
  }, [eventAddHomestay])
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
            <Button 
              className="bg-brand-blue hover:bg-brand-blue/90" 
              onClick={() => {
                handleAddProperty();
                setActiveTab("properties");
              }}
            >
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
                    <div className="text-2xl font-bold">{infoHostDashboard && infoHostDashboard.totalHomestays}</div>
                    <p className="text-xs text-muted-foreground">+1 so với tháng trước</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đơn đặt phòng tháng này</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{infoHostDashboard && infoHostDashboard.monthlyBookings}</div>
                    <p className="text-xs text-muted-foreground">+8% so với tháng trước</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{infoHostDashboard && infoHostDashboard.monthlyRevenue?.toLocaleString('vi-VN')} VNĐ</div>
                    <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{infoHostDashboard && Number(infoHostDashboard.averageRating.averageRating).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+0.3 so với tháng trước</p>
                  </CardContent>
                </Card>
              </div>

              <RevenueChart _idHost={user?._id}/>
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
                          <TableRow key={property._id}>
                            <TableCell>#{property._id.slice(-6)}</TableCell>
                            <TableCell className="font-medium">{property.name}</TableCell>
                            <TableCell>{property.address}</TableCell>
                            <TableCell>{property.price.toLocaleString()}</TableCell>
                            <TableCell>{property.bookingCount}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                property.status === 'hoạt động' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {property.status === 'hoạt động' ? 'Hoạt động' : 'Bảo trì'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Button variant="outline" size="sm" className="text-blue-500" onClick={() => handleViewProperty(property)}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Xem
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditProperty(property)}>
                                  Chỉnh sửa
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteProperty(property._id)}>
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
              {viewingProperty && (
                <PropertyDetailsModal 
                  open={!!viewingProperty} 
                  onClose={() => setViewingProperty(null)} 
                  property={viewingProperty} 
                />
              )}

              {editingProperty && (
                <PropertyEditModal
                  open={!!editingProperty}
                  onClose={() => setEditingProperty(null)}
                  property={editingProperty}
                  onSave={handleSaveEditedProperty}
                  categories={categories}
                />
              )}

            <AddHomeStay categories={categories} setEventAddHomestay = {setEventAddHomestay}  eventAddHomestay = {eventAddHomestay} />
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
                          <TableHead>Ngày Tạo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.invoiceCode}</TableCell>
                            <TableCell>{booking.homestay.name}</TableCell>
                            <TableCell>{booking.user ? booking.user.name : booking.guestName}</TableCell>
                            <TableCell>{new Date(booking.checkInDate).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit', 
                              day: '2-digit',
                            })}</TableCell>
                            <TableCell>{new Date(booking.checkOutDate).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit', 
                            })}</TableCell>
                            <TableCell>{booking.numberOfGuests}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                                booking.bookingStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                booking.bookingStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                                booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.bookingStatus === 'completed' ? 'Đã hoàn thành' : 
                                 booking.bookingStatus === 'confirmed' ? 'Đã xác nhận' :
                                 booking.bookingStatus === 'pending' ? 'Chờ xác nhận' :
                                 booking.bookingStatus === 'cancelled' ? 'Đã hủy' :
                                 'Không xác định'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={booking.bookingStatus}
                                onValueChange={(value) => {
                                  switch(value) {
                                    case 'confirmed':
                                      handleApproveBooking(booking._id);
                                      break;
                                    case 'cancelled':
                                      handleCancelBooking(booking._id);
                                      break;
                                    case 'completed':
                                      handleSendConfirmationEmail(booking._id);
                                      break;
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                  <SelectItem value="completed">Hoàn thành</SelectItem>
                                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{new Date(booking.createdAt).toLocaleString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit', 
                            })}</TableCell>
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
                  {filteredReviews && filteredReviews.length > 0 ? (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {filteredReviews.map((review) => (
                        <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{review.guest}</h3>
                              <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}, {new Date(review.createdAt).toLocaleTimeString('vi-VN')} - {review.homestay.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center bg-white px-2 py-1 rounded-full">
                                <span className="mr-1 font-medium">{review.rating}</span>
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              </div>
                              <div className="flex items-center bg-white px-2 py-1 rounded-full">
                                {getSentimentIcon(review.sentiment)}
                                <span className="ml-1 text-xs capitalize">{review.sentiment}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p>Chưa có đánh giá nào {selectedProperty && `cho ${selectedProperty}`}</p>
                      {selectedProperty && (
                        <Button variant="outline" className="mt-4" onClick={() => setSelectedProperty(null)}>
                          Xem tất cả đánh giá
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <CardTitle>Thống kê đánh giá</CardTitle>
                      <CardDescription>
                        {selectedProperty 
                          ? `Đánh giá cho ${selectedProperty.name}` 
                          : 'Trung bình đánh giá theo từng chỗ nghỉ'}
                      </CardDescription>
                    </div>
                    {selectedProperty && (
                      <Button variant="outline" size="sm" onClick={() => setSelectedProperty(null)} className="mt-2 sm:mt-0">
                        Quay lại tất cả
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {homestayReviews && homestayReviews.map((homestay) => (
                      <div 
                        key={homestay._id} 
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleShowPropertyReviews({ id: homestay._id, name: homestay.name})}
                      >
                        <div>
                          <h3 className="font-medium">{homestay.name}</h3>
                          <p className="text-sm text-gray-500">{homestay.address}</p>
                        </div>
                        <div className="flex items-center bg-white px-3 py-1 rounded-full">
                          <span className="mr-1 font-medium">{homestay.averageRating}</span>
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