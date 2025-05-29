import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Gift } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Đăng ký thành công!",
        description: "Cảm ơn bạn đã đăng ký nhận tin từ BlissStay. Chúng tôi sẽ gửi những ưu đãi tốt nhất đến email của bạn.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="container py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-1/3 w-56 h-56 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Gift className="w-5 h-5 mr-2" />
              <span className="font-semibold">Ưu đãi độc quyền</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nhận ưu đãi đặc biệt
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Đăng ký nhận tin để không bỏ lỡ những chương trình khuyến mãi hấp dẫn và mẹo du lịch thú vị từ BlissStay
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 px-8 bg-white text-brand-blue hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Đăng ký
                  </>
                )}
              </Button>
            </form>
            
            <p className="text-sm opacity-75 mt-4">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <a href="#" className="underline hover:no-underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="underline hover:no-underline">
                Chính sách bảo mật
              </a>{' '}
              của chúng tôi.
            </p>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-800">Ưu đãi độc quyền</h3>
            <p className="text-sm text-gray-600">Nhận mã giảm giá lên đến 50% chỉ dành cho thành viên</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-800">Quà tặng hấp dẫn</h3>
            <p className="text-sm text-gray-600">Tham gia các chương trình tặng quà và rút thăm trúng thưởng</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-800">Tin tức du lịch</h3>
            <p className="text-sm text-gray-600">Cập nhật những điểm đến hot và mẹo du lịch tiết kiệm</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;