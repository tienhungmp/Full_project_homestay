
import React from 'react';
import { Wifi, Car, Snowflake, Utensils } from 'lucide-react';

interface PropertyAmenitiesProps {
  amenities: string[];
}

const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  const getIcon = (amenity: string) => {
    switch(amenity) {
      case "Wifi": return <Wifi className="h-4 w-4 mr-2" />;
      case "Bãi đỗ xe": return <Car className="h-4 w-4 mr-2" />;
      case "Điều hòa": return <Snowflake className="h-4 w-4 mr-2" />;
      case "Bếp đầy đủ": return <Utensils className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-white">
      <h3 className="font-medium mb-4">Tiện nghi đi kèm</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            {getIcon(amenity)}
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenities;
