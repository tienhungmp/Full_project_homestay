import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

// Mock properties data (same as in Search page)
const mockProperties: Property[] = [
  {
    id: "1",
    name: "Villa Hạ Long Bay View",
    location: "Hạ Long, Quảng Ninh",
    price: 1500000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    type: "Villa",
    description: "Villa sang trọng với view vịnh Hạ Long tuyệt đẹp",
    numberOfRooms: 4,
    maxGuestsPerRoom: 2,
    amenities: {
      wifi: true,
      parking: true,
      pool: true,
      gym: false,
      ac: true,
      kitchen: true,
      tv: true,
      pets: false
    }
  },
  {
    id: "2",
    name: "Coco Beach Resort Phú Quốc",
    location: "Phú Quốc, Kiên Giang",
    price: 1200000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop",
    type: "Resort",
    description: "Resort bãi biển với không gian thư giãn hoàn hảo",
    numberOfRooms: 6,
    maxGuestsPerRoom: 3,
    amenities: {
      wifi: true,
      parking: true,
      pool: true,
      gym: true,
      ac: true,
      kitchen: false,
      tv: true,
      pets: true
    }
  },
  {
    id: "3",
    name: "Mường Thanh Grand Đà Nẵng",
    location: "Đà Nẵng",
    price: 800000,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    type: "Hotel",
    description: "Khách sạn 5 sao ngay trung tâm thành phố Đà Nẵng",
    numberOfRooms: 8,
    maxGuestsPerRoom: 2,
    amenities: {
      wifi: true,
      parking: true,
      pool: true,
      gym: true,
      ac: true,
      kitchen: false,
      tv: true,
      pets: false
    }
  },
  {
    id: "4",
    name: "Sapa Eco Retreat",
    location: "Sa Pa, Lào Cai",
    price: 900000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
    type: "Eco Lodge",
    description: "Khu nghỉ dưỡng sinh thái giữa núi rừng Sa Pa",
    numberOfRooms: 3,
    maxGuestsPerRoom: 4,
    amenities: {
      wifi: true,
      parking: true,
      pool: false,
      gym: false,
      ac: false,
      kitchen: true,
      tv: false,
      pets: true
    }
  },
  {
    id: "5",
    name: "Duplex Apartment Thảo Điền",
    location: "TP. Hồ Chí Minh",
    price: 2500000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000&auto=format&fit=crop",
    type: "Apartment",
    description: "Căn hộ duplex cao cấp tại khu Thảo Điền",
    numberOfRooms: 2,
    maxGuestsPerRoom: 3,
    amenities: {
      wifi: true,
      parking: true,
      pool: true,
      gym: true,
      ac: true,
      kitchen: true,
      tv: true,
      pets: false
    }
  },
  {
    id: "6",
    name: "Homestay Tam Cốc Ninh Bình",
    location: "Ninh Bình",
    price: 600000,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    type: "Homestay",
    description: "Homestay truyền thống giữa cảnh quan Tam Cốc",
    numberOfRooms: 5,
    maxGuestsPerRoom: 2,
    amenities: {
      wifi: true,
      parking: true,
      pool: false,
      gym: false,
      ac: true,
      kitchen: true,
      tv: true,
      pets: true
    }
  }
];

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        setFavoriteIds(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteIds([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const addToFavorites = (propertyId: string) => {
    setFavoriteIds(prev => {
      if (!prev.includes(propertyId)) {
        return [...prev, propertyId];
      }
      return prev;
    });
  };

  const removeFromFavorites = (propertyId: string) => {
    setFavoriteIds(prev => prev.filter(id => id !== propertyId));
  };

  const toggleFavorite = (propertyId: string) => {
    if (favoriteIds.includes(propertyId)) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  const isFavorite = (propertyId: string) => {
    return favoriteIds.includes(propertyId);
  };

  const clearAllFavorites = () => {
    setFavoriteIds([]);
  };

  // Get favorite properties with full details
  const favoriteProperties = mockProperties.filter(property => 
    favoriteIds.includes(property.id)
  );

  return {
    favoriteIds,
    favoriteProperties,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites
  };
};