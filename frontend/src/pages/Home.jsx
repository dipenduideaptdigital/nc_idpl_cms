import React, { useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import Services from '../components/home/Services';
import OurServices from '../components/home/OurServices';
import OurProjects from '../components/home/OurProjects';
import HowWeWork from '../components/home/HowWeWork';
import Panoramas from '../components/home/Panoramas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import VideoBanner from '../components/home/VideoBanner';
import BlogSection from '../components/home/BlogSection';
import Gallery from '../components/home/Gallery';
import CtaSection from '../components/home/CtaSection';

const Home = () => {
  useScrollAnimation();

  return (
    <>
      <Hero />
      <Services />
      <AboutSection />
      <OurServices />
      
      <HowWeWork />
      <OurProjects />
      <Testimonials />
      <Panoramas />
      <Team />
      <VideoBanner />
      <BlogSection />
      <Gallery />
      <CtaSection />
    </>
  );
};

export default Home;