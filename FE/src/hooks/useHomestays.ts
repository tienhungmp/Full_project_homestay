
import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Property } from '@/types/property';
import { useState } from 'react';

interface FilterParams {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  amenities?: string[];
  minRating?: number;
}

export const useHomestays = (
  page: number = 1, 
  limit: number = 9,
  filters?: FilterParams
) => {
  const { fetchData } = useApi();

  return useQuery({
    queryKey: ['homestays', page, limit, filters],
    queryFn: async () => {
      const response = await fetchData<{
        data: Property[];
        total: number;
      }>('/homestays', {
        page,
        limit,
        ...filters,
        types: filters?.types?.join(','),
        checkIn: filters?.checkIn?.toISOString(),
        checkOut: filters?.checkOut?.toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch homestays');
      }

      return response.data;
    },
  });
};


export const useGetHomestayById = () => {
  const { fetchData, isLoading, error } = useApi();
  const [homestay, setHomestay] = useState<any | null>(null);

  const getHomestayById = async (orderId: string) => {
    const response = await fetchData<any>(`/homestays/${orderId}`);
    if (response.success && response.data) {
      console.log(response.data)
      setHomestay(response.data.data);
    }
    return response;
  };

  return {
    getHomestayById,
    homestay,
    isLoading,
    error,
  };
};


export const useGetHomestayTopRate = () => {
  const { fetchData, isLoading, error } = useApi();
  const [homestays, setHomestays] = useState<any | null>(null);

  const getHomestayTopRate = async () => {
    const response = await fetchData<any>(`/homestays/top-rated`);
    if (response.success && response.data) {
      console.log(response.data)
      setHomestays(response.data.data);
    }
    return response;
  };

  return {
    getHomestayTopRate,
    homestays,
    isLoading,
    error,
  };
};