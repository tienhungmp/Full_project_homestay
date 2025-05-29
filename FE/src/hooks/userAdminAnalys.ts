import { useApi } from "./useApi";


export const useGetTotalAnalysis = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getTotalAnalysis  = async () => {
      const response = await fetchData<any>(`/adminAnalys`);
      return response;
    };
  
    return {
      getTotalAnalysis,
      isLoading,
      error,
    };
}


export const useGetAllHomestay = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getAllHomestay  = async () => {
      const response = await fetchData<any>(`/adminAnalys/list-homestays`);
      return response;
    };
  
    return {
      getAllHomestay,
      isLoading,
      error,
    };
}


export const useGetAllUser = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getAllUser = async () => {
      const response = await fetchData<any>(`/adminAnalys/all-user`);
      return response;
    };
  
    return {
      getAllUser,
      isLoading,
      error,
    };
}


export const useGetAllBooking = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getAllBooking = async () => {
      const response = await fetchData<any>(`/adminAnalys/all-bookings`);
      return response;
    };
  
    return {
      getAllBooking,
      isLoading,
      error,
    };
}



export const useGetAllReviews = () => {
    const { fetchData, isLoading, error } = useApi();
  
    const getAllReviews = async () => {
      const response = await fetchData<any>(`/adminAnalys/all-reviews`);
      return response;
    };
  
    return {
      getAllReviews,
      isLoading,
      error,
    };
}

