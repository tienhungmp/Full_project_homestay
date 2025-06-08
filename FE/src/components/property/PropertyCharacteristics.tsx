import React from 'react';
import { MapPin, Volume2, Trees, Car, Building, Wifi } from 'lucide-react';

interface PropertyCharacteristicsProps {
  characteristics: string[];
}

const PropertyCharacteristics = ({ characteristics }: PropertyCharacteristicsProps) => {
  const getIcon = (characteristic: string) => {
    const lowercased = characteristic.toLowerCase();
    
    if (lowercased.includes('trung tâm') || lowercased.includes('trung tam')) {
      return <Building className="h-4 w-4 text-blue-600" />;
    }
    if (lowercased.includes('yên tĩnh') || lowercased.includes('yen tinh') || lowercased.includes('tĩnh')) {
      return <Volume2 className="h-4 w-4 text-green-600" />;
    }
    if (lowercased.includes('giao thông') || lowercased.includes('xe')) {
      return <Car className="h-4 w-4 text-purple-600" />;
    }
    if (lowercased.includes('thiên nhiên') || lowercased.includes('cây xanh') || lowercased.includes('xanh')) {
      return <Trees className="h-4 w-4 text-green-600" />;
    }
    if (lowercased.includes('wifi') || lowercased.includes('internet')) {
      return <Wifi className="h-4 w-4 text-blue-600" />;
    }
    
    return <MapPin className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="mt-6 p-4 rounded-lg border bg-white mb-3">
      <h3 className="font-medium mb-3">Đặc điểm nổi bật</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {characteristics.map((characteristic, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
            {getIcon(characteristic)}
            <span>{characteristic}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCharacteristics;