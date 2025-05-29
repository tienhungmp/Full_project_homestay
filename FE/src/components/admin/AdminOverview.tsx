
import React, { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Users, Home, PackageCheck, Star } from "lucide-react";
import { useGetTotalAnalysis } from "@/hooks/userAdminAnalys";

// Sample data - in a real app, this would come from an API
const bookingData = [
  { name: "Tháng 1", bookings: 40 },
  { name: "Tháng 2", bookings: 35 },
  { name: "Tháng 3", bookings: 50 },
  { name: "Tháng 4", bookings: 65 },
  { name: "Tháng 5", bookings: 80 },
  { name: "Tháng 6", bookings: 75 },
  { name: "Tháng 7", bookings: 90 },
  { name: "Tháng 8", bookings: 110 },
  { name: "Tháng 9", bookings: 95 },
  { name: "Tháng 10", bookings: 85 },
  { name: "Tháng 11", bookings: 70 },
  { name: "Tháng 12", bookings: 60 },
];

const featuredProperties = [
  { id: 1, name: "Villa Green Garden", location: "Hội An", bookings: 124, rating: 4.8 },
  { id: 2, name: "Resort Ocean Pearl", location: "Phú Quốc", bookings: 98, rating: 4.9 },
  { id: 3, name: "Homestay Mountainview", location: "Đà Lạt", bookings: 87, rating: 4.6 },
];

export function AdminOverview() {
  const { getTotalAnalysis } = useGetTotalAnalysis();
  const [totalAnalysis, setTotalAnalysis] = React.useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await getTotalAnalysis();
      console.log(responseData.data.data);
      setTotalAnalysis(responseData.data.data);
    };
    fetchData();
  }, []);
  
  return (
    <>
    {
      totalAnalysis &&
      <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h2>
        <p className="text-muted-foreground">
          Thống kê và dữ liệu tổng quan về hoạt động của nền tảng
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalysis.users}</div>
            <p className="text-xs text-muted-foreground">
              +18% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chỗ nghỉ</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalysis.homestays}</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn đặt phòng</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalysis.bookings}</div>
            <p className="text-xs text-muted-foreground">
              +24% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalysis.reviews}</div>
            <p className="text-xs text-muted-foreground">
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Lượt đặt phòng theo tháng</CardTitle>
          <CardDescription>
            Biểu đồ thống kê số lượng đặt phòng theo từng tháng trong năm 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={totalAnalysis.monthlyBookings}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Featured properties */}
      <Card>
        <CardHeader>
          <CardTitle>Chỗ nghỉ nổi bật</CardTitle>
          <CardDescription>
            Những chỗ nghỉ có lượt đặt và đánh giá cao nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {totalAnalysis.topHomestays.map((property) => (
              <div key={property.homestayDetails._id} className="flex items-center">
                <div className="w-9 h-9 rounded bg-gray-200 mr-4"></div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{property.homestayDetails.name}</p>
                  <p className="text-sm text-muted-foreground">{property.homestayDetails.address}</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">{property.bookingCount} lượt đặt</p>
                  <p className="text-muted-foreground">{property.homestayDetails.averageRating} sao</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    }
    </>
  );
}
