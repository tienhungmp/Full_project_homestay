
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import SearchBox from '@/components/SearchBox';
import FeaturedProperties from '@/components/FeaturedProperties';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <div className="container px-4">
          <SearchBox />
        </div>
        <FeaturedProperties />
        <AboutSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
