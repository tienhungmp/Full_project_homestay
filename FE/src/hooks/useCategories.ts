import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export const useCategories = () => {
  const { fetchData, isLoading, error } = useApi();

  const getCategories = async () => {
    const response = await fetchData<any>(`/categories`);
    return response;
  };
  
  return {
    getCategories
  }
};