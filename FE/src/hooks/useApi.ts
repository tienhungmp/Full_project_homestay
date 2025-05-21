
import { useState } from 'react';
import { get, post, put, del, patch, ApiResponse } from '@/lib/api';
import { AxiosRequestConfig } from 'axios';

// Generic hook for API calls with loading and error state management
export function useApi() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generic function to handle API requests
  const apiCall = async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await requestFn();
      
      if (!response.success) {
        setError(response.error);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        data: null,
        error: errorMessage,
        status: 500,
        success: false
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper functions for HTTP methods
  const fetchData = <T>(url: string, params?: object) => {
    return apiCall<T>(() => get<T>(url, params));
  };

  const createData = <T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ) => {
    return apiCall<T>(() => post<T>(url, data, config));
  };

  const updateData = <T>(url: string, data: any) => {
    return apiCall<T>(() => put<T>(url, data));
  };

  const patchData = <T>(url: string, data: any) => {
    return apiCall<T>(() => patch<T>(url, data));
  };

  const deleteData = <T>(url: string) => {
    return apiCall<T>(() => del<T>(url));
  };

  return {
    isLoading,
    error,
    fetchData,
    createData,
    updateData,
    patchData,
    deleteData
  };
}
