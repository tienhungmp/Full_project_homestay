import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays, isBefore, addDays, getDaysInMonth, startOfMonth, addMonths } from 'date-fns';
import { CalendarIcon, Check, AlertCircle, Calendar as CalendarDaysIcon } from 'lucide-react';
import { useCheckAvailableDates, useCheckHomestayAvailability } from '@/hooks/useHomestays';

interface AvailabilityCheckModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

const AvailabilityCheckModal = ({ open, onClose, propertyId, propertyName }: AvailabilityCheckModalProps) => {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'unavailable' | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [showAvailableDates, setShowAvailableDates] = useState(false);
  const {getCheckHomestayAvailability} = useCheckHomestayAvailability()
  const {checkAvailableDates} = useCheckAvailableDates();
  
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
    
    // Reset availability status when dates change
    setAvailability(null);
  };
  
  // Calculate nights
  const nights = checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 1) : 0;
  
  // Check availability function
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return;
    
    setIsChecking(true);
    const responseCheck = await getCheckHomestayAvailability(checkIn, checkOut, propertyId)

    if(responseCheck.success) {
      setAvailability(responseCheck.data.data.isAvailable ? 'available' : 'unavailable');
    }
    setIsChecking(false);
  };

  // Get available dates for the selected month
  const getAvailableDatesForMonth = async (monthDate: Date) => {
    setIsChecking(true);
    const responseCheck = await checkAvailableDates(propertyId, format(monthDate, 'yyyy-MM'))
    if(responseCheck.success) {
          setAvailableDates(responseCheck.data.data.availableDates);
    }
    setIsChecking(false);
    setShowAvailableDates(true);
  };

  // Format date to display
  const formatDateDisplay = (date: Date) => {
    return format(date, 'dd/MM/yyyy (EEEE)');
  };

  // Previous month
  const handlePrevMonth = () => {
    const prevMonth = addMonths(selectedMonth, -1);
    // Check if prevMonth is before current month
    if (isBefore(startOfMonth(prevMonth), startOfMonth(new Date()))) {
      return; // Do nothing if prevMonth is before current month
    }
    setSelectedMonth(prevMonth);
    getAvailableDatesForMonth(prevMonth);
  };

  // Next month
  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedMonth, 1);
    setSelectedMonth(nextMonth);
    getAvailableDatesForMonth(nextMonth);
  };

  // Get available dates when modal opens or month changes
  useEffect(() => {
    // if (open) {
    //   getAvailableDatesForMonth(selectedMonth);
    // } else {
    //   setShowAvailableDates(false);
    //   setAvailableDates([]);
    // }
  }, [open, selectedMonth]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kiểm tra tình trạng phòng</DialogTitle>
          <DialogDescription>
            Kiểm tra xem {propertyName} có còn trống trong khoảng thời gian bạn muốn không.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Date selection or Available dates toggle */}
          <div className="flex justify-between items-center gap-4">
            <Button 
              variant={!showAvailableDates ? "default" : "outline"} 
              onClick={() => setShowAvailableDates(false)}
              className="flex-1"
            >
              Chọn ngày
            </Button>
            <Button 
              variant={showAvailableDates ? "default" : "outline"} 
              onClick={() => getAvailableDatesForMonth(selectedMonth)}
              className="flex-1"
            >
              Ngày còn trống
            </Button>
          </div>

          {!showAvailableDates ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nhận phòng</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Trả phòng</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <span className="sr-only">Tháng trước</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h3 className="text-center font-medium">
                  Ngày còn trống trong {format(selectedMonth, 'MMMM yyyy')}
                </h3>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <span className="sr-only">Tháng sau</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              {isChecking ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto border rounded-md">
                  {availableDates && availableDates.length > 0 ? (
                    <ul className="divide-y">
                      {availableDates.map((date_time, index) => (
                        <li key={index} className="p-3 hover:bg-muted flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-2 text-green-500" />
                          <span>{date_time}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                      <p>Không có ngày trống trong tháng này</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {!showAvailableDates && (
            <>
              {nights > 0 && (
                <p className="text-sm text-center">
                  {nights} {nights === 1 ? 'đêm' : 'đêm'}
                </p>
              )}
              
              <Button 
                onClick={checkAvailability} 
                disabled={!checkIn || !checkOut || isChecking}
              >
                {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra tình trạng'}
              </Button>
              
              {availability && (
                <div className={`p-4 rounded-md mt-2 ${
                  availability === 'available' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {availability === 'available' ? (
                      <>
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-700">
                          <span className="font-semibold">Còn phòng!</span> Phòng còn trống trong khoảng thời gian này.
                        </p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">
                          <span className="font-semibold">Hết phòng!</span> Phòng đã được đặt trong khoảng thời gian này.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default AvailabilityCheckModal;