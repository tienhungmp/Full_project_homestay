import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { BookingRequest, Order, OrderRequest } from '@/types/order';
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



export const useOrderWithoutAccount = () => {
  const { createData, isLoading, error } = useApi();

  const createOrderWithoutAccount = async (bookingData: BookingRequest) => {
    const response = await createData<any>('/bookings/create-booking-without-account', bookingData);
    return response;
  };

  return {
    createOrderWithoutAccount,
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


  export const useGetInfoHostDashboard = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getGetInfoHostDashboard = async () => {
      const response = await fetchData<any>(`/bookings/host-dashboard`);
      return response;
    };
  
    return {
      getGetInfoHostDashboard,
      isLoading,
      error,
    };
  };

  export const useGetAllBookingOfHost= () => {
    const { fetchData, isLoading, error } = useApi();

    const getAllBookingOfHost = async () => {
      const response = await fetchData<any>(`/bookings/get-all-bookings-of-host`);
      return response;
    };

    return {
      getAllBookingOfHost,
      isLoading,
      error,
    };
  };

  export const useCheckAvailabilityHomestay = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getCheckAvailabilityHomestay = async (params: {homestayId:string, date:Date}) => {
      const response = await fetchData<any>(`/bookings/check-availability?homestayId=${params.homestayId}&date=${params.date}`);
      return response;
    };
  
    return {
      getCheckAvailabilityHomestay,
      isLoading,
      error,
    };
  };

  export const useUpadteStatusOrder = () => {
    const { updateData, isLoading, error } = useApi();
  
    const updateOrderStatus = async (orderInfo: {orderId: string, paymentStatus?: string, bookingStatus?:string}) => {
      const response = await updateData<any>(`/bookings/${orderInfo.orderId}`, orderInfo);
      return response;
    };
  
    return {
      updateOrderStatus,
      isLoading,
      error,
    };
  }

  export const useGetBookingsByRole = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getBookingsByRole  = async (page?: number, number?: number) => {
      const response = await fetchData<any>(`/bookings/get-booking-by-role?page=${page}&number=${number}`);
      return response;
    };
  
    return {
      getBookingsByRole,
      isLoading,
      error,
    };
  }


  export const useGetInvoiceByCode = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getInvoiceByCode  = async (invoiceCode: string) => {
      const encodedCode = encodeURIComponent(invoiceCode);
      const response = await fetchData<any>(`/bookings/search-invoice?invoiceCode=${encodedCode}`);
      return response;
    };
  
    return {
      getInvoiceByCode,
      isLoading,
      error,
    };
  }