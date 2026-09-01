import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NatureNavbar from '../nature_homepage/NatureNavbar';
import NatureFooter from '../nature_homepage/NatureFooter';
import GetInTouch from '../shared/GetInTouch';
import WhatsAppButton from '../shared/WhatsAppButton';
import GlobalFormModal from '../dynamic-forms/GlobalFormModal';

const MainLayout = ({ children }) => {
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
    <div className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden relative bg-[#070e06] text-white">
      <NatureNavbar />

      <main className="flex-grow pt-24">
        {children || <Outlet />}
      </main>

      <NatureFooter />
      <WhatsAppButton />

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white text-zinc-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto z-10 transition-transform duration-300 transform scale-100 flex flex-col">
            <GetInTouch isModal={true} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      <GlobalFormModal />
      
    </div>
  );
};

export default MainLayout;