
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { console } from 'inspector';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { useCheckFavorites, useCreateFavorite, useRemoveFavorite } from '@/hooks/useFavorites';

interface PropertyCardProps {
  _id: string;
  name: string;
  address: string;
  price: number;
  averageRating: number;
  images: string;
  category: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  _id,
  name,
  address,
  price,
  averageRating,
  images,
  category
}) => {

  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const {user} = useAuth();
  const  {createFavorite} = useCreateFavorite();
  const  {removeFavorite} = useRemoveFavorite();
  const  {checkFavorites} = useCheckFavorites();

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if(!user){
      toast.error('Bạn cần đăng nhập để thêm vào danh sách yêu thích');
      return;
    }

    if(user?.role === 'admin' || user?.role === 'host'){
      toast.info('Bạn không thể thêm vào danh sách yêu thích');
      return;
    }
    if(!isWishlisted){
      const responeCreate = await createFavorite(_id)
      if(responeCreate.success){
        setIsWishlisted(!isWishlisted);
        toast.success('Thêm vào danh sách yêu thích thành công');
      }
    } else {
      const responeRemove = await removeFavorite(_id)
      if(responeRemove.success){
        setIsWishlisted(!isWishlisted);
        toast.success('Thêm vào danh sách yêu thích thành công');
      }
      toast.success('Loại bỏ khỏi danh sách yêu thích thành công');
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if(user) {
        const responeCheck = await checkFavorites(_id);
        if(responeCheck.success){
          setIsWishlisted(responeCheck.data.isFavorite);
        } 
      }    
    };

    fetchFavorites();
  }, []);

  return (
    <Link to={`/property/${_id}`}>
      <Card className="property-card overflow-hidden h-full">
        <div className="relative">
          <img 
            src={'http://localhost:5000/'+ images[0]} 
            alt={name} 
            className="w-full h-48 object-cover"
          />
          <Badge 
            className="absolute top-3 left-3 bg-brand-blue hover:bg-brand-blue"
          >
            {category.name}
          </Badge>
           <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={handleAddToWishlist}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={isWishlisted ? "h-5 w-5 text-red-500" : "h-5 w-5"}
              fill="currentColor" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        </div>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-2">{name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
              <span className="text-sm font-medium ml-1">{averageRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center mt-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm truncate">{address}</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-lg font-bold">
            {price.toLocaleString('vi-VN')} đ
            <span className="text-sm font-normal text-muted-foreground"> /đêm</span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
