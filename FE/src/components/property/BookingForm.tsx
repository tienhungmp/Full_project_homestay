import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, CalendarIcon, Users, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays, isBefore } from 'date-fns';
import { useAuth } from '@/contexts/auth/useAuth';
import { useApi } from '@/hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOrder, useOrderWithoutAccount } from '@/hooks/useOrder';
import { BookingRequest, OrderRequest } from '@/types/order';
import BookingInfoModal, { BookingInfoFormValues } from './BookingInfoModal';
import AvailabilityCheckModal from './AvailabilityCheckModal';

interface BookingFormProps {
  price: number;
  rating: number;
  maxGuests: number;
  propertyId: string;
  propertyName: string;
}

const BookingForm = ({ price, rating, maxGuests, propertyId, propertyName }: BookingFormProps) => {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuestInfoModal, setShowGuestInfoModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [guestInfo, setGuestInfo] = useState<BookingInfoFormValues | null>(null);
  
  
  const { isAuthenticated, user } = useAuth();
  const { createOrder, isLoading, error } = useOrder();
  const {createOrderWithoutAccount} =  useOrderWithoutAccount();
  const navigate = useNavigate();

  

  // Calculate nights and total price
  const nights = checkIn && checkOut 
    ? Math.max(differenceInDays(checkOut, checkIn), 1) 
    : 0;
  
  const serviceFee = Math.round((price * nights) * 0.05);
  const totalPrice = price * nights + serviceFee;

  // Handle check-in date selection
  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date);
    
    // If checkOut is already set and is before the new checkIn, reset it
    if (date && checkOut && isBefore(checkOut, date)) {
      setCheckOut(undefined);
    } 
    // Or if checkOut is not set, set it to checkIn + 1 day automatically
    else if (date && !checkOut) {
      setCheckOut(addDays(date, 1));
    }
  };

  // Handle guest info modal submission
  const handleGuestInfoSubmit =  async (data: BookingInfoFormValues) => {
    setGuestInfo(data);
    setShowGuestInfoModal(false);

    const bookingData: BookingRequest = {
      propertyId,
      checkIn,
      checkOut,
      guestCount,
      totalPrice,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      guestName: data.username,
      guestEmail: data.email,
      guestPhone: data.phoneNumber,
      guestAddress: data.address
    };

    try {
      const response = await createOrderWithoutAccount(bookingData)
      if(response.success){
        navigate('/payment-method', {
          state: {
            bookingDetails: {
              propertyId,
              propertyName,
              checkIn: format(checkIn!, 'dd/MM/yyyy'),
              checkOut: format(checkOut!, 'dd/MM/yyyy'),
              guestCount,
              totalPrice,
              guestInfo: data,
              orderId: response.data.data._id
            }
          }
        });
      } else {
        toast.error(response.error || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.');
      }
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.');
    }
  };


  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng');
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      setShowGuestInfoModal(true);
      return;
    }

    setIsSubmitting(true);
    
    // Create the booking request
    const bookingData: OrderRequest = {
      userId: user._id,
      propertyId,
      checkIn,
      checkOut,
      guestCount,
      totalPrice,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    };

    try {
      const response = await createOrder(bookingData);
      
      if (response.success) {
        toast.success('Đặt phòng thành công!');
        
        navigate('/payment-method', {
          state: {
            bookingDetails: {
              propertyId,
              propertyName,
              checkIn: format(checkIn, 'dd/MM/yyyy'),
              checkOut: format(checkOut, 'dd/MM/yyyy'),
              guestCount,
              totalPrice,
              orderId: response.data.data._id
            }
          }
        });
      } else {
        if (response.error?.includes('conflict')) {
          toast.error('Ngày bạn chọn đã có người đặt rồi. Vui lòng chọn ngày khác.');
        } else {
          toast.error(response.error || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.');
        }
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-20">
      <div className="rounded-lg border p-6 bg-white shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xl font-bold">{price.toLocaleString('vi-VN')}đ</span>
            <span className="text-sm font-normal text-muted-foreground"> /đêm</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow mr-1" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="border rounded-lg mb-4">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-b">
              <label className="block text-xs text-muted-foreground">Nhận phòng</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 h-auto text-left font-normal"
                  >
                    {checkIn ? format(checkIn, 'dd/MM/yyyy') : <span className="text-muted-foreground">Chọn ngày</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={handleCheckInSelect}
                    disabled={(date) => isBefore(date, new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-3 border-b">
              <label className="block text-xs text-muted-foreground">Trả phòng</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-0 h-auto text-left font-normal"
                  >
                    {checkOut ? format(checkOut, 'dd/MM/yyyy') : <span className="text-muted-foreground">Chọn ngày</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => 
                      isBefore(date, new Date()) || 
                      (checkIn ? isBefore(date, checkIn) : false)
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-3 col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">Số khách</label>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <select 
                  className="w-full border-0 focus:ring-0 p-0"
                  value={guestCount}
                  onChange={e => setGuestCount(parseInt(e.target.value))}
                >
                  {[...Array(maxGuests)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} khách</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button 
            className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
            disabled={!checkIn || !checkOut || isSubmitting || isLoading}
            onClick={handleBookingSubmit}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt phòng'}
          </Button>
          
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => setShowAvailabilityModal(true)}
          >
            Kiểm tra
          </Button>
        </div>
        
        {nights > 0 ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="underline">{price.toLocaleString('vi-VN')}đ x {nights} đêm</span>
              <span>{(price * nights).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Phí dịch vụ</span>
              <span>{serviceFee.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Tổng trước thuế</span>
                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-center text-muted-foreground italic">
            <AlertCircle className="h-4 w-4 inline-block mr-1" />
            Vui lòng chọn ngày nhận và trả phòng để xem tổng chi phí
          </div>
        )}
      </div>
      {/* Guest information modal for non-authenticated users */}
      <BookingInfoModal
        open={showGuestInfoModal}
        onClose={() => setShowGuestInfoModal(false)}
        onSubmit={handleGuestInfoSubmit}
      />
      
      {/* Availability check modal */}
      <AvailabilityCheckModal
        open={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        propertyId={propertyId}
        propertyName={propertyName}
      />
    </div>
  );
};

export default BookingForm;
