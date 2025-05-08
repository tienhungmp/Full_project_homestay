
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { setAuthHeader, isTokenExpired, refreshAccessToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interface
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  success: boolean;
}

// Request function with error handling
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    // Check and refresh token if needed before making the request
    await checkAndRefreshToken();
    
    // Add auth token to request if available
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens && config.headers) {
      const { accessToken } = JSON.parse(storedTokens);
      config.headers = {
        ...config.headers,
        ...setAuthHeader(accessToken),
      };
    }
    
    const response: AxiosResponse<T> = await api(config);
    
    return {
      data: response.data,
      error: null,
      status: response.status,
      success: true
    };
  } catch (err) {
    const error = err as AxiosError;
    const status = error.response?.status || 500;
    const errorMessage = extractErrorMessage(error);
    
    // Handle unauthorized errors
    if (status === 401) {
      // Try to refresh token if unauthorized
      const refreshed = await attemptTokenRefresh();
      
      // If token refresh was successful, retry the original request
      if (refreshed) {
        return apiRequest<T>(config);
      } else {
        // If refresh failed, log out the user
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
        window.location.href = '/login'; // Redirect to login page
      }
    }
    
    // Log the error to console
    console.error('API Error:', error);
    
    // Show toast notification for error (optional, can be commented out)
    toast.error(errorMessage);
    
    return {
      data: null,
      error: errorMessage,
      status,
      success: false
    };
  }
};

// Check if token needs refresh and refresh if needed
const checkAndRefreshToken = async (): Promise<boolean> => {
  const storedTokens = localStorage.getItem('auth_tokens');
  if (!storedTokens) return false;
  
  try {
    const { accessToken, refreshToken } = JSON.parse(storedTokens);
    
    // Check if access token is expired
    if (isTokenExpired(accessToken) && refreshToken) {
      return await attemptTokenRefresh();
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};

// Attempt to refresh the token
const attemptTokenRefresh = async (): Promise<boolean> => {
  const storedTokens = localStorage.getItem('auth_tokens');
  if (!storedTokens) return false;
  
  try {
    const { refreshToken } = JSON.parse(storedTokens);
    if (!refreshToken) return false;
    
    const newTokens = await refreshAccessToken(refreshToken);
    return !!newTokens;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Helper function to extract error message
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with a non-2xx status
    const data = error.response.data as any;
    return data.message || data.error || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'No response from server. Please check your connection.';
  } else {
    // Error in setting up the request
    return error.message || 'An unexpected error occurred';
  }
};

// Convenience methods for common HTTP operations
export const get = <T>(url: string, params?: object, config?: AxiosRequestConfig) => {
  return apiRequest<T>({
    method: 'GET',
    url,
    params,
    ...config
  });
};

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return apiRequest<T>({
    method: 'POST',
    url,
    data,
    ...config
  });
};

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return apiRequest<T>({
    method: 'PUT',
    url,
    data,
    ...config
  });
};

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return apiRequest<T>({
    method: 'PATCH',
    url,
    data,
    ...config
  });
};

export const del = <T>(url: string, config?: AxiosRequestConfig) => {
  return apiRequest<T>({
    method: 'DELETE',
    url,
    ...config
  });
};

export default api;
