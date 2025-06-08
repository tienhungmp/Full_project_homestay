import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, UserCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useGetAllUser } from "@/hooks/userAdminAnalys";
import { useUpdateStatusUser } from "@/hooks/useUser";

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { getAllUser } = useGetAllUser();
  const { updateStatusUser } = useUpdateStatusUser();

  const handleChangeRole = (userId: number, newRole: string) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );

    toast.success(
      `Đã chuyển vai trò người dùng thành ${
        newRole === "host"
          ? "Chủ nhà"
          : newRole === "admin"
          ? "Quản trị viên"
          : "Người dùng"
      }`
    );
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const response = await updateStatusUser({
        idUser: userId,
        status: newStatus,
      });

      if (response.success) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );

        const actionText = newStatus === "active" ? "kích hoạt" : "khóa";
        toast.success(`Đã ${actionText} tài khoản người dùng`);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái người dùng");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole
      ? selectedRole == "all"
        ? true
        : user.role === selectedRole
      : true;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllUser();
      if (res.success) {
        setUsers(res.data.data.users);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý người dùng
          </h2>
          <p className="text-muted-foreground">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>
        {/* <Button className="bg-brand-blue hover:bg-brand-blue/90">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm người dùng
        </Button> */}
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
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
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
              {currentItems.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>#{user._id.slice(-4)}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "host"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Quản trị viên"
                        : user.role === "host"
                        ? "Chủ nhà"
                        : "Người dùng"}
                    </span>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex gap-2">
                        {user.status === "active" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleToggleStatus(user._id)}
                          >
                            Khóa
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-500"
                            onClick={() => handleToggleStatus(user._id)}
                          >
                            Kích hoạt
                          </Button>
                        )}
                      </div>

                      {user.role !== "host" && user.role !== "admin" && (
                        <Select
                          onValueChange={(value) =>
                            handleChangeRole(user._id, value)
                          }
                        >
                          <SelectTrigger className="h-8 w-36">
                            <div className="flex items-center">
                              <UserCheck className="mr-2 h-3.5 w-3.5" />
                              <span>Chuyển vai trò</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="host">Thành chủ nhà</SelectItem>
                            {user.role !== "admin" && (
                              <SelectItem value="admin">
                                Thành quản trị
                              </SelectItem>
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

          <div className="flex items-center justify-between py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
