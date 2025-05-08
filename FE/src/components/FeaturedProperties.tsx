
import React from 'react';
import { Button } from "@/components/ui/button";
import PropertyCard from './PropertyCard';

// Sample property data
const featuredProperties = [
  {
    id: "1",
    name: "Vinhomes Riverside Villa",
    location: "Hà Nội",
    price: 1200000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    type: "Villa"
  },
  {
    id: "2",
    name: "Sapa Retreat Homestay",
    location: "Lào Cai",
    price: 850000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    type: "Homestay"
  },
  {
    id: "3",
    name: "Đà Nẵng Beach Resort",
    location: "Đà Nẵng",
    price: 1500000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    type: "Resort"
  },
  {
    id: "4",
    name: "Phú Quốc Ocean View",
    location: "Kiên Giang",
    price: 2200000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    type: "Villa"
  },
  {
    id: "5",
    name: "Hội An Ancient House",
    location: "Quảng Nam",
    price: 950000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1533664488202-63814db83cb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    type: "Homestay"
  },
  {
    id: "6",
    name: "Nha Trang Beachfront Hotel",
    location: "Khánh Hòa",
    price: 1800000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80",
    type: "Hotel"
  },
];

const FeaturedProperties = () => {
  return (
    <section className="container py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Chỗ nghỉ nổi bật</h2>
          <p className="text-muted-foreground mt-2">Khám phá những lựa chọn được yêu thích nhất</p>
        </div>
        <Button variant="outline" className="hidden md:inline-flex">
          Xem tất cả
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredProperties.map(property => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Button variant="outline">
          Xem tất cả
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProperties;
