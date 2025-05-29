import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { User, Mail, Phone, MapPin, Shield, Calendar, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetBookingsByRole } from "@/hooks/useOrder";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";


// Mock booking data
const mockBookings = [
  {
    id: "BOOK-12345",
    propertyName: "Villa Hạ Long Bay View",
    checkIn: "15/06/2023",
    checkOut: "20/06/2023",
    totalPrice: 8500000,
    status: "completed",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-67890",
    propertyName: "Coco Beach Resort Phú Quốc",
    checkIn: "10/08/2023",
    checkOut: "15/08/2023",
    totalPrice: 6300000,
    status: "completed",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-24680",
    propertyName: "Mường Thanh Grand Đà Nẵng",
    checkIn: "24/12/2023",
    checkOut: "28/12/2023",
    totalPrice: 4800000,
    status: "cancelled",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-13579",
    propertyName: "Sapa Eco Retreat",
    checkIn: "03/03/2024",
    checkOut: "07/03/2024",
    totalPrice: 5200000,
    status: "completed",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-97531",
    propertyName: "Duplex Apartment Thảo Điền",
    checkIn: "15/05/2024",
    checkOut: "25/05/2024",
    totalPrice: 12800000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-65432",
    propertyName: "Homestay Tam Cốc Ninh Bình",
    checkIn: "05/07/2024",
    checkOut: "10/07/2024",
    totalPrice: 3200000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-78901",
    propertyName: "Khách sạn Continental Sài Gòn",
    checkIn: "20/08/2024",
    checkOut: "25/08/2024",
    totalPrice: 7500000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-23456",
    propertyName: "Flamingo Đại Lải Resort",
    checkIn: "10/09/2024",
    checkOut: "15/09/2024",
    totalPrice: 9800000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop"
  }
];

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 hover:bg-green-600';
    case 'confirmed':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'pending':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'cancelled':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

// Status mapping to Vietnamese
const statusMapping = {
  'pending': 'Đang chờ',
  'confirmed': 'Đã xác nhận',
  'cancelled': 'Đã hủy',
  'completed': 'Hoàn thành'
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {getBookingsByRole} = useGetBookingsByRole();
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine if we need scrolling (more than 7 items)
  const needsScrolling = mockBookings.length > 7;
  const maxTableHeight = needsScrolling ? "400px" : "auto";
  const maxCardsHeight = needsScrolling ? "500px" : "auto";

  const handleViewInvoiceDetail = (booking: any) => {  
    setSelectedInvoice(booking);
    setIsInvoiceModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const responseBooking = await getBookingsByRole();
      setBookings(responseBooking.data.data)
    }
    fetchData();
  },[])
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User profile section */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Hồ sơ cá nhân</CardTitle>
                  <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <div className="w-24 h-24 bg-brand-blue/20 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-brand-blue" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{user?.name}</h3>
                      <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'host' ? 'Chủ nhà' : 'Người dùng'}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">Chưa cập nhật</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">Chưa cập nhật</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Loại tài khoản</p>
                        <p className="font-medium capitalize">{user?.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày tham gia</p>
                        <p className="font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">Chỉnh sửa hồ sơ</Button>
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* User content section */}
            <div className="w-full md:w-2/3">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Lịch sử đặt phòng</CardTitle>
                  <CardDescription>Xem thông tin các đơn đặt phòng của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {/* Desktop view with table */}
                      <div className="hidden md:block">
                        <ScrollArea className={needsScrolling ? "h-[400px]" : ""}>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Mã đặt phòng</TableHead>
                                <TableHead>Chỗ ở</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Chi tiết</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bookings.map((booking) => (
                                <TableRow key={booking.invoiceCode}>
                                  <TableCell className="font-medium">{booking.invoiceCode}</TableCell>
                                  <TableCell>{booking.homestay.address}</TableCell>
                                  <TableCell>{new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</TableCell>
                                  <TableCell>{booking.totalPrice.toLocaleString('vi-VN')}đ</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(booking.bookingStatus)}>
                                          {statusMapping[booking.bookingStatus]}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleViewInvoiceDetail(booking)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                      
                      {/* Mobile view with cards */}
                      <div className="md:hidden">
                        <ScrollArea className={needsScrolling ? "h-[500px]" : ""}>
                          <div className="grid gap-4">
                            {mockBookings.map((booking) => (
                              <Card key={booking.id} className="overflow-hidden">
                                <div className="flex">
                                  <div className="w-1/3">
                                    <img 
                                      src={booking.imageUrl} 
                                      alt={booking.propertyName}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="w-2/3 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-semibold text-sm line-clamp-1">{booking.propertyName}</h3>
                                      <Badge className={getStatusColor(booking.status)}>
                                        {booking.status === 'completed' ? 'Hoàn thành' : 
                                         booking.status === 'cancelled' ? 'Đã hủy' : 'Sắp tới'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Mã: {booking.id}</p>
                                    <p className="text-xs text-gray-500 mb-2">{booking.checkIn} - {booking.checkOut}</p>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-sm">{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-xs"
                                        onClick={() => handleViewInvoiceDetail(booking)}
                                      >
                                        Chi tiết
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p>Bạn chưa có đơn đặt phòng nào</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/search')}
                      >
                        Tìm kiếm chỗ nghỉ
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security card */}
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật tài khoản</CardTitle>
                  <CardDescription>Quản lý mật khẩu và tính năng bảo mật</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mật khẩu</h3>
                    <p className="text-sm text-gray-500">Cập nhật mật khẩu định kỳ để tăng cường bảo mật</p>
                    <Button variant="outline" className="mt-2">Đổi mật khẩu</Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Thiết bị đã đăng nhập</h3>
                    <p className="text-sm text-gray-500">Kiểm tra và quản lý các thiết bị đã đăng nhập</p>
                    <Button variant="outline" className="mt-2">Xem thiết bị</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

         {/* Invoice Detail Modal */}
         <InvoiceDetailModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoiceData={selectedInvoice}
        />
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
