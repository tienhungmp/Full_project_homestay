import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateUser } from '@/hooks/useUser';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any| null;
}

const EditProfileModal = ({ isOpen, onClose, user }: EditProfileModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phone || '',
    address: user?.address || '',
  });

  const {updateUser} =  useUpdateUser();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên không được để trống",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to backend
    console.log('Saving profile data:', formData);

    const responseUpdate = await updateUser(user._id, {name: formData.name, phone: formData?.phoneNumber, address: formData?.address})

    if(responseUpdate.success){
      toast({
          title: "Thành công",
          description: "Thông tin hồ sơ đã được cập nhật",
        });
    }
    
    onClose();
  };

  const handleClose = () => {
    // Reset form to original values when closing
    setFormData({
        name: user?.name || '',
        phoneNumber: user?.phone || '',
        address: user?.address || '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân của bạn. Nhấn lưu để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right flex items-center">
              <User className="h-4 w-4 mr-1" />
              Tên
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="col-span-3"
              placeholder="Nhập tên của bạn"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              SĐT
            </Label>
            <Input
              id="phone"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="col-span-3"
              placeholder="Nhập số điện thoại"
              type="tel"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Địa chỉ
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="col-span-3"
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-brand-blue hover:bg-brand-blue/90">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;