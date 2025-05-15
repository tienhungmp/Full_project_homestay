import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Order, OrderRequest } from '@/types/order';
import { useState } from 'react';

/**
 * Hook tạo order trực tiếp, không dùng react-query
 */
export const useOrder = () => {
  const { createData, isLoading, error } = useApi();

  const createOrder = async (bookingData: OrderRequest) => {
    const response = await createData<any>('/bookings', bookingData);
    return response;
  };

  return {
    createOrder,
    isLoading,
    error,
  };
};

export const useUpadteStatusPaymentOrder = () => {
  const { updateData, isLoading, error } = useApi();

  const updateOrder = async (orderInfo: {orderId: string, status: string}) => {
    const response = await updateData<any>('/bookings/payment-success', orderInfo);
    return response;
  };

  return {
    updateOrder,
    isLoading,
    error,
  };
}

export const useCreatePaymentUrl  = () => {
    const { createData, isLoading, error } = useApi();

    const createPaymentUrl = async (orderInfo: {orderId: string, totalPrice: number}) => {
        const response = await createData<any>('/bookings/create-payment', orderInfo);
        return response;
      };

      return {
        createPaymentUrl,
        isLoading,
        error,
      };
}


export const useGetOrderById = () => {
    const { fetchData, isLoading, error } = useApi();
    const [order, setOrder] = useState<any | null>(null);
  
    const getOrderById = async (orderId: string) => {
      const response = await fetchData<any>(`/bookings/${orderId}`);
      if (response.success && response.data) {
        console.log(response)
        setOrder(response.data);
      }
      return response;
    };
  
    return {
      getOrderById,
      order,
      isLoading,
      error,
    };
  };