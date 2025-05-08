
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleAdminLogin = () => {
    localStorage.setItem("adminRedirect", "true");
    navigate("/login");
  };

  // Using the role-based access control
  if (isAuthenticated && user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-50 flex items-center justify-center rounded-full">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Quyền truy cập bị từ chối</h1>
            <p className="text-gray-600">
              Bạn cần có quyền quản trị viên để truy cập trang này.
            </p>
            <Button 
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-50 flex items-center justify-center rounded-full">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Quyền truy cập bị từ chối</h1>
            <p className="text-gray-600">
              Bạn cần đăng nhập với tài khoản quản trị viên để truy cập trang này.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={handleAdminLogin}
              >
                Đăng nhập quản trị
              </Button>
              <Button 
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <SidebarProvider>
            <div className="flex w-full">
              <AdminDashboard />
            </div>
          </SidebarProvider>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
