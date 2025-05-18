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

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  success: boolean;
}

export const apiRequest = async <T>(
  config: AxiosRequestConfig & { _retry?: boolean }
): Promise<ApiResponse<T>> => {
  try {
    // 1. Refresh token nếu cần
    await checkAndRefreshToken();

    // 2. Thêm access token vào headers
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      const { accessToken } = JSON.parse(storedTokens);
      config.headers = {
        ...config.headers,
        ...setAuthHeader(accessToken),
      };
    }

    // 3. Gửi request
    const response: AxiosResponse<T> = await api(config);
    return {
      data: response.data,
      error: null,
      status: response.status,
      success: true,
    };
  } catch (err) {
    const error = err as AxiosError;
    const status = error.response?.status || 500;
    const errorMessage = extractErrorMessage(error);

    // 4. Nếu token hết hạn => thử refresh (chỉ thử 1 lần)
    if (status === 401 && !config._retry) {
      config._retry = true;
      const refreshed = await attemptTokenRefresh();
      if (refreshed) return apiRequest<T>(config);

      // Refresh thất bại => đăng xuất
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    // 5. Hiển thị lỗi
    console.error('API Error:', error);
    toast.error(errorMessage);

    return {
      data: null,
      error: errorMessage,
      status,
      success: false,
    };
  }
};

// 🔄 Kiểm tra và làm mới token nếu cần
const checkAndRefreshToken = async (): Promise<boolean> => {
  const storedTokens = localStorage.getItem('auth_tokens');
  if (!storedTokens) return false;

  try {
    const { accessToken, refreshToken } = JSON.parse(storedTokens);
    if (isTokenExpired(accessToken) && refreshToken) {
      return await attemptTokenRefresh();
    }
    return true;
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};

// ♻️ Cố gắng refresh token
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

// 🧠 Tách thông báo lỗi
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    const data = error.response.data as any;
    return data.message || data.error || `Server error: ${error.response.status}`;
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// 🔁 Convenience HTTP methods
export const get = <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
  apiRequest<T>({ method: 'GET', url, params, ...config });

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiRequest<T>({ method: 'POST', url, data, ...config });

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiRequest<T>({ method: 'PUT', url, data, ...config });

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  apiRequest<T>({ method: 'PATCH', url, data, ...config });

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>({ method: 'DELETE', url, ...config });

export default api;
