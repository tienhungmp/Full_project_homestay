import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { useGetHomestayTopRate } from "@/hooks/useHomestays";

const FeaturedProperties = () => {
  const { getHomestayTopRate, homestays } = useGetHomestayTopRate();

  useEffect(() => {
    getHomestayTopRate();
  }, []);
  
  return (
    <>
      {homestays && (
        <section className="container py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Chỗ nghỉ nổi bật</h2>
              <p className="text-muted-foreground mt-2">
                Khám phá những lựa chọn được yêu thích nhất
              </p>
            </div>
            <Button variant="outline" className="hidden md:inline-flex">
              Xem tất cả
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {homestays.map((property) => (
              <PropertyCard
                key={property._id}
                {...property}
              />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline">Xem tất cả</Button>
          </div>
        </section>
      )}
    </>
  );
};

export default FeaturedProperties;
