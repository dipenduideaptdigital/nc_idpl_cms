import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ServiceBanner from '../components/service/ServiceBanner';
// import ServiceDetails from '../components/service/ServiceDetails';
// import ServiceCta from '../components/shared/CallToAction';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ServicePage = () => {
  useScrollAnimation();

  useEffect(() => {
      document.title = 'About Us | Subhaakritee';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  return (
    <div className="min-h-screen bg-white font-helvetica">
      <ServiceBanner/>

    </div>
  );
};

export default ServicePage;