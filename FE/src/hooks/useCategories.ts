import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export const useCategories = () => {
  const { fetchData } = useApi();

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetchData<{ data: Category[] }>('/categories');

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories');
      }

      return response.data;
    },
  });
};