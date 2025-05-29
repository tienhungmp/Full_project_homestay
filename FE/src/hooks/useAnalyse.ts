import { useState } from "react";
import { useApi } from "./useApi";

export const useGetRevenueHost = () => {
    const { fetchData, isLoading, error } = useApi();
    const [revenue, setRevenue] = useState<any | null>(null);
  
    const getRevenueHost = async (querys : {periodType: string, count: number, hostId: string}) => {
      const response = await fetchData<any>(`/bookings/host-revenue?periodType=${querys.periodType}&count=${querys.count}&hostId=${querys.hostId}`);
      if (response.success && response.data) {
        setRevenue(response.data.data);
      }
      return response;
    };
  
    return {
      getRevenueHost,
      revenue,
      isLoading,
      error,
    };
  };