import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Textarea } from "@/components/ui/textarea";
import PropertyDetailsModal from "@/components/dashboard/PropertyDetailsModal";
import PropertyEditModal from "@/components/dashboard/PropertyEditModal";
import { 
  Home, 
  PlusCircle, 
  Calendar, 
  Users, 
  Settings,
  Upload,
  Search,
  Star,
  BarChart,
  DollarSign,
  Package,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Eye,
  Check,
  BedDouble
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHomestay } from "@/hooks/useHomestays";
import { toast } from "sonner";

interface PropertyAddHomeStayProps {
  categories: any[];
  setEventAddHomestay: (isSubmit: boolean) => void;
  eventAddHomestay: boolean
}

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


export default function AddHomeStay(props: PropertyAddHomeStayProps) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [rooms, setRooms] = useState(1);
    const [maxGuests, setMaxGuests] = useState(1);
    const [description, setDescription] = useState("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const {createHomestay} = useCreateHomestay();  

    const validateForm = () => {
      const newErrors: {[key: string]: string} = {};
      
      if (!name.trim()) {
        newErrors.name = "Tên chỗ nghỉ không được để trống";
      }
      
      if (!location.trim()) {
        newErrors.location = "Địa điểm không được để trống";
      }
      
      if (!price || parseFloat(price) <= 0) {
        newErrors.price = "Giá phải lớn hơn 0";
      }
      
      if (!type) {
        newErrors.type = "Vui lòng chọn loại chỗ nghỉ";
      }
      
      if (rooms < 1) {
        newErrors.rooms = "Số phòng phải lớn hơn 0";
      }
      
      if (maxGuests < 1) {
        newErrors.maxGuests = "Số khách tối đa phải lớn hơn 0";
      }
      
      if (!description.trim()) {
        newErrors.description = "Mô tả không được để trống";
      }
      
      if (amenities.length === 0) {
        newErrors.amenities = "Vui lòng chọn ít nhất một tiện ích";
      }
      
      if (images.length === 0) {
        newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.id;
      setAmenities((prev) =>
        prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
      );
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
  
      const formData = {
        name,
        address: location,
        price: parseFloat(price),
        category: type,
        numberOfRooms: rooms,
        maxGuestsPerRoom: maxGuests,
        description,
        'amenities': amenities,
        images,
      };
      console.log(formData)
      
      const response = await createHomestay(formData);
      if(response.success) {
        props.setEventAddHomestay(!props.eventAddHomestay)
        toast.success("Thêm homestay thành công");
      } else {
        toast.error("Có lỗi gì đó rồi");
      }

      // Reset form after successful submission
      if(response.success) {
        setName("");
        setLocation("");
        setPrice("");
        setType("");
        setRooms(1);
        setMaxGuests(1);
        setDescription("");
        setAmenities([]);
        setImages([]);
        setErrors({});
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Thêm chỗ nghỉ mới</CardTitle>
            <CardDescription>
              Điền thông tin và tải lên hình ảnh cho chỗ nghỉ mới của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tên chỗ nghỉ</label>
                  <Input 
                    placeholder="Nhập tên chỗ nghỉ" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Địa điểm</label>
                  <Input 
                    placeholder="Nhập địa điểm" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Giá/đêm (VND)</label>
                  <Input 
                    type="number" 
                    placeholder="Nhập giá tiền" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Loại chỗ nghỉ</label>
                  <Select value={type} onValueChange={(value) => setType(value)}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn loại chỗ nghỉ" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.categories && props.categories.map((category) => (
                         <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Số lượng phòng</label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={rooms} 
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className={errors.rooms ? "border-red-500" : ""}
                  />
                  {errors.rooms && <p className="text-red-500 text-sm mt-1">{errors.rooms}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Số khách tối đa/phòng</label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      min="1" 
                      value={maxGuests} 
                      onChange={(e) => setMaxGuests(Number(e.target.value))}
                      className={errors.maxGuests ? "border-red-500" : ""}
                    />
                  </div>
                  {errors.maxGuests && <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>}
                </div>
              </div>
  
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Mô tả</label>
                  <Textarea
                    placeholder="Nhập mô tả chi tiết về chỗ nghỉ"
                    className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tiện ích</label>
                  <div className={`grid grid-cols-2 gap-2 mt-2 ${errors.amenities ? "border-red-500 border rounded-md p-2" : ""}`}>
                    {Object.keys(amenitiesMap).map((id) => (
                      <div key={id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={id}
                          checked={amenities.includes(id)}
                          onChange={handleAmenityChange}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={id} className="capitalize">{amenitiesMap[id]}</label>
                      </div>
                    ))}
                  </div>
                  {errors.amenities && <p className="text-red-500 text-sm mt-1">{errors.amenities}</p>}
                </div>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 min-h-[150px] flex flex-col items-center justify-center text-center ${
                    errors.images ? "border-red-500" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const droppedFiles = Array.from(e.dataTransfer.files);
                    setImages(droppedFiles);
                  }}
                >
                  {images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {images.map((file, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            onClick={() => setImages(images.filter((_, i) => i !== index))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium mb-1">Tải lên hình ảnh</h3>
                      <p className="text-sm text-gray-500 mb-4">Kéo thả hoặc click để chọn hình ảnh</p>
                    </>
                  )}
                  <input
                    type="file"
                    id="property-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setImages(files);
                        e.target.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('property-images')?.click()}
                  >
                    {images.length > 0 ? 'Thêm hình ảnh' : 'Chọn hình ảnh'}
                  </Button>
                  {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                </div>
              </div>
            </div>
  
            <Button type="submit" className="w-full mt-6 bg-brand-blue hover:bg-brand-blue/90">
              Lưu chỗ nghỉ mới
            </Button>
          </CardContent>
        </Card>
      </form>
    );
}
