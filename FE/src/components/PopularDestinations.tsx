import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: "Hà Nội",
    properties: 1250,
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    trending: true,
    description: "Thủ đô ngàn năm văn hiến"
  },
  {
    id: 2,
    name: "Đà Nẵng",
    properties: 890,
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    trending: true,
    description: "Thành phố đáng sống nhất Việt Nam"
  },
  {
    id: 3,
    name: "Hội An",
    properties: 650,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    trending: false,
    description: "Phố cổ thơ mộng bên sông Hoài"
  },
  {
    id: 4,
    name: "Sapa",
    properties: 420,
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    trending: true,
    description: "Thiên đường ruộng bậc thang"
  },
  {
    id: 5,
    name: "Phú Quốc",
    properties: 780,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    trending: false,
    description: "Đảo ngọc nghỉ dưỡng hàng đầu"
  },
  {
    id: 6,
    name: "Nha Trang",
    properties: 920,
    image: "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    trending: true,
    description: "Vịnh biển đẹp nhất Việt Nam"
  }
];

const PopularDestinations = () => {
  return (
    <section className="container py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
          <TrendingUp className="w-5 h-5 text-brand-blue mr-2" />
          <span className="text-brand-blue font-semibold">Điểm đến hot</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Điểm đến phổ biến
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Khám phá những địa điểm du lịch được yêu thích nhất tại Việt Nam
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {destinations.map((destination) => (
          <Card key={destination.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
            <div className="relative">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              {destination.trending && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                <p className="text-sm opacity-90 mb-2">{destination.description}</p>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{destination.properties} chỗ nghỉ</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-brand-blue" />
                  <span className="text-sm">Việt Nam</span>
                </div>
                <span className="text-brand-blue font-semibold hover:underline">
                  Khám phá →
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;