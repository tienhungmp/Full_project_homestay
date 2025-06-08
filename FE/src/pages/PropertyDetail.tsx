import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import PropertyTabs from "@/components/property/PropertyTabs";
import BookingForm from "@/components/property/BookingForm";
import { useGetHomestayById } from "@/hooks/useHomestays";
import PropertyCharacteristics from '@/components/property/PropertyCharacteristics';

// Sample property data - in a real app this would come from an API
const properties = [
  {
    id: "1",
    name: "Vinhomes Riverside Villa",
    location: "Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội",
    price: 1200000,
    rating: 4.8,
    reviewCount: 124,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1167&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ],
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    guests: 8,
    description:
      "Trải nghiệm không gian sống sang trọng tại biệt thự Vinhomes Riverside với không gian xanh mát, view sông thoáng đãng. Biệt thự được thiết kế theo phong cách hiện đại, đầy đủ tiện nghi cao cấp, phù hợp cho các kỳ nghỉ gia đình hoặc tổ chức sự kiện nhỏ.",
    amenities: [
      "Wifi",
      "Hồ bơi",
      "Bãi đỗ xe",
      "Điều hòa",
      "Bếp đầy đủ",
      "Máy giặt",
      "TV màn hình phẳng",
      "Sân vườn",
      "BBQ",
    ],
    host: {
      name: "Minh Tuấn",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      responseRate: 98,
      responseTime: "trong vòng 1 giờ",
    },
    reviews: [
      {
        id: "r1",
        user: "Thanh Hà",
        rating: 5,
        date: "2023-08-15",
        comment:
          "Biệt thự rất đẹp và sang trọng. Chúng tôi đã có một kỳ nghỉ tuyệt vời ở đây. Chủ nhà rất thân thiện và hỗ trợ nhiệt tình.",
      },
      {
        id: "r2",
        user: "Đức Anh",
        rating: 4.5,
        date: "2023-07-22",
        comment:
          "Không gian rộng rãi, tiện nghi đầy đủ. View sông rất đẹp, đặc biệt vào buổi sáng. Chắc chắn sẽ quay lại.",
      },
    ],
    policies: {
      checkin: "14:00",
      checkout: "12:00",
      cancellation: "Miễn phí hủy trước 7 ngày. Hoàn lại 50% trước 3 ngày.",
      rules: [
        "Không hút thuốc trong nhà",
        "Không tụ tập, tổ chức tiệc ồn ào sau 22:00",
        "Không mang vật nuôi",
      ],
    },
    characteristics: [
      "Gần trung tâm thành phố (15 phút di chuyển)",
      "Khu vực yên tĩnh, ít tiếng ồn",
      "View sông thoáng đãng",
      "Gần công viên và cây xanh",
      "Giao thông thuận tiện"
    ],
  },
];

const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id) || properties[0];
  const { getHomestayById, homestay } = useGetHomestayById();

  useEffect(() => {
    getHomestayById(id);
  }, []);

  return (
    <>
      {homestay && (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container py-8">
            <PropertyHeader
              name={homestay.name}
              location={homestay.address}
              rating={homestay.averageRating}
              reviewCount={homestay.reviews.length}
            />

            <PropertyGallery
              images={homestay.images}
              propertyName={homestay.name}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PropertyInfo
                  type={property.type}
                  location={homestay.address}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  guests={homestay.maxGuestsPerRoom}
                  host={homestay.host}
                />

              <PropertyCharacteristics 
              characteristics= {properties[0].characteristics}
              />

                <PropertyTabs
                  description={homestay.description}
                  amenities={homestay.amenities}
                  rating={homestay.averageRating}
                  reviewCount={homestay.reviews.length}
                  reviews={homestay.reviews}
                  policies={property.policies}
                />
              </div>

              <div>
                <BookingForm
                  price={homestay.price}
                  rating={property.rating}
                  maxGuests={homestay.maxGuestsPerRoom}
                  propertyId={homestay._id}
                  propertyName={homestay.name}
                />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default PropertyDetail;
