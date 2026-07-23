import React from 'react';
import { renderTitle } from '../../utils/titleRenderer';
import imgLeft from '../../assets/homepage/about_img.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const ProcessSectionTwo = ({ data }) => {
  const resolvedImg = data?.image ? getAssetUrl(data.image, imgLeft) : imgLeft;

  const stepsList = [
    {
      num: '01',
      title: data?.steps?.[0]?.title || 'Initial Consultation',
      desc: data?.steps?.[0]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    },
    {
      num: '02',
      title: data?.steps?.[1]?.title || 'Design & Planning',
      desc: data?.steps?.[1]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    },
    {
      num: '03',
      title: data?.steps?.[2]?.title || 'Implementation',
      desc: data?.steps?.[2]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    },
    {
      num: '04',
      title: data?.steps?.[3]?.title || 'Project Handover',
      desc: data?.steps?.[3]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    },
  ];

  return (
    <section id="process" className="py-18 md:py-20 bg-[#f8f9fa] text-gray-900 font-helvetica overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Split Header Block (Matches the layout of ServicesSectionTwo) */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12 mb-12 md:mb-14 text-left">
          {/* Left: Tagline Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-300 bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-600 uppercase">
                {data?.badgeText || 'GET IN TOUCH'}
              </span>
            </div>
          </div>

          {/* Right: Main Title & Description */}
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.15] tracking-tight mb-6 font-helvetica">
              {renderTitle(data?.title || 'Description [Architecture]\n[Process] For Exceptional Results.')}
            </h2>
            
            <div 
              className="text-gray-500 text-sm md:text-base font-normal leading-relaxed max-w-2xl prose prose-sm prose-p:my-2 prose-strong:font-bold prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ 
                __html: data?.description || '<p>We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.</p>' 
              }}
            />
          </div>
        </div>

        {/* Bottom Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 md:gap-12 items-stretch">
          
          {/* Left: Large Showcase Image */}
          <div className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-0 rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.06)] bg-white">
            <img 
              src={resolvedImg} 
              alt="Process Staircase" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = imgLeft;
              }}
            />
          </div>

          {/* Right: 2x2 Grid of Process Cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
            {stepsList.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl md:rounded-[28px] p-4 sm:p-6 md:p-8 flex flex-col items-start text-left shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 group"
              >
                {/* Large soft-blue gradient number */}
                <span className="text-5xl md:text-7xl font-extrabold bg-gradient-to-b from-[#3b82f6]/35 to-[#3b82f6]/5 bg-clip-text text-transparent leading-none mb-4 md:mb-5 select-none tracking-tighter shrink-0 font-helvetica">
                  {step.num}
                </span>
                
                {/* Title */}
                <h3 className="text-xs sm:text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight group-hover:text-[#3b82f6] transition-colors duration-300 font-helvetica">
                  {step.title}
                </h3>
                
                <p className="text-gray-500 text-[10px] sm:text-xs md:text-[14px] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProcessSectionTwo;