import React, { useEffect } from 'react';
import AboutHorizontalScroll from '../components/nc_about/AboutHorizontalScroll';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-sans antialiased">
      <AboutHorizontalScroll />
    </div>
  );
};

export default AboutUs;