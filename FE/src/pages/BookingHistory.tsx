import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink, Calendar } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth";

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
  },
  {
    id: "BOOK-34567",
    propertyName: "Sun World Bà Nà Hills",
    checkIn: "20/10/2024",
    checkOut: "23/10/2024",
    totalPrice: 5800000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-45678",
    propertyName: "Vinpearl Resort Nha Trang",
    checkIn: "05/11/2024",
    checkOut: "12/11/2024",
    totalPrice: 14500000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "BOOK-56789",
    propertyName: "Imperial Hotel Huế",
    checkIn: "15/12/2024",
    checkOut: "20/12/2024",
    totalPrice: 6700000,
    status: "upcoming",
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop"
  }
];

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 hover:bg-green-600';
    case 'cancelled':
      return 'bg-red-500 hover:bg-red-600';
    case 'upcoming':
      return 'bg-blue-500 hover:bg-blue-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

const ITEMS_PER_PAGE = 5;

const BookingHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalItems = mockBookings.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = mockBookings.slice(startIndex, endIndex);
  
  // Handle page changes
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Generate page numbers for pagination
  const generatePagination = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          onClick={() => goToPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're always shown
      pages.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            onClick={() => goToPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            onClick={() => goToPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Lịch sử đặt phòng</h1>
          <p className="text-gray-600">Xem thông tin tất cả các đơn đặt phòng của bạn</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn đặt phòng</CardTitle>
            <CardDescription>Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} đơn đặt phòng</CardDescription>
          </CardHeader>
          <CardContent>
            {currentItems.length > 0 ? (
              <div className="space-y-4">
                {/* Desktop view with table */}
                <div className="hidden md:block">
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
                      {currentItems.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.propertyName}</TableCell>
                          <TableCell>{booking.checkIn} - {booking.checkOut}</TableCell>
                          <TableCell>{booking.totalPrice.toLocaleString('vi-VN')}đ</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status === 'completed' ? 'Hoàn thành' : 
                               booking.status === 'cancelled' ? 'Đã hủy' : 'Sắp tới'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => navigate('/payment-success', { 
                                state: { 
                                  paymentDetails: {
                                    propertyName: booking.propertyName,
                                    checkIn: booking.checkIn,
                                    checkOut: booking.checkOut,
                                    totalPrice: booking.totalPrice,
                                    guestCount: 2,
                                    paymentMethod: "Thẻ tín dụng"
                                  },
                                  bookingId: booking.id
                                } 
                              })}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile view with cards */}
                <div className="md:hidden">
                  <div className="grid gap-4">
                    {currentItems.map((booking) => (
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
                                onClick={() => navigate('/payment-success', { 
                                  state: { 
                                    paymentDetails: {
                                      propertyName: booking.propertyName,
                                      checkIn: booking.checkIn,
                                      checkOut: booking.checkOut,
                                      totalPrice: booking.totalPrice,
                                      guestCount: 2,
                                      paymentMethod: "Thẻ tín dụng"
                                    },
                                    bookingId: booking.id
                                  } 
                                })}
                              >
                                Chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {/* Pagination */}
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => goToPage(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {generatePagination()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => goToPage(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
      </div>
      <Footer />
    </div>
  );
};

export default BookingHistory;