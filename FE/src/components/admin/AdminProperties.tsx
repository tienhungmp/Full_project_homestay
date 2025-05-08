
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export function AdminProperties() {
  // Sample data - in a real app, this would come from an API
  const properties = [
    { id: 1, name: "Khách sạn Panorama", location: "Đà Nẵng", rooms: 42, rating: 4.8, status: "active" },
    { id: 2, name: "Homestay Mountainview", location: "Đà Lạt", rooms: 15, rating: 4.5, status: "active" },
    { id: 3, name: "Resort Ocean Pearl", location: "Phú Quốc", rooms: 86, rating: 4.9, status: "active" },
    { id: 4, name: "Khách sạn Sunlight", location: "Nha Trang", rooms: 34, rating: 4.2, status: "maintenance" },
    { id: 5, name: "Villa Green Garden", location: "Hội An", rooms: 8, rating: 4.7, status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý chỗ nghỉ</h2>
          <p className="text-muted-foreground">
            Quản lý các khách sạn, homestay, resort trong hệ thống
          </p>
        </div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Thêm chỗ nghỉ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách chỗ nghỉ</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên chỗ nghỉ</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Số phòng</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.id}</TableCell>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.rooms}</TableCell>
                  <TableCell>{property.rating}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {property.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Chỉnh sửa</Button>
                      <Button variant="outline" size="sm" className="text-red-500">Xóa</Button>
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
