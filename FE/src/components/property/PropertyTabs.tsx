
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyDescription from './PropertyDescription';
import PropertyAmenities from './PropertyAmenities';
import PropertyReviews from './PropertyReviews';
import PropertyPolicies from './PropertyPolicies';

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

interface PropertyTabsProps {
  description: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  policies: {
    checkin: string;
    checkout: string;
    cancellation: string;
    rules: string[];
  };
}

const PropertyTabs = ({
  description,
  amenities,
  rating,
  reviewCount,
  reviews,
  policies
}: PropertyTabsProps) => {
  return (
    <Tabs defaultValue="detail">
      <TabsList>
        <TabsTrigger value="detail">Chi tiết</TabsTrigger>
        <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
        <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        <TabsTrigger value="policies">Chính sách</TabsTrigger>
      </TabsList>
      
      <TabsContent value="detail" className="mt-4">
        <PropertyDescription description={description} />
      </TabsContent>

      <TabsContent value="amenities" className="mt-4">
        <PropertyAmenities amenities={amenities} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-4">
        <PropertyReviews 
          rating={rating} 
          reviewCount={reviewCount} 
          reviews={reviews} 
        />
      </TabsContent>

      <TabsContent value="policies" className="mt-4">
        <PropertyPolicies policies={policies} />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;
