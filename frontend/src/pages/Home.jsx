import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 0; 
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Services />
      
      <div id="about">
        <AboutSection />
      </div>
      
      <div id="services">
        <OurServices />
      </div>
      
      <div id="process">
        <HowWeWork />
      </div>
      
      <div id="projects">
        <OurProjects />
      </div>
      
      <Testimonials />
      <Panoramas />
      <Team />
      <VideoBanner />
      
      <div id="blog">
        <BlogSection />
      </div>
      
      <Gallery />
      <CtaSection />
    </>
  );
};

export default Home;