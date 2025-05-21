import React, { useState } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Property } from "@/types/property";

interface PropertyEditModalProps {
  open: boolean;
  onClose: () => void;
  property: any;
  onSave: (updatedProperty: any) => void;
}

const PropertyEditModal: React.FC<PropertyEditModalProps> = ({ open, onClose, property, onSave }) => {
  const [formData, setFormData] = useState({
    name: property.name || "",
    location: property.address || "",
    price: property.price || 0,
    type: property.type || "villa",
    description: property.description || "",
    numberOfRooms: property.numberOfRooms || 1,
    maxGuestsPerRoom: property.maxGuestsPerRoom || 2,
    images: property.images || [],
    amenities: {
      wifi: property.amenities?.wifi || false,
      parking: property.amenities?.parking || false,
      pool: property.amenities?.pool || false,
      gym: property.amenities?.gym || false,
      ac: property.amenities?.ac || false,
      kitchen: property.amenities?.kitchen || false,
      tv: property.amenities?.tv || false,
      pets: property.amenities?.pets || false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [id]: checked
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const updatedProperty = {
      ...property,
      ...formData
    };
    
    onSave(updatedProperty);
    toast.success("Đã cập nhật thông tin chỗ nghỉ thành công");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin chỗ nghỉ</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin chỗ nghỉ của bạn tại đây
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên chỗ nghỉ</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Nhập tên chỗ nghỉ" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Địa điểm</label>
              <Input 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="Nhập địa điểm" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Giá/đêm (VND)</label>
              <Input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleNumberInputChange} 
                placeholder="Nhập giá tiền" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Loại chỗ nghỉ</label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại chỗ nghỉ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="apartment">Căn hộ</SelectItem>
                  <SelectItem value="homestay">Homestay</SelectItem>
                  <SelectItem value="hotel">Khách sạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Số lượng phòng</label>
              <Input 
                type="number" 
                min="1" 
                name="numberOfRooms" 
                value={formData.numberOfRooms} 
                onChange={handleNumberInputChange} 
                placeholder="Nhập số lượng phòng" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Số khách tối đa/phòng</label>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  min="1" 
                  name="maxGuestsPerRoom" 
                  value={formData.maxGuestsPerRoom} 
                  onChange={handleNumberInputChange} 
                  placeholder="Số khách tối đa mỗi phòng" 
                />
                <BedDouble className="h-5 w-5 text-muted-foreground ml-2" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Hình ảnh</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-32">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <ImagePlus className="h-8 w-8 text-gray-400" />
              </label>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea 
              name="description"
              value={formData.description} 
              onChange={handleInputChange}
              placeholder="Nhập mô tả chi tiết về chỗ nghỉ" 
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Tiện ích</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="wifi" 
                  checked={formData.amenities.wifi}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="wifi">Wifi miễn phí</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="parking" 
                  checked={formData.amenities.parking}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="parking">Bãi đậu xe</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="pool" 
                  checked={formData.amenities.pool}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="pool">Bể bơi</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="gym" 
                  checked={formData.amenities.gym}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="gym">Phòng gym</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="ac" 
                  checked={formData.amenities.ac}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="ac">Điều hòa</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="kitchen" 
                  checked={formData.amenities.kitchen}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="kitchen">Nhà bếp</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="tv" 
                  checked={formData.amenities.tv}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="tv">TV</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="pets" 
                  checked={formData.amenities.pets}
                  onChange={handleAmenityChange}
                  className="rounded border-gray-300" 
                />
                <label htmlFor="pets">Cho phép thú cưng</label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90" 
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyEditModal;