
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Info, Check, Users, Globe, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">Về BlissStay</h1>
              <p className="text-lg text-gray-600 mb-8">
                Nền tảng đặt phòng đáng tin cậy tại Việt Nam, kết nối du khách với những chỗ nghỉ tuyệt vời.
              </p>
              <div className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full">
                <Info className="w-5 h-5" />
                <span>Thành lập năm 2020</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission section */}
        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 mb-8 text-center">
                BlissStay ra đời với sứ mệnh mang đến trải nghiệm du lịch tuyệt vời cho mọi người thông qua việc kết nối du khách với các chỗ nghỉ chất lượng trên khắp Việt Nam. Chúng tôi tin rằng mỗi chuyến đi đều xứng đáng có những kỷ niệm đáng nhớ, bắt đầu từ một nơi ở thoải mái và đáng tin cậy.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Tầm nhìn</h3>
                  <p className="text-gray-600">
                    Trở thành nền tảng đặt phòng hàng đầu Việt Nam, mang đến dịch vụ chất lượng cao với giá cả hợp lý cho mọi đối tượng khách hàng.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Giá trị cốt lõi</h3>
                  <p className="text-gray-600">
                    Chúng tôi đề cao tính minh bạch, sự tin cậy và trải nghiệm người dùng xuất sắc trong mọi hoạt động của mình.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values section */}
        <section className="bg-gray-50 py-16">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Điều chúng tôi cam kết</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Chất lượng</h3>
                <p className="text-gray-600">
                  Chúng tôi kiểm duyệt kỹ lưỡng từng chỗ nghỉ để đảm bảo chất lượng dịch vụ.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Khách hàng</h3>
                <p className="text-gray-600">
                  Đặt trải nghiệm và sự hài lòng của khách hàng lên hàng đầu trong mọi quyết định.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bền vững</h3>
                <p className="text-gray-600">
                  Khuyến khích du lịch bền vững và có trách nhiệm với cộng đồng địa phương.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Đội ngũ của chúng tôi</h2>
              <p className="text-gray-600 mb-12 text-center">
                BlissStay được xây dựng bởi một đội ngũ chuyên gia trong lĩnh vực du lịch và công nghệ, 
                với nhiều năm kinh nghiệm và đam mê mang đến những dịch vụ tốt nhất cho khách hàng.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Nguyễn Văn A</h3>
                    <p className="text-brand-blue mb-2">Nhà sáng lập & CEO</p>
                    <p className="text-gray-600">
                      Với hơn 10 năm kinh nghiệm trong ngành du lịch và công nghệ, anh Nguyễn Văn A 
                      đã xây dựng BlissStay với tầm nhìn tạo ra một nền tảng đặt phòng tiện lợi và đáng tin cậy.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Trần Thị B</h3>
                    <p className="text-brand-blue mb-2">Giám đốc Vận hành</p>
                    <p className="text-gray-600">
                      Chị Trần Thị B đảm nhận việc quản lý và phát triển mối quan hệ với các đối tác, 
                      đảm bảo mang đến cho khách hàng những lựa chọn chỗ nghỉ tốt nhất trên nền tảng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trust & Security section */}
        <section className="bg-gray-50 py-16">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Bảo mật và Tin cậy</h2>
              <p className="text-gray-600 mb-8">
                BlissStay cam kết bảo vệ thông tin cá nhân của khách hàng và đảm bảo mọi giao dịch đều an toàn.
                Chúng tôi sử dụng các công nghệ bảo mật tiên tiến và tuân thủ các quy định về bảo vệ dữ liệu.
              </p>
              <div className="inline-flex items-center justify-center bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="text-gray-600">© 2020-2025 BlissStay. Bảo lưu mọi quyền.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
