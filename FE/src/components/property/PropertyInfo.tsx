
import React from 'react';

interface PropertyInfoProps {
  type: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  host: {
    name: string;
    image: string;
  };
}

const PropertyInfo = ({ type, location, bedrooms, bathrooms, guests, host }: PropertyInfoProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-xl font-semibold">{type} tại {location.split(',')[0]}</h2>
        <p className="text-muted-foreground">
          {bedrooms} phòng ngủ • {bathrooms} phòng tắm • Tối đa {guests} khách
        </p>
      </div>
      <div className="flex items-center">
        <img 
          src={host.image} 
          alt={host.name} 
          className="w-12 h-12 rounded-full object-cover" 
        />
        <div className="ml-2">
          <p className="font-medium">{host.name}</p>
          <p className="text-xs text-muted-foreground">Chủ nhà</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
