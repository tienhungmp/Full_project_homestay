
import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Property } from '@/types/property';
import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';

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
  const { fetchData, isLoading, error } = useApi();

  const getHomestays = async () => {
    const response = await fetchData<any>('/homestays', {
      page,
      limit,
      ...filters,
      types: filters?.types?.join(','),
      checkIn: filters?.checkIn?.toISOString(),
      checkOut: filters?.checkOut?.toISOString(),
    });
    return response;
  };

  return {
    getHomestays,
    isLoading,
    error,
  };
};


export const useGetHomestayById = () => {
  const { fetchData, isLoading, error } = useApi();
  const [homestay, setHomestay] = useState<any | null>(null);

  const getHomestayById = async (orderId: string) => {
    const response = await fetchData<any>(`/homestays/${orderId}`);
    if (response.success && response.data) {
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

export const useGetAllHomestayByHost= () => {
  const { fetchData, isLoading, error } = useApi();

  const getAllHomestayByHost = async () => {
    const response = await fetchData<any>(`/homestays/getHomestaysByHost`);
    return response;
  };

  return {
    getAllHomestayByHost,
    isLoading,
    error,
  };
};


export const useCreateHomestay = () => {
  const { createData, isLoading, error } = useApi();

  const createHomestay = async (homestayData: any) => {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await createData<any>(
      "/homestays",
        homestayData,
        config
    );
    return response;
  };

  return {
    createHomestay,
    isLoading,
    error,
  };
};

export const useUpdateHomeStay = () => {
  const { updateData, isLoading, error } = useApi();

  const updateHomeStay = async (homestayData: any, homestayId: string) => {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await updateData<any>(
      `/homestays/${homestayId}`,
        homestayData,
        config
    );
    return response;
  };

  return {
    updateHomeStay,
    isLoading,
    error,
  };
};

export const useDeleteHomestay = () => {
  const { deleteData, isLoading, error } = useApi();

  const deleteHomestay = async (homestayId: string) => {
    const response = await deleteData<any>(`/homestays/${homestayId}`);
    return response;
  };

  return {
    deleteHomestay,
    isLoading,
    error, 
  }
}

export const useCheckHomestayAvailability = () => {
  const { fetchData, isLoading, error } = useApi();
  const getCheckHomestayAvailability = async (checkIn: Date, checkOut: Date, homestayId: string) => {
    const response = await fetchData<any>(`/homestays/check-availability?checkIn=${checkIn}&checkOut=${checkOut}&homestayId=${homestayId}`);
    return response;
  };

  return {
    getCheckHomestayAvailability,
    isLoading,
    error,
  };
};

export const useCheckAvailableDates = () => {
  const { fetchData, isLoading, error } = useApi();
  const checkAvailableDates = async (homestayId: string, monthYear: string) => {
    const response = await fetchData<any>(`homestays/available-dates?homestayId=${homestayId}&monthYear=${monthYear}`);
    return response;
  };

  return {
    checkAvailableDates,
    isLoading,
    error,
  };
};