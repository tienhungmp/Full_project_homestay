
import React from 'react';
import { Star, MapPin } from 'lucide-react';

interface PropertyHeaderProps {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
}

const PropertyHeader = ({ name, location, rating, reviewCount }: PropertyHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow mr-1" />
          <span>{rating.toFixed(1)}</span>
          <span className="mx-1">·</span>
          <span>{reviewCount} đánh giá</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
