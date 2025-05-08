
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['user', 'host', 'admin'],
}) => {
  const { isAuthenticated, isLoading, user, checkRole } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error('Vui lòng đăng nhập để tiếp tục');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!checkRole(allowedRoles)) {
    toast.error('Bạn không có quyền truy cập trang này');
    return <Navigate to="/" replace />;
  }

  // If authenticated and has proper role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
