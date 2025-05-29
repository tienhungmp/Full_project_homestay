import React from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import SearchBox from '@/components/SearchBox';
import FeaturedProperties from '@/components/FeaturedProperties';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import SpecialOffers from '@/components/SpecialOffers';
import PopularDestinations from '@/components/PopularDestinations';
import WhyChooseUs from '@/components/WhyChooseUs';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <div className="container px-4 relative">
          <SearchBox />
        </div>
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <FeaturedProperties />
        </div>
        <div className="bg-gradient-to-r from-white to-blue-50">
          <SpecialOffers />
        </div>
        <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <PopularDestinations />
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50">
          <AboutSection />
        </div>
        <div className="bg-gradient-to-br from-white to-indigo-50">
          <WhyChooseUs />
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50">
          <Testimonials />
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100">
          <NewsletterSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
