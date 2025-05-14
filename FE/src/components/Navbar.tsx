import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-blue">BlissStay</span>
        </Link>
        
        <button 
          className="block md:hidden" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Trang chủ
          </Link>
          <Link to="/search" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Tìm kiếm
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Giới thiệu
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Liên hệ
          </Link>
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
              Quản trị
            </Link>
          )}
          
          {isAuthenticated && (user?.role === 'host' || user?.role === 'admin') && (
            <Link to="/host" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
              Quản lý chỗ nghỉ
            </Link>
          )}
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User size={18} />
                  <span>{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Hồ sơ cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/booking-history">Lịch sử đặt phòng</Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Quản trị viên</Link>
                  </DropdownMenuItem>
                )}
                {(user?.role === 'host' || user?.role === 'admin') && (
                  <DropdownMenuItem asChild>
                    <Link to="/host">Quản lý chỗ nghỉ</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90" asChild>
                <Link to="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
        
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-white z-50 flex flex-col md:hidden animate-fade-in">
            <nav className="flex flex-col gap-4 p-6">
              <Link 
                to="/" 
                className="text-lg font-medium py-2 hover:text-brand-blue transition-colors"
                onClick={toggleMenu}
              >
                Trang chủ
              </Link>
              <Link 
                to="/search" 
                className="text-lg font-medium py-2 hover:text-brand-blue transition-colors"
                onClick={toggleMenu}
              >
                Tìm kiếm
              </Link>
              <Link 
                to="/about" 
                className="text-lg font-medium py-2 hover:text-brand-blue transition-colors"
                onClick={toggleMenu}
              >
                Giới thiệu
              </Link>
              <Link 
                to="/contact" 
                className="text-lg font-medium py-2 hover:text-brand-blue transition-colors"
                onClick={toggleMenu}
              >
                Liên hệ
              </Link>
              
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-lg font-medium py-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                  onClick={toggleMenu}
                >
                  Quản trị
                </Link>
              )}
              
              {isAuthenticated && (user?.role === 'host' || user?.role === 'admin') && (
                <Link 
                  to="/host" 
                  className="text-lg font-medium py-2 text-green-600 hover:text-green-700 transition-colors"
                  onClick={toggleMenu}
                >
                  Quản lý chỗ nghỉ
                </Link>
              )}
              
              <div className="mt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Xin chào, {user?.name}</p>
                    <Link 
                      to="/profile" 
                      className="py-2 hover:text-brand-blue"
                      onClick={toggleMenu}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link 
                      to="/booking-history" 
                      className="py-2 hover:text-brand-blue"
                      onClick={toggleMenu}
                    >
                      <Calendar size={16} className="inline mr-2" />
                      Lịch sử đặt phòng
                    </Link>
                    <Button 
                      variant="outline" 
                      className="mt-2 w-full justify-start text-red-500" 
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="lg" className="w-full" asChild onClick={toggleMenu}>
                      <Link to="/login">Đăng nhập</Link>
                    </Button>
                    <Button size="lg" className="w-full bg-brand-blue hover:bg-brand-blue/90" asChild onClick={toggleMenu}>
                      <Link to="/register">Đăng ký</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
