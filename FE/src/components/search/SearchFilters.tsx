
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Search as SearchIcon, MapPin, Star } from 'lucide-react';
import { format } from "date-fns";
import { vi } from 'date-fns/locale';

interface SearchFiltersProps {
  location: string;
  setLocation: (value: string) => void;
  checkIn: Date | undefined;
  setCheckIn: (date: Date | undefined) => void;
  checkOut: Date | undefined;
  setCheckOut: (date: Date | undefined) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedTypes: Record<string, boolean>;
  setSelectedTypes: (types: Record<string, boolean>) => void;
  selectedAmenities: Record<string, boolean>;
  setSelectedAmenities: (amenities: Record<string, boolean>) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  setToggleFilter: (isFilter: boolean) => void;
  toggleFilter: boolean
}

const amenitiesMap = {
  'WiFi': 'WiFi',
  'Air Conditioning': 'Máy lạnh',
  'TV': 'TV',
  'Kitchen': 'Nhà bếp',
  'Washing Machine': 'Máy giặt',
  'Free Parking': 'Chỗ đậu xe miễn phí',
  'Pool': 'Hồ bơi',
  'Garden': 'Vườn',
  'BBQ': 'Nướng BBQ',
  'Hot Water': 'Nước nóng',
  'Refrigerator': 'Tủ lạnh',
  'Microwave': 'Lò vi sóng',
  'Security Camera': 'Camera an ninh',
  'First Aid Kit': 'Bộ sơ cứu',
  'Fire Extinguisher': 'Bình chữa cháy'
};


const SearchFilters: React.FC<SearchFiltersProps> = ({
  location,
  setLocation,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  priceRange,
  setPriceRange,
  selectedTypes,
  setSelectedTypes,
  selectedAmenities,
  setSelectedAmenities,
  minRating,
  setMinRating,
  setToggleFilter,
  toggleFilter
}) => {

  const handleSubmitToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4">Lọc kết quả</h3>
      
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Địa điểm
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            placeholder="Nhập thành phố, địa điểm..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày nhận phòng
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? (
                  format(checkIn, 'dd/MM/yyyy', { locale: vi })
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày trả phòng
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? (
                  format(checkOut, 'dd/MM/yyyy', { locale: vi })
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">
          Khoảng giá ({priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ)
        </label>
        <Slider
          defaultValue={[100000, 3000000]}
          min={10000}
          max={5000000}
          step={100000}
          value={priceRange}
          onValueChange={setPriceRange}
        />
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Loại chỗ ở</h4>
        {Object.keys(selectedTypes).map((type) => (
          <div key={type} className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id={`type-${type}`}
              checked={selectedTypes[type]}
              onCheckedChange={(checked) => {
                setSelectedTypes({
                  ...selectedTypes,
                  [type]: Boolean(checked)
                });
              }}
            />
            <label 
              htmlFor={`type-${type}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Đánh giá tối thiểu</h4>
        <div className="flex gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={`flex items-center rounded-md border px-2.5 py-1.5 text-sm ${minRating === rating ? 'border-brand-blue bg-brand-blue text-white' : 'border-gray-200'}`}
              onClick={() => setMinRating(rating)}
            >
              {rating > 0 ? (
                <>
                  {rating}
                  <Star className="h-3 w-3 ml-1 fill-current" />
                </>
              ) : (
                "Tất cả"
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Tiện nghi</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(selectedAmenities).map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity}`}
                checked={selectedAmenities[amenity]}
                onCheckedChange={(checked) => {
                  setSelectedAmenities({
                    ...selectedAmenities,
                    [amenity]: Boolean(checked)
                  });
                }}
              />
              <label 
                htmlFor={`amenity-${amenity}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenitiesMap[amenity]}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Button className="w-full bg-brand-blue hover:bg-brand-blue/90" onClick={handleSubmitToggleFilter}>
        <SearchIcon className="mr-2 h-4 w-4" />
        Áp dụng bộ lọc
      </Button>
    </div>
  );
};

export default SearchFilters;
