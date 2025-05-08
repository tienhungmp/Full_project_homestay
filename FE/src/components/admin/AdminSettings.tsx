
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground">
          Quản lý cấu hình và thiết lập cho hệ thống
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin trang web</CardTitle>
                <CardDescription>
                  Cài đặt thông tin cơ bản của trang web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Tên trang web</Label>
                    <Input id="site-name" defaultValue="BlissStay" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">URL</Label>
                    <Input id="site-url" defaultValue="https://blissstay.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Mô tả</Label>
                  <Input id="site-description" defaultValue="Nền tảng đặt phòng khách sạn, homestay hàng đầu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email liên hệ</Label>
                  <Input id="contact-email" defaultValue="contact@blissstay.com" />
                </div>
                <Button>Lưu thay đổi</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hiển thị</CardTitle>
                <CardDescription>
                  Tùy chỉnh giao diện người dùng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="display-homepage-banner">Hiển thị banner trang chủ</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị banner quảng cáo ở trang chủ</p>
                  </div>
                  <Switch id="display-homepage-banner" defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="display-featured">Hiển thị phần nổi bật</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị chỗ nghỉ nổi bật ở trang chủ</p>
                  </div>
                  <Switch id="display-featured" defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="display-testimonials">Hiển thị đánh giá</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị đánh giá từ khách hàng ở trang chủ</p>
                  </div>
                  <Switch id="display-testimonials" defaultChecked={true} />
                </div>
                <Button>Lưu thay đổi</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý cài đặt thông báo hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-bookings">Thông báo đặt phòng</Label>
                  <p className="text-sm text-muted-foreground">Nhận email khi có đặt phòng mới</p>
                </div>
                <Switch id="email-bookings" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-registrations">Thông báo đăng ký</Label>
                  <p className="text-sm text-muted-foreground">Nhận email khi có người dùng mới đăng ký</p>
                </div>
                <Switch id="email-registrations" defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-reviews">Thông báo đánh giá</Label>
                  <p className="text-sm text-muted-foreground">Nhận email khi có đánh giá mới</p>
                </div>
                <Switch id="email-reviews" defaultChecked={true} />
              </div>
              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>
                Quản lý cài đặt bảo mật hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Xác thực hai yếu tố</Label>
                  <p className="text-sm text-muted-foreground">Bật xác thực hai yếu tố cho tài khoản quản trị</p>
                </div>
                <Switch id="two-factor" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-logout">Tự động đăng xuất</Label>
                  <p className="text-sm text-muted-foreground">Tự động đăng xuất sau 30 phút không hoạt động</p>
                </div>
                <Switch id="auto-logout" defaultChecked={true} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Đổi mật khẩu quản trị</Label>
                <Input id="password" type="password" placeholder="Mật khẩu mới" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input id="confirm-password" type="password" placeholder="Xác nhận mật khẩu" />
              </div>
              <Button>Cập nhật mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
