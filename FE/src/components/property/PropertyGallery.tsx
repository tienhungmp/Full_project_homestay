
import React, { useState } from 'react';

type PropertyImage = string;

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

const PropertyGallery = ({ images, propertyName }: PropertyGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
      <div className="md:col-span-2">
        <img 
          src={mainImage} 
          alt={propertyName} 
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <img
            key={index}
            src={image}
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
