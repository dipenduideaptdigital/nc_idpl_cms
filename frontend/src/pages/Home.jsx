import React, { useEffect } from 'react';
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
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.opal-move-up, .opal-move-right, .opal-move-left, .fadeInLeft, .fadeInRight');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <Services />
      <AboutSection />
      <OurServices />
      
      <HowWeWork />
      <OurProjects />
      <Panoramas />
      
      <Team />
      
      <Testimonials />
      <VideoBanner />
      <BlogSection />
      <Gallery />
      <CtaSection />
    </>
  );
};

export default Home;
