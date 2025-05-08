import React, { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import { useHomestays } from '@/hooks/useHomestays';
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchResultsProps {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  priceRange?: [number, number];
  selectedTypes?: string[];
  selectedAmenities?: string[];
  minRating?: number;
}

const ITEMS_PER_PAGE = 9;

const SearchResults: React.FC<SearchResultsProps> = ({
  location,
  checkIn,
  checkOut,
  priceRange,
  selectedTypes,
  selectedAmenities,
  minRating,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const filters = {
    location,
    checkIn,
    checkOut,
    minPrice: priceRange?.[0],
    maxPrice: priceRange?.[1],
    types: selectedTypes?.filter(type => type),
    amenities: selectedAmenities?.filter(amenity => amenity),
    minRating,
  };

  const { data, isLoading, error } = useHomestays(currentPage, ITEMS_PER_PAGE, filters);

  
  const properties = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Đã có lỗi xảy ra</h3>
        <p className="text-muted-foreground">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{totalItems} kết quả tìm thấy</h3>
          </div>
          <select 
            className="border rounded px-3 py-1.5 text-sm"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="recommended">Đề xuất</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>
      
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property._id} {...{...property, image: property.images[0]}} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {getPageNumbers().map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả nào</h3>
          <p className="text-muted-foreground">Hãy thử điều chỉnh lại bộ lọc để tìm được kết quả phù hợp.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
