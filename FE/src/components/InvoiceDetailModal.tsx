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
import { User, MapPin, Phone, Home, Calendar, Users, Receipt } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';


interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any | null;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoiceData
}) => {
  if (!invoiceData) return null;

  const roomPrice = invoiceData.totalPrice * 0.95;
  const servicePrice = invoiceData.totalPrice * 0.05;

  const formatDate = (dateString: string) => {
    // Check if it's already in DD/MM/YYYY format
    if (dateString.includes('/')) {
      return dateString;
    }
    // Otherwise convert from ISO format
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'upcoming':
        return 'Sắp tới';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method?: string) => {
    if (!method) return 'Thẻ tín dụng';
    
    const methodMap: Record<string, string> = {
      'credit_card': 'Thẻ tín dụng/ghi nợ',
      'e_wallet': 'Ví điện tử',
      'crypto': 'Tiền điện tử'
    };
    
    return methodMap[method] || method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand-blue" />
            Chi tiết hóa đơn {invoiceData.invoiceCode}
          </DialogTitle>
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
                <p className="font-medium text-lg">{invoiceData.homestay.name}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nhận phòng</p>
                      <p className="font-medium">{formatDate(invoiceData.checkInDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Trả phòng</p>
                      <p className="font-medium">{formatDate(invoiceData.checkOutDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số khách</p>
                      <p className="font-medium">{invoiceData.numberOfGuests}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <div className="flex items-center mb-3">
                <User className="h-5 w-5 text-brand-blue mr-2" />
                <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
              </div>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium mr-2">Tên:</span>
                  <span>{invoiceData.guestInfo?.username || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium mr-2">Địa chỉ:</span>
                  <span>{invoiceData.guestInfo?.address || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium mr-2">Số điện thoại:</span>
                  <span>{invoiceData.guestInfo?.phoneNumber || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

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
                  <span className="text-brand-blue">{invoiceData.totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức thanh toán</span>
                  <span className="font-medium">{getPaymentMethodText(invoiceData.paymentMethod)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <span className={`font-medium ${
                      invoiceData.paymentStatus === 'paid' ? 'text-green-600' : 
                      invoiceData.paymentStatus === 'pending' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {getStatusText(invoiceData.paymentStatus)}
                    </span>
                  </div>
                  
                  {invoiceData.paymentStatus == 'pending' && (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <a 
                        href={"http://localhost:8080/payment-method?id=" + invoiceData._id}
                        className="w-full px-4 py-2 text-center text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 transition-colors"
                      >
                        Thanh toán ngay
                      </a>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Hoặc quét mã QR</p>
                        <QRCodeCanvas
                            value={"http://localhost:8080/payment-method?id=" + invoiceData._id}
                            size={256}
                            level="H" // mức độ lỗi: L, M, Q, H
                            includeMargin={true}
                          />
                    </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Vui lòng mang theo hóa đơn này khi check-in. 
                Nếu cần hỗ trợ, vui lòng liên hệ hotline: 1900-1234.
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailModal;