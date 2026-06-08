import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import defaultServiceImg from '../../assets/homepage/service.png';
import defaultCountingImg from '../../assets/homepage/counting.png';
import apiClient from '../../api/client';

const defaultServicesList = [
  { id: '01', title: 'Residential Interior Design' },
  { id: '02', title: 'Outdoor & Landscape Design' },
  { id: '03', title: 'Interior Design Consultation' },
  { id: '04', title: 'Commercial Interior Design' },
  { id: '05', title: 'Renovation And Remodeling' },
  { id: '06', title: 'Interior 2D/3D Layouts' },
];

const defaultStatsData = [
  { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
  { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
  { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
  { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' },
];

const OurServices = ({ data: externalData }) => {
  const [activeService, setActiveService] = useState('01');
  const [content, setContent] = useState(externalData || null);
  const [serviceImg, setServiceImg] = useState(defaultServiceImg);
  const [countingImg, setCountingImg] = useState(defaultCountingImg);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
      
      if (fetchedContent.image) {
        const mainUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img1 = new Image();
        img1.src = mainUrl;
        img1.onload = () => { if (isMounted) setServiceImg(mainUrl); };
        img1.onerror = () => { if (isMounted) setServiceImg(defaultServiceImg); };
      } else if (isMounted) { setServiceImg(defaultServiceImg); }

      if (fetchedContent.bottomImage) {
        const bottomUrl = fetchedContent.bottomImage.startsWith('http') ? fetchedContent.bottomImage : `${serverUrl}${fetchedContent.bottomImage}`;
        const img2 = new Image();
        img2.src = bottomUrl;
        img2.onload = () => { if (isMounted) setCountingImg(bottomUrl); };
        img2.onerror = () => { if (isMounted) setCountingImg(defaultCountingImg); };
      } else if (isMounted) { setCountingImg(defaultCountingImg); }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchServicesData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_our_services');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch our services content:', error);
      }
    };

    fetchServicesData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "OUR SERVICES";
  const title = content?.title || "Explore Our [Comprehensive Interior Design] Services";
  const description = content?.description || "We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.";
  const servicesList = content?.services || defaultServicesList;
  const statsData = content?.stats || defaultStatsData;

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 md:gap-12 mb-12 md:mb-20 items-start">
          {/* Left: Badge */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="fadeInRight">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {renderTitle(title)}
            </h2>
            <p className="text-gray-500 max-w-3xl font-light text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Middle Section: Image & Services List */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16 md:mb-24 items-center">
          
          {/* Left: Image with Overlay */}
          <div className="relative rounded-[2rem] overflow-hidden h-[400px] lg:h-[500px] w-full shadow-2xl fadeInLeft group">
            <img 
              src={serviceImg} 
              alt="Interior Design Service" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                if (e.currentTarget.src !== defaultServiceImg) {
                  e.currentTarget.src = defaultServiceImg;
                }
              }}
            />
            {/* Dark overlay banner at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <p className="text-white text-sm font-light max-w-sm">
                Extending design services to outdoor spaces such as gardens, patios, and decks.
              </p>
            </div>
          </div>

          {/* Right: Services List */}
          <div className="flex flex-col fadeInRight">
            {servicesList.map((service, index) => {
              const serviceId = service.id || `0${index + 1}`;
              const isActive = activeService === serviceId;
              
              return (
                <div 
                  key={index}
                  className="group flex items-center justify-between py-5 md:py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-xl px-2 -mx-2"
                  onMouseEnter={() => setActiveService(serviceId)}
                >
                  <div className="flex items-center space-x-6 md:space-x-8 transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-lg font-medium text-gray-600 w-6">
                      {serviceId}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {service.title}
                    </span>
                  </div>
                  
                  {isActive ? (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 group-hover:bg-gray-100 transition-colors">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-20 md:mb-32 text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center opal-move-up">
              <h3 className="text-5xl font-bold text-primary mb-6">{stat.value}</h3>
              <div className="w-full max-w-[120px] h-[1px] bg-gray-400 mb-6"></div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 tracking-wide">{stat.title}</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[200px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section: 3D Floor Plan Image */}
        <div className="w-full flex justify-center opal-move-up">
          <img 
            src={countingImg}
            alt="3D Floor Plan Rendering" 
            className="w-full max-w-5xl rounded-3xl object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== defaultCountingImg) {
                e.currentTarget.src = defaultCountingImg;
              }
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default OurServices;