
import React, { useReducer, useEffect } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterCredentials, UserRole } from '@/types/auth';
import { post } from '@/lib/api';
import { toast } from 'sonner';
import AuthContext from './AuthContext';
import { authReducer, initialState } from './authReducer';

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = localStorage.getItem('auth_tokens');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedTokens && storedUser) {
        try {
          const tokens = JSON.parse(storedTokens) as AuthTokens;
          const user = JSON.parse(storedUser) as User;
          
          // Here you could add token validation or refresh logic
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, tokens },
          });
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          localStorage.removeItem('auth_tokens');
          localStorage.removeItem('auth_user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens and user in localStorage
        localStorage.setItem('auth_tokens', JSON.stringify(tokens));
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Update auth state
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, tokens },
        });
        
        toast.success('Đăng nhập thành công');
        return;
      }
      
      throw new Error(response.error || 'Đăng nhập thất bại');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Validate password match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Mật khẩu không khớp');
      }
      
      const response = await post<{ user: User; tokens: AuthTokens }>('/auth/register', credentials);
      
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        
        // Store tokens and user in localStorage
        localStorage.setItem('auth_tokens', JSON.stringify(tokens));
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Update auth state
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, tokens },
        });
        
        toast.success('Đăng ký thành công');
        return;
      }
      
      throw new Error(response.error || 'Đăng ký thất bại');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
    toast.success('Đã đăng xuất thành công');
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has required role
  const checkRole = (roles: UserRole[]): boolean => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
