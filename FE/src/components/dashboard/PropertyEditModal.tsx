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
import { linkBackend } from "@/utils/Constant";
import { useUpdateHomeStay } from "@/hooks/useHomestays";
import { set } from "date-fns";

const amenitiesMap = {
  'WiFi': 'WiFi',
  'Air Conditioning': 'Máy lạnh',
  'TV': 'TV',
  'Kitchen': 'Nhà bếp',
  'Washing Machine': 'Máy giặt',
  'Free Parking': 'Chỗ đậu xe miễn phí',
  'Pool': 'Hồ bơi',
  'Garden': 'Vườn',
  'BBQ': 'Nướng BBQ',
  'Hot Water': 'Nước nóng',
  'Refrigerator': 'Tủ lạnh',
  'Microwave': 'Lò vi sóng',
  'Security Camera': 'Camera an ninh',
  'First Aid Kit': 'Bộ sơ cứu',
  'Fire Extinguisher': 'Bình chữa cháy'
};


interface PropertyEditModalProps {
  open: boolean;
  onClose: () => void;
  property: any;
  onSave: (updatedProperty: any) => void;
  categories: any[];
}

const PropertyEditModal: React.FC<PropertyEditModalProps> = ({ open, onClose, property, onSave, categories }) => {
  const {updateHomeStay} = useUpdateHomeStay()
  const [typeHomestay, setTypeHomestay] = useState((categories.filter((item) => item._id === property.category)[0]));

  const [formData, setFormData] = useState({
    name: property.name || "",
    address: property.address || "",
    price: property.price || 0,
    category: typeHomestay._id || "villa",
    description: property.description || "",
    numberOfRooms: property.numberOfRooms || 1,
    maxGuestsPerRoom: property.maxGuestsPerRoom || 2,
    images: property.images || [],
    amenities: property.amenities || [],
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleTypeChange = (value: any) => {
    setTypeHomestay(value);
    setFormData(prev => ({ ...prev, category: value._id }));
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const id = value;
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id]
    }));
  };

  // const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.id;
  //   setAmenities((prev) =>
  //     prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
  //   );
  // };

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

  const handleSubmit = async () => {
    const updatedProperty = {
      ...property,
      ...formData
    };

    const responseUpdate =  await updateHomeStay(updatedProperty, property._id);
  
    if(responseUpdate.status) {
      onSave(updatedProperty);
      toast.success("Đã cập nhật thông tin chỗ nghỉ thành công");
      onClose();
    }
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
                name="address" 
                value={formData.address} 
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
              <label className="text-sm font-medium mb-1 block">Chọn loại chỗ nghỉ</label>
              <Select value={typeHomestay} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder={typeHomestay.name} />
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.map((category) => (
                      <SelectItem key={category._id} value={category}>{category.name}</SelectItem>
                  ))}
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
                    src={linkBackend + image} 
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
              {Object.keys(amenitiesMap).map((id) => (
                      <div key={id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={id + "vv"}
                          value={id}
                          checked={formData.amenities.includes(id)}
                          onChange={handleAmenityChange}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={id + "vv"} className="capitalize">{amenitiesMap[id]}</label>
                      </div>
                    ))}
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