import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites1';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  propertyId: string;
  propertyName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text';
}

const FavoriteButton = ({ 
  propertyId, 
  propertyName = 'homestay',
  size = 'md',
  variant = 'icon'
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(propertyId);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleFavorite(propertyId);
    
    if (isCurrentlyFavorite) {
      toast.success(`Đã xóa ${propertyName} khỏi danh sách yêu thích`);
    } else {
      toast.success(`Đã thêm ${propertyName} vào danh sách yêu thích`);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };

  if (variant === 'text') {
    return (
      <Button
        variant={isCurrentlyFavorite ? "default" : "outline"}
        size="sm"
        onClick={handleToggleFavorite}
        className={isCurrentlyFavorite ? "bg-red-500 hover:bg-red-600" : ""}
      >
        <Heart 
          className={`${getIconSize()} mr-2 ${isCurrentlyFavorite ? 'fill-current' : ''}`}
        />
        {isCurrentlyFavorite ? 'Đã yêu thích' : 'Yêu thích'}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleFavorite}
      className={`${getButtonSize()} rounded-full bg-white/90 hover:bg-white border-gray-200 shadow-sm ${
        isCurrentlyFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
      }`}
    >
      <Heart 
        className={`${getIconSize()} ${isCurrentlyFavorite ? 'fill-current' : ''}`}
      />
    </Button>
  );
};

export default FavoriteButton;