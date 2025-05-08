
import React from 'react';

interface PropertyDescriptionProps {
  description: string;
}

const PropertyDescription = ({ description }: PropertyDescriptionProps) => {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <h3 className="font-medium mb-2">Mô tả</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default PropertyDescription;
