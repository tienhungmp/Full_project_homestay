
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
      <div className="absolute inset-0">
        {/* Image Carousel */}
        <div className="relative w-full h-full">
          {[
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1586611292717-f828b167408c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          ].map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transform scale-105"
              style={{
                backgroundImage: `url('${image}')`,
                opacity: 0,
                transition: 'all 6s ease-in-out',
                animation: `carousel-zoom ${30}s linear infinite ${index * 6}s`
              }}
            />
          ))}
          <style>
            {`
              @keyframes carousel-zoom {
                0%, 25% {
                  opacity: 0;
                  transform: scale(1.05);
                }
                4%, 21% {
                  opacity: 1;
                }
                12.5% {
                  transform: scale(1);
                }
              }
            `}
          </style>
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <h1 
          style={{lineHeight: '1.4'}} 
          className="leading-relaxed p-1 text-4xl md:text-5xl lg:text-6xl font-semibold text-center max-w-4xl animate-glow-soft bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-teal-100 to-violet-200"
        >
          Khám phá không gian nghỉ dưỡng lý tưởng
          <style>{`
            @keyframes glow-soft {
              0%, 100% {
                text-shadow: 0 0 12px rgba(251, 207, 232, 0.3),
                            0 0 20px rgba(204, 251, 241, 0.25),
                            0 0 30px rgba(221, 214, 254, 0.2),
                            0 0 40px rgba(251, 207, 232, 0.15);
              }
              50% {
                text-shadow: 0 0 15px rgba(251, 207, 232, 0.35),
                            0 0 25px rgba(204, 251, 241, 0.3),
                            0 0 35px rgba(221, 214, 254, 0.25),
                            0 0 45px rgba(251, 207, 232, 0.2);
              }
            }
            .animate-glow-soft {
              animation: glow-soft 5s ease-in-out infinite;
              letter-spacing: 0.5px;
              text-shadow: 0 0 10px rgba(251, 207, 232, 0.2);
            }
          `}</style>
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-center max-w-2xl animate-glow-text">
          Tìm và đặt homestay, khách sạn tốt nhất với giá ưu đãi
          <style>{`
            @keyframes glow-text {
              0%, 100% {
                text-shadow: 0 0 8px rgba(186, 230, 253, 0.4),
                            0 0 15px rgba(186, 230, 253, 0.3),
                            0 0 25px rgba(186, 230, 253, 0.2);
                color: rgb(224, 242, 254);
              }
              50% {
                text-shadow: 0 0 12px rgba(186, 230, 253, 0.5),
                            0 0 20px rgba(186, 230, 253, 0.4),
                            0 0 30px rgba(186, 230, 253, 0.3);
                color: rgb(240, 249, 255);
              }
            }
            .animate-glow-text {
              animation: glow-text 3s ease-in-out infinite;
            }
          `}</style>
        </p>
        <Button 
          size="lg"
          className="mt-8 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-600 hover:via-blue-700 hover:to-cyan-600 text-white px-8 py-6 text-lg transition-all duration-300 shadow-lg shadow-sky-500/50"
          onClick={handleExplore}
        >
          Khám phá ngay
        </Button>
      </div>
    </div>
  );
};

export default HeroBanner;
