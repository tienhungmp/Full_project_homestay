
import { jwtDecode } from 'jwt-decode';
import { AuthTokens } from '@/types/auth';
import { post } from './api';

// JWT token interface
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired (with a small buffer)
    return decoded.exp < currentTime - 60; // 60 second buffer
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume token is invalid/expired if it can't be decoded
  }
};

// Get user info from token
export const getUserFromToken = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Refresh the access token using refresh token
export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokens | null> => {
  try {
    const response = await post<AuthTokens>('/auth/refresh', { refreshToken });
    
    if (response.success && response.data) {
      // Update tokens in localStorage
      const newTokens: AuthTokens = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken || refreshToken, // Use new refresh token if provided
      };
      
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
      return newTokens;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

// Add JWT to axios headers
export const setAuthHeader = (token: string | null) => {
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};
