
import React, { useState } from "react";
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
import { 
  Search, 
  UserPlus, 
  Filter, 
  UserCheck,
  ShieldAlert
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AdminUsers() {
  // Sample data - in a real app, this would come from an API
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "user", joinDate: "15/02/2023", status: "active" },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "user", joinDate: "22/03/2023", status: "active" },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "admin", joinDate: "10/01/2023", status: "active" },
    { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", role: "user", joinDate: "05/04/2023", status: "inactive" },
    { id: 5, name: "Hoàng Văn E", email: "hoangvane@example.com", role: "host", joinDate: "18/05/2023", status: "active" },
    { id: 6, name: "Đỗ Văn F", email: "dovanf@example.com", role: "user", joinDate: "30/06/2023", status: "active" },
    { id: 7, name: "Vũ Thị G", email: "vuthig@example.com", role: "host", joinDate: "12/07/2023", status: "active" },
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle role change
  const handleChangeRole = (userId: number, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    
    toast.success(`Đã chuyển vai trò người dùng thành ${newRole === 'host' ? 'Chủ nhà' : newRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}`);
  };

  // Handle status change (lock/unlock account)
  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === 'active' ? 'inactive' : 'active';
    
    toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'khóa'} tài khoản người dùng`);
  };

  // Filter users based on role and search query
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
          <p className="text-muted-foreground">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm người dùng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle>Danh sách người dùng</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm kiếm..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Tất cả vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả vai trò</SelectItem>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="host">Chủ nhà</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'host' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 
                       user.role === 'host' ? 'Chủ nhà' : 'Người dùng'}
                    </span>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex gap-2">
                        {user.status === 'active' ? (
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleToggleStatus(user.id)}>
                            Khóa
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="text-green-500" onClick={() => handleToggleStatus(user.id)}>
                            Kích hoạt
                          </Button>
                        )}
                      </div>

                      {user.role !== 'host' && user.role !== 'admin' && (
                        <Select onValueChange={(value) => handleChangeRole(user.id, value)}>
                          <SelectTrigger className="h-8 w-36">
                            <div className="flex items-center">
                              <UserCheck className="mr-2 h-3.5 w-3.5" />
                              <span>Chuyển vai trò</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="host">Thành chủ nhà</SelectItem>
                            {user.role !== 'admin' && (
                              <SelectItem value="admin">Thành quản trị</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
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
