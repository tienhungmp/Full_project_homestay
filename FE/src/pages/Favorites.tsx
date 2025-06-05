import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Home } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any>([]);
  const { getFavorites } = useFavorites();

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả homestay yêu thích?')) {
    //   clearAllFavorites();
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = await getFavorites();
      setFavorites(favorites.data.data);
    };

    fetchFavorites()
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500" />
                Homestay yêu thích
              </h1>
              <p className="text-gray-600">
                {favorites.length} homestay đã được lưu
              </p>
            </div>
            {favorites.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <PropertyCard key={property.homestay._id} {...{...property.homestay, image: property.homestay.images[0]}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có homestay yêu thích
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Hãy tìm kiếm và thêm những homestay bạn thích vào danh sách yêu thích để xem lại sau.
            </p>
            <Button 
              onClick={() => navigate('/search')}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              <Home className="h-4 w-4 mr-2" />
              Tìm kiếm homestay
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;