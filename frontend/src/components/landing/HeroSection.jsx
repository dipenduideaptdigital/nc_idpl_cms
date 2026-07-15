import React from 'react';
import landing from '../../assets/homepage/landing.jpg';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const HeroSection = ({ data }) => {
  // Use CMS backgroundImage if available, otherwise fallback to local image
  const bgImage = data?.backgroundImage ? getAssetUrl(data.backgroundImage) : landing;
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 md:bg-black/10"></div>
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-8 h-screen flex flex-col justify-center mr-1.5 ">
        <div className="max-w-2xl mt-16 md:mt-24">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
            {data?.titleLine1 || 'End-To-End'}<br />
            {data?.titleLine2 || 'Office Interiors'}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            {data?.subtitle || 'For Every Test & Budget'}
          </h2>
          <p className="text-base md:text-lg text-gray-200 mb-10 max-w-lg font-light leading-relaxed">
            {data?.description || "Simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry's standard,"}
          </p>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3.5 rounded-md text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-orange-500/30 uppercase">
            {data?.buttonText || 'Book A Free Consultation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
