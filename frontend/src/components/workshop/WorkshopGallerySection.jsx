import React from 'react';
import wgallery1 from '../../assets/nc_logo/wgallery1.png';
import wgallery2 from '../../assets/nc_logo/wgallery2.png';
import wgallery3 from '../../assets/nc_logo/wgallery3.png';
import wgallery4 from '../../assets/nc_logo/wgallery4.png';
import wgallery5 from '../../assets/nc_logo/wgallery5.png';
import brushAccent from '../../assets/nc_logo/brush2.png';

// Helper to resolve asset URLs if dynamic CMS URLs are passed
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const WorkshopGallerySection = ({ data }) => {
  const images = data?.images || [
    data?.image1 ? getAssetUrl(data.image1) : wgallery1,
    data?.image2 ? getAssetUrl(data.image2) : wgallery2,
    data?.image3 ? getAssetUrl(data.image3) : wgallery3,
    data?.image4 ? getAssetUrl(data.image4) : wgallery4,
    data?.image5 ? getAssetUrl(data.image5) : wgallery5,
  ];

  return (
    <section className="relative w-full bg-[#FAFAF7] py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden select-none">
      
      {/* Bottom-Left Watercolor Brush Accent */}
      <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 w-64 sm:w-80 aspect-square pointer-events-none z-0 opacity-35">
        <img
          src={brushAccent}
          alt=""
          className="w-full h-full object-contain filter brightness-110 contrast-105 transform -rotate-45"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-5 sm:space-y-6">
        
        {/* Top Row: 3 Images (4 : 5 : 3 column ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start">
          
          {/* Image 1 (Top Left) */}
          <div className="md:col-span-4 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <img
              src={images[0]}
              alt="Workshop Gallery 1"
              className="w-full h-[220px] sm:h-[260px] md:h-[285px] object-cover object-center"
            />
          </div>

          {/* Image 2 (Top Middle - Slightly Taller) */}
          <div className="md:col-span-5 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <img
              src={images[1]}
              alt="Workshop Gallery 2"
              className="w-full h-[240px] sm:h-[280px] md:h-[310px] object-cover object-center"
            />
          </div>

          {/* Image 3 (Top Right) */}
          <div className="md:col-span-3 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <img
              src={images[2]}
              alt="Workshop Gallery 3"
              className="w-full h-[200px] sm:h-[240px] md:h-[265px] object-cover object-center"
            />
          </div>

        </div>

        {/* Bottom Row: 2 Images (Indented Left, 6 : 4 column ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start">
          
          {/* Image 4 (Bottom Left - Indented, Large Prominent Photo) */}
          <div className="md:col-start-2 md:col-span-6 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <img
              src={images[3]}
              alt="Workshop Gallery 4"
              className="w-full h-[300px] sm:h-[380px] md:h-[420px] object-cover object-center"
            />
          </div>

          {/* Image 5 (Bottom Right) */}
          <div className="md:col-span-4 overflow-hidden rounded-none bg-zinc-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <img
              src={images[4]}
              alt="Workshop Gallery 5"
              className="w-full h-[220px] sm:h-[280px] md:h-[305px] object-cover object-center"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default WorkshopGallerySection;