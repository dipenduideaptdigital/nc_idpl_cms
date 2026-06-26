import React, { useEffect } from 'react';
import ContactBanner from '../components/contact/ContactBanner';
import ContactInfo from '../components/contact/ContactInfo';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ContactUs = () => {
  useScrollAnimation(); 

  useEffect(() => {
    document.title = 'Contact Us | Subhaakritee';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white font-helvetica">
      <ContactBanner />
      <ContactInfo />
    </div>
  );
};

export default ContactUs;