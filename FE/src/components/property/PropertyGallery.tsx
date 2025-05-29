import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Images } from 'lucide-react';
import ImageGalleryModal from './ImageGalleryModal';
import { linkBackend } from '@/utils/Constant';

type PropertyImage = string;

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

const PropertyGallery = ({ images, propertyName }: PropertyGalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filledImages = [...images.slice(0, 4)];

  while (filledImages.length < 4) {
    filledImages.push(images[0]);
  }
  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
        <div className="md:col-span-2 relative">
          <img 
            src={linkBackend + mainImage} 
            alt={propertyName} 
            className="w-full h-[400px] object-cover rounded-lg"
          />
          {/* View More Images Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 text-gray-800 hover:bg-white"
            size="sm"
          >
            <Images className="h-4 w-4 mr-2" />
            Xem thêm ảnh ({images.length})
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={linkBackend + image}
              alt={`${propertyName} ${index + 1}`}
              className="w-full h-[196px] object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
      </div>

      <ImageGalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        propertyName={propertyName}
      />
    </>
  );
};

export default PropertyGallery;