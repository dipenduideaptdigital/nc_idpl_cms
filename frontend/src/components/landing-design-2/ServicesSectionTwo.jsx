import React from 'react';
import img1 from '../../assets/homepage/view.jpg';
import img2 from '../../assets/homepage/about_img.png';
import img3 from '../../assets/homepage/gallery4.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const ServicesSectionTwo = ({ data }) => {
  const resolvedImg1 = data?.services?.[0]?.image ? getAssetUrl(data.services[0].image, img1) : img1;
  const resolvedImg2 = data?.services?.[1]?.image ? getAssetUrl(data.services[1].image, img2) : img2;
  const resolvedImg3 = data?.services?.[2]?.image ? getAssetUrl(data.services[2].image, img3) : img3;

  const servicesList = [
    {
      num: '01',
      title: data?.services?.[0]?.title || 'Initial Consultation',
      desc: data?.services?.[0]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: resolvedImg1,
      imageAtTop: true,
    },
    {
      num: '02',
      title: data?.services?.[1]?.title || 'Initial Consultation',
      desc: data?.services?.[1]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: resolvedImg2,
      imageAtTop: false,
    },
    {
      num: '03',
      title: data?.services?.[2]?.title || 'Initial Consultation',
      desc: data?.services?.[2]?.description || 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
      image: resolvedImg3,
      imageAtTop: true,
    },
  ];

  return (
    <section className="py-10 md:py-23 bg-[#111111] text-white font-helvetica overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        
        {/* Header Grid */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-16 md:mb-20 text-left">
          {/* Tagline Badge */}
          <div className="shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/90">
                {data?.badgeText || 'OUR SERVICES'}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-[48px] font-bold leading-[1.15] tracking-tight font-helvetica text-white">
              Explore Our <span className="text-[#3b82f6]">Comprehensive</span> <br />
              <span className="text-[#3b82f6]">Interior Design</span> Services
            </h2>
          </div>
        </div>

        {/* 3-Cards Alternating Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-[32px] p-6 md:p-8 flex flex-col h-[430px] md:h-[450px] shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden text-gray-900"
            >
              {service.imageAtTop ? (
                <>
                  {/* Top Image */}
                  <div className="w-full h-[190px] rounded-[24px] overflow-hidden mb-6 shrink-0">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const fallback = idx === 0 ? img1 : img3;
                        e.currentTarget.src = fallback;
                      }}
                    />
                  </div>

                  {/* Bottom Content Area */}
                  <div className="flex flex-col text-left">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-[1.2]">
                        {service.title}
                      </h3>
                      <span className="text-4xl md:text-[44px] font-extrabold text-[#3b82f6] leading-none shrink-0 ml-4">
                        {service.num}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[14px] leading-relaxed font-normal">
                      {service.desc}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Top Content Area */}
                  <div className="flex flex-col text-left mb-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-[1.2]">
                        {service.title}
                      </h3>
                      <span className="text-4xl md:text-[44px] font-extrabold text-[#3b82f6] leading-none shrink-0 ml-4">
                        {service.num}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[14px] leading-relaxed font-normal">
                      {service.desc}
                    </p>
                  </div>

                  {/* Bottom Image */}
                  <div className="w-full h-[190px] rounded-[24px] overflow-hidden shrink-0 mt-auto">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = img2;
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSectionTwo;
