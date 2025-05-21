import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  MapPin, 
  User, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Star,
  Check,
  X,
  Bed,
  CalendarRange
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCheckAvailabilityHomestay } from "@/hooks/useOrder";

// Sample availability data by date
const availabilityData = {
  [format(new Date(), "yyyy-MM-dd")]: { available: 3, booked: 1 },
  [format(new Date().setDate(new Date().getDate() + 1), "yyyy-MM-dd")]: { available: 2, booked: 2 },
  [format(new Date().setDate(new Date().getDate() + 2), "yyyy-MM-dd")]: { available: 1, booked: 3 },
  [format(new Date().setDate(new Date().getDate() + 3), "yyyy-MM-dd")]: { available: 0, booked: 4 },
};

interface PropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  property: {
    _id: string;
    name: string;
    address: string;
    price: number;
    bookingCount: number;
    status: string;
    numberOfRooms: number;
    amenities: string[];
  };
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  open,
  onClose,
  property
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [infoRoom, setInfoRoom] = useState<any>([]);
  const {getCheckAvailabilityHomestay} = useCheckAvailabilityHomestay()
  
  // Get formatted selected date string for querying availability
  const formattedSelectedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  
  // Get availability data for selected date
  const currentAvailability = availabilityData[formattedSelectedDate] || { available: 0, booked: 0 };
  
  // Calculate occupancy rate
  const occupancyRate = property.numberOfRooms > 0 
    ? Math.round((currentAvailability.booked / property.numberOfRooms) * 100) 
    : 0;
  
  // Check if fully booked
  const isFullyBooked = currentAvailability.available === 0;

  useEffect(() => {
    const fetchData = async () => {
      const responseInfoRoom = await getCheckAvailabilityHomestay({homestayId: property._id,date:selectedDate})
      if(responseInfoRoom.success) {
        setInfoRoom(responseInfoRoom.data.data)
        console.log(responseInfoRoom.data.data.bookedRooms)
      }
    };
    fetchData()
  }, [selectedDate]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Home className="h-5 w-5 text-brand-blue" />
            {property.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {property.address}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col gap-2">
            <h3 className="font-medium text-sm text-muted-foreground">Thông tin tổng quan</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span>Tổng số phòng:</span>
              </div>
              <span className="font-medium">{property.numberOfRooms}</span>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Số lượt đặt:</span>
              </div>
              <span className="font-medium">{property.bookingCount}</span>
              
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Tỷ lệ lấp đầy:</span>
              </div>
              <span className="font-medium">{occupancyRate}%</span>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Giá/đêm:</span>
              </div>
              <span className="font-medium">{property.price.toLocaleString()} VND</span>
              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>Đánh giá:</span>
              </div>
              <span className="font-medium">4.{Math.floor(Math.random() * 9) + 1}/5</span>
            </div>
            
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <div className="flex gap-2 mt-1">
                <Badge className={`${property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {property.status === 'hoạt động' ? 'Đang hoạt động' : 'Bảo trì'}
                </Badge>
                
                {infoRoom.availableRooms == 0 ? (
                  <Badge className="bg-red-100 text-red-800">Hết phòng</Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800">Còn phòng trống</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Tiện ích</h3>
            <div className="grid grid-cols-2 gap-y-2">
                {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{amenity}</span>
                </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="font-medium">Thông tin phòng</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Kiểm tra phòng trống theo ngày:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <CalendarRange className="h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    fromDate={new Date()} // Only allow dates from today
                    disabled={(date) => date < new Date()} // Disable past dates
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Tình trạng phòng</h4>
                {infoRoom && <>
                  <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Số phòng trống:</span>
                    <span className="font-medium">{infoRoom.availableRooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Số phòng đã đặt:</span>
                    <span className="font-medium">{infoRoom.bookedRooms === undefined ? 0 : infoRoom.bookedRooms.length}</span>
                  </div>
                </div>
                </>}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Thông tin giá</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Giá cơ bản/đêm:</span>
                    <span className="font-medium">{property.price.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Trạng thái:</span>
                    {currentAvailability.available > 0 ? (
                      <Badge className="bg-green-100 text-green-800">Còn phòng</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Hết phòng</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;