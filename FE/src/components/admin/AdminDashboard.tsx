
import React, { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  Users, 
  Building, 
  BarChart, 
  FileText, 
  Settings,
  Database,
  Star
} from "lucide-react";
import { AdminOverview } from "./AdminOverview";
import { AdminProperties } from "./AdminProperties";
import { AdminUsers } from "./AdminUsers";
import { AdminBookings } from "./AdminBookings";
import { AdminReviews } from "./AdminReviews";
import { AdminSettings } from "./AdminSettings";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "properties":
        return <AdminProperties />;
      case "users":
        return <AdminUsers />;
      case "bookings":
        return <AdminBookings />;
      case "reviews":
        return <AdminReviews />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center px-2 py-3">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">BlissStay Admin</h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quản lý chung</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("overview")}
                    isActive={activeTab === "overview"}
                  >
                    <BarChart size={20} />
                    <span>Tổng quan</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("properties")}
                    isActive={activeTab === "properties"}
                  >
                    <Building size={20} />
                    <span>Chỗ nghỉ</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("users")}
                    isActive={activeTab === "users"}
                  >
                    <Users size={20} />
                    <span>Người dùng</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("bookings")}
                    isActive={activeTab === "bookings"}
                  >
                    <FileText size={20} />
                    <span>Đặt phòng</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("reviews")}
                    isActive={activeTab === "reviews"}
                  >
                    <Star size={20} />
                    <span>Đánh giá</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("settings")}
                    isActive={activeTab === "settings"}
                  >
                    <Settings size={20} />
                    <span>Cài đặt</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Database size={20} />
                    <span>Dữ liệu & Sao lưu</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-3 text-xs text-gray-500">
            <p>BlissStay Admin v1.0</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-6">
          {renderContent()}
        </div>
      </SidebarInset>
    </>
  );
}
