import React, { useState, useEffect, useRef } from 'react';
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

// Counting Animation Component
const AnimatedCounter = ({ text }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const numMatch = text.match(/\d+/);
    const targetNum = numMatch ? parseInt(numMatch[0], 10) : 0;

    if (!isVisible || targetNum === 0) return;

    let start = 0;
    const duration = 2000; 
    const increment = targetNum / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNum) {
        clearInterval(timer);
        setCount(targetNum);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, text]);

  const numMatch = text.match(/\d+/);
  const suffix = text.replace(/\d+/g, '');

  return (
    <span ref={ref}>
      {numMatch ? `${count}${suffix}` : text}
    </span>
  );
};

const OurServices = ({ data: externalData }) => {
  const [activeService, setActiveService] = useState('01');
  const [content, setContent] = useState(externalData || null);
  const [serviceImg, setServiceImg] = useState(defaultServiceImg);
  const [countingImg, setCountingImg] = useState(defaultCountingImg);
  const [houseTranslateX, setHouseTranslateX] = useState(0);

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

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let currentX = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      
      currentX -= delta * 0.35; 
      
      if (currentX > 150) currentX = 150;
      if (currentX < -150) currentX = -150;

      setHouseTranslateX(currentX);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <span key={index} className="text-[#3B82F6]">
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr] gap-8 md:gap-12 mb-12 md:mb-20 items-start">
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>

          <div className="fadeInRight">
            <h2 className="text-[40px] md:text-[50px] lg:text-[70px] font-bold tracking-[-0.04em] text-gray-900 mb-6 leading-[1.1] lg:leading-[73px] capitalize font-['Helvetica']">
              {renderTitle(title)}
            </h2>
            <p className="text-gray-500 max-w-3xl font-light text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Middle Section: Image & Services List */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.55fr_1fr] gap-10 lg:gap-16 mb-24 md:mb-32 items-center">
          <div className="relative rounded-[37px] overflow-hidden h-[450px] lg:h-[544px] lg:max-w-[798px] w-full fadeInLeft group">
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
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[85%] max-w-[450px] p-5 md:p-6 bg-black/25 backdrop-blur-md border border-white/10 rounded-2xl">
              <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                Extending design services to outdoor spaces such as gardens, patios, and decks.
              </p>
            </div>
          </div>

          <div className="fadeInRight w-full lg:max-w-[450px] lg:ml-auto">
            <div className="flex flex-col">
              {servicesList.map((service, index) => {
                const serviceId = service.id || `0${index + 1}`;
                const isActive = activeService === serviceId;
                const isLast = index === servicesList.length - 1;

                return (
                  <div
                    key={index}
                    className={`group flex items-center justify-between py-[16px] lg:py-[20px] cursor-pointer transition-colors border-t ${isActive ? 'border-t-[2px] border-[#3B82F6]' : 'border-t border-gray-300'
                      } ${isLast ? 'border-b border-b-gray-300' : ''}`}
                    onMouseEnter={() => setActiveService(serviceId)}
                  >
                    <div className="flex items-center space-x-6 md:space-x-8 transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-lg font-medium text-gray-900 w-6">
                      {serviceId}
                    </span>
                    <span className="text-[25px] font-bold text-gray-900 leading-[25px] tracking-normal align-middle capitalize font-['Helvetica']">
                      {service.title}
                    </span>
                  </div>

                  {isActive ? (
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 group-hover:bg-gray-100 transition-colors shrink-0">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20 text-center items-start">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center opal-move-up">
              <h3 className="text-[36px] md:text-[44px] font-bold text-[#3B82F6] mb-1 md:mb-2">
                <AnimatedCounter text={stat.value} />
              </h3>
              
              <div className="w-full max-w-[140px] h-[2px] bg-gray-500 mb-2 md:mb-3"></div>
              
              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 tracking-wide uppercase">
                {stat.title}
              </h4>
              
              <p className="text-[11px] md:text-xs text-gray-700 font-normal leading-relaxed max-w-[170px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section*/}
        <div className="w-full flex justify-center opal-move-up mt-10">
          <img
            src={countingImg}
            alt="3D Floor Plan Rendering"
            className="w-full max-w-[1100px] object-cover scale-100" 
            style={{ 
              transform: `translateX(${houseTranslateX}px) scale(1)`, 
              transition: 'transform 0.1s ease-out' 
            }}
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