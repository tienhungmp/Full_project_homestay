import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import InvoicePreviewModal from "@/components/property/InvoicePreviewModal";

// Payment method icons
import {
  CreditCard,
  Wallet,
  Bitcoin,
  User,
  MapPin,
  Phone,
  Receipt,
} from "lucide-react";
import { useCreatePaymentUrl, useGetOrderById } from "@/hooks/useOrder";

interface BookingDetails {
  orderId: string;
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

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const { createPaymentUrl } = useCreatePaymentUrl();
  const {getOrderById} = useGetOrderById();
  const [booking, setBooking] = useState<any>();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') || undefined;

  const bookingDetails = location.state?.bookingDetails as
    | BookingDetails
    | undefined;
  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      if (selectedMethod !== "e_wallet") {
        throw new Error("Hiện tại chỉ hỗ trợ thanh toán qua Ví điện tử");
      }
      const response = await createPaymentUrl({
        orderId: booking._id,
        totalPrice: booking.totalPrice,
      });

      if (response.success) {
        window.location.href = response.data.data.toString();
      } else {
        // navigate("/");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xử lý thanh toán"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const order = await getOrderById(bookingDetails ? bookingDetails.orderId : id)
        if (order.success) {
          setBooking(order.data.data)
        } else {
          toast.error(
             "Error fetching order details"
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error fetching order details"
        );
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {booking ? (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container py-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">
                Chọn phương thức thanh toán
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="col-span-2">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                          Thông tin đặt phòng
                        </h2>
                        <p className="text-lg font-medium">
                          Mã hóa đơn:
                          <span className="font-medium ml-1">
                              {booking.invoiceCode}
                          </span>
                        </p>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {booking.homestay.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm mt-2">
                            Nhận phòng:{" "}
                            <span className="font-medium">
                            {new Date(booking.checkInDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            })}
                            </span>
                          </p>
                          <p className="text-sm mt-2">
                            Trả phòng:{" "}
                            <span className="font-medium">
                            {new Date(booking.checkOutDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            })}
                            </span>
                          </p>
                          <p className="text-sm mt-2">
                            Số khách:{" "}
                            <span className="font-medium">
                              {booking.numberOfGuests}
                            </span>
                          </p>
                          <p className="text-sm mt-2">
                            Số phòng:{" "}
                            <span className="font-medium">
                              {booking.numberOfRooms}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {booking.totalPrice.toLocaleString("vi-VN")}đ
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tổng thanh toán
                          </p>
                        </div>
                      </div>
                    </div>

                    {booking.guestName && (
                      <div className="mb-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <User className="h-4 w-4 mr-1" /> Thông tin người đặt
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center">
                            <span className="font-medium mr-2">Tên:</span>
                            {booking.guestName}
                          </p>
                          <p className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="font-medium mr-2">Địa chỉ:</span>
                            {booking.guestAddress}
                          </p>
                          <p className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span className="font-medium mr-2">
                              Số điện thoại:
                            </span>
                            {booking.guestPhone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        Phương thức thanh toán
                      </h2>
                      <RadioGroup
                        value={selectedMethod}
                        onValueChange={setSelectedMethod}
                        className="space-y-4"
                      >
                        <div
                          className={`flex items-center p-4 border rounded-lg ${
                            selectedMethod === "credit_card"
                              ? "border-brand-blue bg-blue-50"
                              : ""
                          }`}
                        >
                          <RadioGroupItem
                            value="credit_card"
                            id="credit_card"
                          />
                          <Label
                            htmlFor="credit_card"
                            className="flex items-center ml-2 cursor-pointer"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            <span>Thẻ tín dụng/ghi nợ</span>
                          </Label>
                        </div>

                        <div
                          className={`flex items-center p-4 border rounded-lg ${
                            selectedMethod === "e_wallet"
                              ? "border-brand-blue bg-blue-50"
                              : ""
                          }`}
                        >
                          <RadioGroupItem value="e_wallet" id="e_wallet" />
                          <Label
                            htmlFor="e_wallet"
                            className="flex items-center ml-2 cursor-pointer"
                          >
                            <Wallet className="h-5 w-5 mr-2" />
                            <span>Ví điện tử (Momo, ZaloPay, VNPay)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-3">Tóm tắt thanh toán</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">
                            Tiền phòng
                          </p>
                          <p className="font-medium">
                            {(booking.totalPrice * 0.95).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">
                            Phí dịch vụ
                          </p>
                          <p className="font-medium">
                            {(booking.totalPrice * 0.05).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <p className="font-semibold">Tổng cộng</p>
                            <p className="font-bold">
                              {booking.totalPrice.toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowInvoicePreview(true)}
                    disabled={isProcessing}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Xem trước hóa đơn
                  </Button>

                  <Button
                    className="w-full bg-brand-blue hover:bg-brand-blue/90"
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(-1)}
                    disabled={isProcessing}
                  >
                    Quay lại
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <Footer />
          <InvoicePreviewModal
            isOpen={showInvoicePreview}
            onClose={() => setShowInvoicePreview(false)}
            bookingDetails={booking}
            selectedPaymentMethod={selectedMethod}
          />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h1>
            <p className="mb-6">Không tìm thấy thông tin đặt phòng.</p>
            <Button onClick={() => navigate("/")}>Quay lại</Button>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default PaymentMethod;
