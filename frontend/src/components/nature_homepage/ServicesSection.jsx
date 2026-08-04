import React from 'react';
import brush2Img from '../../assets/nc_logo/bush3.png';
import defaultConsultationImg from '../../assets/nc_home/consultation.png';

// Helper to resolve the correct image URL from your backend
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const defaultServices = [
  {
    number: '01',
    title: 'DESIGN CONSULTATION',
    description: "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.",
    image: defaultConsultationImg
  }
];

const ServicesSection = ({ data }) => {
  const tagline = data?.tagline || "our services";
  const headline = data?.headline || "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.";
  const subtext = data?.subtext || "Every project starts as a question no one has ayes. We go in deep, past the surface, past the expected and come back with something that didn't exist before.";
  
  const servicesToRender = (data?.services && data.services.length > 0) ? data.services : defaultServices;

  return (
    <section className="relative w-full pl-5 bg-white py-20 sm:py-28 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
      
      {/* Background Soft Paint Splash Pinned to Top-Right */}
      <div className="absolute top-0 right-0 w-[350px] sm:w-[500px] lg:w-[500px] h-auto pointer-events-none z-0 opacity-59">
        <img src={brush2Img} alt="" className="w-full h-auto object-contain object-right-top" />
      </div>

      <div className="max-w-[1340px] mx-auto relative z-10 ml-5">
        
        {/* Header Block */}
        <div className="max-w-[820px] space-y-6 mb-16 sm:mb-20">
          <span className="font-kanit text-[20px] sm:text-[30px] font-medium text-[#7BA641] leading-[100%] tracking-[0%] align-middle block lowercase" style={{ fontWeight: 500, verticalAlign: 'middle' }}>
            {tagline}
          </span>
          <div 
            className="font-kanit text-xl sm:text-4xl lg:text-[37px] font-light text-zinc-900 leading-[38px] sm:leading-[48px] lg:leading-[55px] tracking-[0%] align-middle max-w-4xl [&>p]:m-0" 
            style={{ fontWeight: 300, verticalAlign: 'middle' }}
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          <div 
            className="font-kanit text-base sm:text-lg text-zinc-500 font-light leading-[34px] tracking-[0%] align-middle max-w-[420px] [&>p]:m-0" 
            style={{ fontWeight: 300, lineHeight: '34px', letterSpacing: '0%', verticalAlign: 'middle' }}
            dangerouslySetInnerHTML={{ __html: subtext }}
          />
        </div>

        {/* Dynamically Render Service Cards */}
        <div className="space-y-20">
          {servicesToRender.map((svc, index) => (
            <div key={index} className="relative max-w-[1240px] mx-auto">
              
              {/* Main Card */}
              <div className="relative rounded-xs overflow-hidden shadow-2xl bg-[#08171d] min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Left Image Side (8 Columns) */}
                <div className="lg:col-span-8 relative min-h-[320px] lg:min-h-full">
                  <img
                    src={svc.image ? getAssetUrl(svc.image) : defaultConsultationImg}
                    alt={svc.title}
                    className="w-full h-full object-cover object-left-top filter brightness-105 contrast-105"
                  />
                  {/* Soft gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#08171d]/30 via-65% to-[#08171d] pointer-events-none" />
                </div>

                {/* Right Dark Content Side (4 Columns) */}
                <div className="lg:col-span-4 bg-[#08171d] p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 text-white relative z-10 lg:-ml-8">
                  <div className="font-kanit text-5xl sm:text-6xl font-normal text-white tracking-wider">
                    {svc.number}
                  </div>
                  <h3 className="font-kanit text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase">
                    {svc.title}
                  </h3>
                  <div 
                    className="font-kanit text-sm sm:text-base text-zinc-200/90 font-light leading-[34px] tracking-[0%] align-middle [&>p]:m-0" 
                    style={{ fontWeight: 300, lineHeight: '34px', letterSpacing: '0%', verticalAlign: 'middle' }}
                    dangerouslySetInnerHTML={{ __html: svc.description }}
                  />
                </div>

              </div>

              {/* Stacked Shadow Bar 1 */}
              <div className="h-4 bg-[#23353d] mx-6 rounded-b-sm shadow-md" />
              {/* Stacked Shadow Bar 2 */}
              <div className="h-4 bg-[#142329] mx-12 rounded-b-sm shadow-sm" />

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;