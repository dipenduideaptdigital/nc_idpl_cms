import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import NatureNavbar from '../nature_homepage/NatureNavbar';
import Footer from './Footer';
import NatureFooter from '../nature_homepage/NatureFooter';
import GetInTouch from '../landing/GetInTouch';
import WhatsAppButton from '../shared/WhatsAppButton';

const MainLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const isNaturePage = location.pathname.startsWith('/ripples') || location.pathname.startsWith('/gulmo') || location.pathname === '/nature-home';

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

  useEffect(() => {
    if (location.pathname === '/') {
      const hasSeen = sessionStorage.getItem('has_seen_consultation_modal');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsModalOpen(true);
          sessionStorage.setItem('has_seen_consultation_modal', 'true');
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

  return (
    <div className={`font-sans antialiased min-h-screen flex flex-col overflow-x-hidden relative ${isNaturePage ? 'bg-[#070e06] text-white' : 'bg-white text-gray-900'}`}>
      {isNaturePage ? <NatureNavbar /> : <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {isNaturePage ? <NatureFooter /> : <Footer />}

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

export default MainLayout;