
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const benefits = [
  {
    icon: "💰",
    title: "Giá tốt nhất đảm bảo",
    description: "Chúng tôi đảm bảo bạn luôn nhận được mức giá tốt nhất khi đặt qua BlissStay."
  },
  {
    icon: "🔍",
    title: "Đa dạng lựa chọn",
    description: "Hàng nghìn homestay và khách sạn chất lượng trên toàn quốc."
  },
  {
    icon: "🛎️",
    title: "Dịch vụ hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi."
  },
  {
    icon: "🔒",
    title: "Đặt phòng an toàn",
    description: "Thanh toán bảo mật và xác nhận đặt phòng ngay lập tức."
  }
];

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Tại sao chọn BlissStay?</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Chúng tôi mang đến cho bạn trải nghiệm đặt phòng đơn giản, nhanh chóng và đáng tin cậy
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none shadow-md h-full">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Chính sách hỗ trợ của chúng tôi</h3>
              <p className="text-muted-foreground mb-6">
                Chúng tôi cam kết mang đến cho bạn trải nghiệm đặt phòng tuyệt vời với nhiều chính sách ưu đãi.
              </p>
              <ul className="space-y-3">
                {[
                  "Hoàn tiền 100% nếu không nhận được phòng",
                  "Hủy miễn phí trong vòng 48 giờ sau đặt phòng",
                  "Hỗ trợ khách hàng 24/7 qua điện thoại và email",
                  "Bảo mật thông tin cá nhân và thanh toán"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1542928658-22251e208ac1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Customer Support" 
                className="rounded-lg object-cover h-72 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
