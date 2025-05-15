
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
          src={host.image ? "" : "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
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
