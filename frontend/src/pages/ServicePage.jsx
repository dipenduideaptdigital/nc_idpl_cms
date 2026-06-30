import React, { useEffect } from 'react';
import ServiceBanner from '../components/service/ServiceBanner';
import ServiceDetails from '../components/service/ServiceDetails';
import CtaSection from '../components/home/CtaSection'; 
import useScrollAnimation from '../hooks/useScrollAnimation';

const ServicePage = () => {
  useScrollAnimation();

  useEffect(() => {
    document.title = 'Services | Subhaakritee';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white font-helvetica">
      <ServiceBanner title="Commercial Interior" subTitle="Services" />
      <ServiceDetails />
      <CtaSection />
      
    </div>
  );
};

export default ServicePage;