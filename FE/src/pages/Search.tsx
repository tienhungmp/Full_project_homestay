
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';

const Search = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [priceRange, setPriceRange] = useState([500000, 3000000]);
  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    'Hotel': false,
    'Villa': false,
    'Homestay': false,
    'Resort': false,
  });
  const [selectedAmenities, setSelectedAmenities] = useState<Record<string, boolean>>({
    'Wifi': false,
    'Hồ bơi': false,
    'Bãi đỗ xe': false,
    'Điều hòa': false,
    'Bếp': false,
    'Máy giặt': false,
  });
  const [minRating, setMinRating] = useState(0);
  
  // Convert selected types from Record<string, boolean> to string[]
  const selectedTypesArray = Object.entries(selectedTypes)
    .filter(([_, isSelected]) => isSelected)
    .map(([type]) => type);
  
  // Convert selected amenities from Record<string, boolean> to string[]
  const selectedAmenitiesArray = Object.entries(selectedAmenities)
    .filter(([_, isSelected]) => isSelected)
    .map(([amenity]) => amenity);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Tìm kiếm chỗ ở</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SearchFilters
              location={location}
              setLocation={setLocation}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              minRating={minRating}
              setMinRating={setMinRating}
            />
          </div>
          
          <div className="lg:col-span-3">
            <SearchResults 
              location={location}
              checkIn={checkIn}
              checkOut={checkOut}
              priceRange={priceRange as [number, number]}
              selectedTypes={selectedTypesArray}
              selectedAmenities={selectedAmenitiesArray}
              minRating={minRating}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
