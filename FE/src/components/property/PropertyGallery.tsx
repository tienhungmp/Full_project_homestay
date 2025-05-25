
import { linkBackend } from '@/utils/Constant';
import React, { useState } from 'react';

type PropertyImage = string;

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

const PropertyGallery = ({ images, propertyName }: PropertyGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const filledImages = [...images.slice(0, 4)];

  while (filledImages.length < 4) {
    filledImages.push(images[0]);
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
      <div className="md:col-span-2">
        <img 
          src={linkBackend + mainImage} 
          alt={propertyName} 
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {filledImages.slice(0, 4).map((image, index) => (
          <img
            key={index}
            src={linkBackend + image}
            alt={`${propertyName} ${index + 1}`}
            className="w-full h-[196px] object-cover rounded-lg cursor-pointer"
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery;
