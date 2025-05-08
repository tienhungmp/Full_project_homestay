
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { User, Mail, Phone, MapPin, Shield, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* User profile section */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Hồ sơ cá nhân</CardTitle>
                  <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <div className="w-24 h-24 bg-brand-blue/20 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-brand-blue" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{user?.name}</h3>
                      <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'host' ? 'Chủ nhà' : 'Người dùng'}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">Chưa cập nhật</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">Chưa cập nhật</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Loại tài khoản</p>
                        <p className="font-medium capitalize">{user?.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày tham gia</p>
                        <p className="font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">Chỉnh sửa hồ sơ</Button>
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* User content section */}
            <div className="w-full md:w-2/3">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Lịch sử đặt phòng</CardTitle>
                  <CardDescription>Xem thông tin các đơn đặt phòng của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>Bạn chưa có đơn đặt phòng nào</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/search')}
                    >
                      Tìm kiếm chỗ nghỉ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security card */}
              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật tài khoản</CardTitle>
                  <CardDescription>Quản lý mật khẩu và tính năng bảo mật</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mật khẩu</h3>
                    <p className="text-sm text-gray-500">Cập nhật mật khẩu định kỳ để tăng cường bảo mật</p>
                    <Button variant="outline" className="mt-2">Đổi mật khẩu</Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Thiết bị đã đăng nhập</h3>
                    <p className="text-sm text-gray-500">Kiểm tra và quản lý các thiết bị đã đăng nhập</p>
                    <Button variant="outline" className="mt-2">Xem thiết bị</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
