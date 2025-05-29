import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Percent, Gift, Calendar, Sparkles, ArrowRight } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: "Ưu đãi cuối tuần",
    description: "Giảm 30% cho tất cả homestay trong 2 ngày cuối tuần",
    discount: "30%",
    validUntil: "31/12/2024",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Calendar className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50"
  },
  {
    id: 2,
    title: "Đặt sớm tiết kiệm",
    description: "Đặt trước 30 ngày để nhận ưu đãi lên đến 25%",
    discount: "25%",
    validUntil: "15/01/2025",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Clock className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  {
    id: 3,
    title: "Ưu đãi thành viên mới",
    description: "Giảm 20% cho lần đặt phòng đầu tiên khi đăng ký",
    discount: "20%",
    validUntil: "28/02/2025",
    image: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Gift className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50"
  }
];

const SpecialOffers = () => {
  return (
    <section className="container py-24 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100/10 to-purple-100/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-20 relative z-10">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 rounded-full mb-6 shadow-lg border border-purple-200/50">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2 animate-pulse" />
          <span className="text-purple-700 font-bold tracking-wide">Ưu đãi đặc biệt</span>
          <Sparkles className="w-5 h-5 text-purple-600 ml-2 animate-pulse delay-500" />
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            Khuyến mãi hấp dẫn
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Đừng bỏ lỡ những ưu đãi tuyệt vời cho chuyến du lịch của bạn
        </p>
        <div className="mt-4 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {offers.map((offer, index) => (
          <Card key={offer.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 backdrop-blur-sm">
            <div className="relative">
              <div className="overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-75 group-hover:opacity-85 transition-opacity duration-300`}></div>
              
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 transform group-hover:scale-110 transition-transform duration-300">
                <div className="relative">
                  <Badge className="bg-white text-gray-800 font-bold text-xl px-4 py-2 shadow-lg border-0">
                    -{offer.discount}
                  </Badge>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Icon */}
              <div className="absolute top-4 right-4 bg-white/25 backdrop-blur-md rounded-xl p-3 group-hover:bg-white/35 transition-all duration-300">
                <div className="text-white group-hover:scale-110 transition-transform duration-300">
                  {offer.icon}
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            <CardContent className="p-8 relative">
              {/* Background gradient for content */}
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient} opacity-30 rounded-b-lg`}></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  {offer.description}
                </p>
                
                <div className="flex items-center justify-between mb-6 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Có hiệu lực đến:</span>
                  </div>
                  <span className="text-sm font-bold text-brand-blue bg-blue-100 px-3 py-1 rounded-full">
                    {offer.validUntil}
                  </span>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-brand-blue via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-bold py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group-hover:animate-pulse">
                  <span className="flex items-center justify-center space-x-2">
                    <span>Sử dụng ngay</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Bottom decorative line */}
      <div className="mt-16 flex justify-center">
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default SpecialOffers;