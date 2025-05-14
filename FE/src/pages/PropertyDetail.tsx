import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyInfo from '@/components/property/PropertyInfo';
import PropertyTabs from '@/components/property/PropertyTabs';
import BookingForm from '@/components/property/BookingForm';

// Sample property data - in a real app this would come from an API
const properties = [
  {
    id: "1",
    name: "Vinhomes Riverside Villa",
    location: "Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội",
    price: 1200000,
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    ],
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    description: "Trải nghiệm không gian sống sang trọng tại biệt thự Vinhomes Riverside với không gian xanh mát, view sông thoáng đãng. Biệt thự được thiết kế theo phong cách hiện đại, đầy đủ tiện nghi cao cấp, phù hợp cho các kỳ nghỉ gia đình hoặc tổ chức sự kiện nhỏ.",
    amenities: [
      "Wifi",
      "Hồ bơi",
      "Bãi đỗ xe",
      "Điều hòa",
      "Bếp đầy đủ",
      "Máy giặt",
      "TV màn hình phẳng",
      "Sân vườn",
      "BBQ"
    ],
    host: {
      name: "Minh Tuấn",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      responseRate: 98,
      responseTime: "trong vòng 1 giờ"
    },
    reviews: [
      {
        id: "r1",
        user: "Thanh Hà",
        rating: 5,
        date: "2023-08-15",
        comment: "Biệt thự rất đẹp và sang trọng. Chúng tôi đã có một kỳ nghỉ tuyệt vời ở đây. Chủ nhà rất thân thiện và hỗ trợ nhiệt tình."
      },
      {
        id: "r2",
        user: "Đức Anh",
        rating: 4.5,
        date: "2023-07-22",
        comment: "Không gian rộng rãi, tiện nghi đầy đủ. View sông rất đẹp, đặc biệt vào buổi sáng. Chắc chắn sẽ quay lại."
      }
    ],
    policies: {
      checkin: "14:00",
      checkout: "12:00",
      cancellation: "Miễn phí hủy trước 7 ngày. Hoàn lại 50% trước 3 ngày.",
      rules: [
        "Không hút thuốc trong nhà",
        "Không tụ tập, tổ chức tiệc ồn ào sau 22:00",
        "Không mang vật nuôi"
      ]
    }
  },
  {
    id: "2",
    name: "Sapa Retreat Homestay",
    location: "Tả Van, Sapa, Lào Cai",
    price: 850000,
    rating: 4.9,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1594128956522-44c21032da77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80"
    ],
    type: "Homestay",
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    description: "Sapa Retreat Homestay nằm ở làng Tả Van yên bình, cách thị trấn Sapa khoảng 8km. Homestay được xây dựng theo kiến trúc truyền thống của người H'Mông với khung gỗ chắc chắn kết hợp hiện đại. Từ ban công, bạn có thể ngắm nhìn toàn cảnh thung lũng Mường Hoa tuyệt đẹp.",
    amenities: [
      "Wifi",
      "Bữa sáng",
      "Tour trekking",
      "Máy sưởi",
      "Nước nóng",
      "Đưa đón"
    ],
    host: {
      name: "Mỹ Linh",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      responseRate: 100,
      responseTime: "trong vòng 30 phút"
    },
    reviews: [
      {
        id: "r1",
        user: "Minh Quân",
        rating: 5,
        date: "2023-09-05",
        comment: "Trải nghiệm tuyệt vời với cảnh quan đẹp mê hồn. Chủ homestay rất thân thiện và nhiệt tình giới thiệu về văn hóa địa phương."
      },
      {
        id: "r2",
        user: "Thu Hương",
        rating: 4.8,
        date: "2023-08-12",
        comment: "Không gian yên bình, gần gũi thiên nhiên. Đồ ăn ngon, đặc biệt là bữa sáng với các món địa phương. Sẽ quay lại vào mùa đông."
      }
    ],
    policies: {
      checkin: "13:00",
      checkout: "11:00",
      cancellation: "Miễn phí hủy trước 5 ngày.",
      rules: [
        "Giữ yên lặng sau 23:00",
        "Tôn trọng phong tục địa phương",
        "Hạn chế sử dụng nhựa một lần"
      ]
    }
  }
];

const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === id) || properties[0]; // Fallback to first property if not found
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <PropertyHeader 
          name={property.name}
          location={property.location}
          rating={property.rating}
          reviewCount={property.reviewCount}
        />
        
        <PropertyGallery 
          images={property.images}
          propertyName={property.name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyInfo 
              type={property.type}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              guests={property.guests}
              host={property.host}
            />

            <PropertyTabs 
              description={property.description}
              amenities={property.amenities}
              rating={property.rating}
              reviewCount={property.reviewCount}
              reviews={property.reviews}
              policies={property.policies}
            />
          </div>
          
          <div>
            <BookingForm 
              price={property.price}
              rating={property.rating}
              maxGuests={property.guests}
              propertyId={property.id}
              propertyName={property.name}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;