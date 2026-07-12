import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import Footer from './Footer';
import GetInTouch from '../landing/GetInTouch';
import WhatsAppButton from '../shared/WhatsAppButton';

const LandingLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    window.addEventListener('open-consultation-modal', handleOpenModal);
    window.addEventListener('close-consultation-modal', handleCloseModal);

    return () => {
      window.removeEventListener('open-consultation-modal', handleOpenModal);
      window.removeEventListener('close-consultation-modal', handleCloseModal);
    };
  }, []);

  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col relative overflow-x-hidden">
      <LandingNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Modal Consultation Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10 transition-transform duration-300 transform scale-100 flex flex-col">
            <GetInTouch isModal={true} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingLayout;