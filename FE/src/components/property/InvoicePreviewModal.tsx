import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Home, Calendar, Users } from 'lucide-react';

interface BookingDetails {
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  guestInfo?: {
    username: string;
    address: string;
    phoneNumber: string;
  };
}

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: any;
  selectedPaymentMethod: string;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  bookingDetails,
  selectedPaymentMethod
}) => {
  const paymentMethodNames: Record<string, string> = {
    credit_card: 'Thẻ tín dụng/ghi nợ',
    e_wallet: 'Ví điện tử',
    crypto: 'Tiền điện tử'
  };

  const roomPrice = bookingDetails.totalPrice * 0.95;
  const servicePrice = bookingDetails.totalPrice * 0.05;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xem trước hóa đơn</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về hóa đơn đặt phòng của bạn
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Property Information */}
            <div>
              <div className="flex items-center mb-3">
                <Home className="h-5 w-5 text-brand-blue mr-2" />
                <h3 className="text-lg font-semibold">Thông tin chỗ nghỉ</h3>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium text-lg">{bookingDetails.homestay.name} ({bookingDetails.invoiceCode})</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nhận phòng</p>
                      <p className="font-medium"> {new Date(bookingDetails.checkInDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            })}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Trả phòng</p>
                      <p className="font-medium">{new Date(bookingDetails.checkOutDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            })}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số khách</p>
                      <p className="font-medium">{bookingDetails.numberOfGuests}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            {bookingDetails.guestName && (
              <div>
                <div className="flex items-center mb-3">
                  <User className="h-5 w-5 text-brand-blue mr-2" />
                  <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                </div>
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Tên:</span>
                    <span>{bookingDetails.guestName}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Địa chỉ:</span>
                    <span>{bookingDetails.guestAddress}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-2">Số điện thoại:</span>
                    <span>{bookingDetails.guestPhone}</span>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Chi tiết thanh toán</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiền phòng</span>
                  <span className="font-medium">{roomPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí dịch vụ</span>
                  <span className="font-medium">{servicePrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span>{bookingDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức thanh toán</span>
                  <span className="font-medium">{paymentMethodNames[selectedPaymentMethod]}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Hóa đơn này chỉ là bản xem trước. Hóa đơn chính thức sẽ được gửi sau khi thanh toán thành công.
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewModal;
