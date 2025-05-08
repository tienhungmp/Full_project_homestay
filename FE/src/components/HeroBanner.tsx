
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/search');
  };

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')" 
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl animate-fade-in">
          Khám phá không gian nghỉ dưỡng lý tưởng
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-center max-w-2xl animate-fade-in">
          Tìm và đặt homestay, khách sạn tốt nhất với giá ưu đãi
        </p>
        <Button 
          size="lg"
          className="mt-8 bg-brand-red hover:bg-brand-red/90 text-white px-8 py-6 text-lg"
          onClick={handleExplore}
        >
          Khám phá ngay
        </Button>
      </div>
    </div>
  );
};

export default HeroBanner;
