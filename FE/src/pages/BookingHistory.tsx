import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useGetBookingsByRole } from "@/hooks/useOrder";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";

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

const ITEMS_PER_PAGE = 5;

interface Booking {
  id: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  imageUrl: string;
}

const BookingHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const {getBookingsByRole} = useGetBookingsByRole();

  const handleViewInvoiceDetail = (booking: any) => {  
    setSelectedInvoice(booking);
    setIsInvoiceModalOpen(true);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/api/bookings?page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
        const responseBooking = await getBookingsByRole(currentPage, ITEMS_PER_PAGE);
        setBookings(responseBooking.data.data)
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [currentPage, isAuthenticated]);

  // Calculate pagination
  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Handle page changes
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const generatePagination = () => {
    const pages = [];
    
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
    
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue;
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
    
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <CardDescription>Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} trên tổng số {totalItems} đơn đặt phòng</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
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
                </div>
                
                {/* Mobile view with cards */}
                <div className="md:hidden">
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
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

            {/* Invoice Detail Modal */}
        <InvoiceDetailModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoiceData={selectedInvoice}
        />
    </div>
  );
};

export default BookingHistory;