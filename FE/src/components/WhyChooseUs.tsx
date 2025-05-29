import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Heart, Star, Award, Headphones } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bảo mật tuyệt đối",
    description: "Thông tin cá nhân và thanh toán được bảo vệ bằng công nghệ mã hóa tiên tiến",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Đặt phòng nhanh chóng",
    description: "Chỉ cần 3 bước đơn giản để hoàn tất việc đặt phòng trong vài phút",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Dịch vụ tận tâm",
    description: "Đội ngũ chăm sóc khách hàng nhiệt tình, sẵn sàng hỗ trợ 24/7",
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-50 to-pink-50"
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Chất lượng đảm bảo",
    description: "Tất cả chỗ nghỉ đều được kiểm duyệt kỹ lưỡng về chất lượng và tiện nghi",
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-50 to-orange-50"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Giá tốt nhất",
    description: "Cam kết mang đến mức giá cạnh tranh nhất trên thị trường",
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50"
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "Hỗ trợ đa kênh",
    description: "Liên hệ qua điện thoại, email, chat trực tuyến hoặc ứng dụng di động",
    color: "from-teal-500 to-cyan-500",
    bgColor: "from-teal-50 to-cyan-50"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="container py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-to-r from-green-100/30 to-blue-100/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
          <Award className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-purple-600 font-semibold">Ưu điểm vượt trội</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Tại sao chọn BlissStay?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Chúng tôi cam kết mang đến trải nghiệm đặt phòng hoàn hảo với những giá trị cốt lõi
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {features.map((feature, index) => (
          <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <CardContent className="p-8 text-center relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Stats Section */}
      <div className="mt-20 bg-gradient-to-r from-white to-blue-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-blue to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              50K+
            </div>
            <p className="text-gray-600 font-medium">Khách hàng hài lòng</p>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              5K+
            </div>
            <p className="text-gray-600 font-medium">Chỗ nghỉ chất lượng</p>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              4.8★
            </div>
            <p className="text-gray-600 font-medium">Đánh giá trung bình</p>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <p className="text-gray-600 font-medium">Hỗ trợ khách hàng</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;