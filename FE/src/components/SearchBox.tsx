
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { vi } from 'date-fns/locale';

const SearchBox = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ location, checkIn, checkOut, guests });
    // Handle search logic here
  };

  return (
    <div className="search-box mx-auto max-w-5xl bg-white rounded-lg p-4 md:p-6 -mt-20 relative z-10">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Địa điểm
          </label>
          <Input
            id="location"
            placeholder="Nhập thành phố, địa điểm..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Check-in Date */}
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

        {/* Check-out Date */}
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

        {/* Guests + Search Button */}
        <div className="flex flex-col">
          <label htmlFor="guests" className="block text-sm font-medium mb-1">
            Số khách
          </label>
          <div className="flex gap-2 h-10">
            <Input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-24"
            />
            <Button type="submit" className="flex-1 bg-brand-blue hover:bg-brand-blue/90">
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
