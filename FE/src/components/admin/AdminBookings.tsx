
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function AdminBookings() {
  // Sample data - in a real app, this would come from an API
  const bookings = [
    { id: "B12345", property: "Khách sạn Panorama", user: "Nguyễn Văn A", checkIn: "22/04/2023", checkOut: "25/04/2023", guests: 2, status: "completed" },
    { id: "B12346", property: "Homestay Mountainview", user: "Trần Thị B", checkIn: "10/05/2023", checkOut: "12/05/2023", guests: 4, status: "confirmed" },
    { id: "B12347", property: "Resort Ocean Pearl", user: "Lê Văn C", checkIn: "15/06/2023", checkOut: "20/06/2023", guests: 3, status: "pending" },
    { id: "B12348", property: "Villa Green Garden", user: "Phạm Thị D", checkIn: "05/07/2023", checkOut: "10/07/2023", guests: 6, status: "canceled" },
    { id: "B12349", property: "Khách sạn Sunlight", user: "Hoàng Văn E", checkIn: "18/07/2023", checkOut: "20/07/2023", guests: 2, status: "confirmed" },
  ];

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'pending': return 'Chờ xác nhận';
      case 'canceled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đặt phòng</h2>
        <p className="text-muted-foreground">
          Quản lý và theo dõi các đơn đặt phòng trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách đặt phòng</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm mã đặt phòng..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đặt phòng</TableHead>
                <TableHead>Chỗ nghỉ</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Nhận phòng</TableHead>
                <TableHead>Trả phòng</TableHead>
                <TableHead>Số khách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.property}</TableCell>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Chi tiết</Button>
                      {booking.status === 'pending' && (
                        <Button variant="outline" size="sm" className="text-green-500">Xác nhận</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
