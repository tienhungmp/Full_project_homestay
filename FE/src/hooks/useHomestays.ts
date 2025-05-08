
import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Property } from '@/types/property';

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
