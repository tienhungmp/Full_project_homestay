
import React from 'react';
import {
  Wifi,
  Snowflake,
  Tv,
  Utensils,
  WashingMachine,
  Car,
  Droplet,
  Leaf,
  Flame,
  Camera,
  Shield,
  Microwave,
  Refrigerator
} from "lucide-react";

interface PropertyAmenitiesProps {
  amenities: string[];
}

const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  const getIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-4 w-4 mr-2" />;
      case "Air Conditioning":
      case "Điều hòa":
        return <Snowflake className="h-4 w-4 mr-2" />;
      case "TV":
        return <Tv className="h-4 w-4 mr-2" />;
      case "Kitchen":
      case "Bếp đầy đủ":
        return <Utensils className="h-4 w-4 mr-2" />;
      case "Washing Machine":
        return <WashingMachine className="h-4 w-4 mr-2" />;
      case "Free Parking":
      case "Bãi đỗ xe":
        return <Car className="h-4 w-4 mr-2" />;
      case "Pool":
        return <Utensils className="h-4 w-4 mr-2" />; // hoặc một biểu tượng nước
      case "Garden":
        return <Leaf className="h-4 w-4 mr-2" />;
      case "BBQ":
        return <Flame className="h-4 w-4 mr-2" />;
      case "Hot Water":
        return <Droplet className="h-4 w-4 mr-2" />;
      case "Refrigerator":
        return <Refrigerator className="h-4 w-4 mr-2" />;
      case "Microwave":
        return <Microwave className="h-4 w-4 mr-2" />;
      case "Security Camera":
        return <Camera className="h-4 w-4 mr-2" />;
      case "First Aid Kit":
        return <Camera className="h-4 w-4 mr-2" />;
      case "Fire Extinguisher":
        return <Shield className="h-4 w-4 mr-2" />; // có thể thay bằng icon chữa cháy
      default:
        return null;
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
