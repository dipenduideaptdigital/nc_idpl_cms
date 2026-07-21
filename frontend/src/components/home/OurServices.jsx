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
  const [houseTranslateX, setHouseTranslateX] = useState(150);
  
  const imageContainerRef = useRef(null);

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
    const handleScroll = () => {
      if (!imageContainerRef.current) return;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDistance = windowHeight + rect.height;
        const currentScrolled = windowHeight - rect.top;
        let progress = currentScrolled / totalDistance;

        progress = Math.max(0, Math.min(1, progress));
        const targetX = 150 - (progress * 300);

        setHouseTranslateX(targetX);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const badgeText = content?.badgeText || "OUR SERVICES";
  const title = content?.title || "Explore Our [Comprehensive Interior Design] Services";
  const description = content?.description || "<p>We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.</p>";
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
      <div className="container mx-auto px-4 md:px-5 max-w-7xl">

        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_4.5fr] gap-8 md:gap-12 mb-12 md:mb-20 items-start">
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

            <div
              className="text-gray-500 max-w-3xl font-light text-sm md:text-base leading-relaxed prose prose-sm sm:prose-base max-w-none prose-p:m-0 prose-a:text-blue-500 hover:prose-a:text-blue-600 [&_strong]:text-gray-900 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        {/* Middle Section: Image & Services List */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.35fr_1.15fr] gap-10 lg:gap-16 xl:gap-12 mb-24 md:mb-32 items-center">
          <div className="relative rounded-[37px] overflow-hidden h-[450px] lg:h-[544px] lg:max-w-[900px] w-full fadeInLeft group">
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

          <div className="fadeInRight w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:flex-col lg:gap-0">
              {servicesList.map((service, index) => {
                const serviceId = service.id || `0${index + 1}`;
                const isActive = activeService === serviceId;
                const isLast = index === servicesList.length - 1;

                return (
                  <div
                    key={index}
                    className={`group flex flex-col justify-between p-3 sm:p-4 rounded-[1.25rem] border cursor-pointer transition-all duration-300
                      lg:flex-row lg:items-center lg:py-[20px] lg:px-0 lg:border-0 mr-12 lg:border-t lg:border-gray-300 lg:bg-transparent lg:rounded-none lg:hover:bg-transparent lg:hover:shadow-none
                      ${index >= 4 ? 'hidden lg:flex' : 'flex'}
                      ${isActive
                        ? 'border-[#3B82F6] bg-blue-50/30'
                        : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-md'
                      }
                      ${isLast ? 'lg:border-b lg:border-b-gray-300' : ''}`}
                    onMouseEnter={() => setActiveService(serviceId)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-4 md:space-x-5 transform lg:group-hover:translate-x-2 transition-transform duration-300 w-full">
                      <span className="text-xs lg:text-2xl font-medium text-gray-400 lg:text-gray-700 w-6 ">
                        {serviceId}
                      </span>
                      <span className="text-xs sm:text-sm md:text-base ml-4 lg:text-[23px] font-bold text-gray-800 leading-snug lg:leading-[20px] tracking-normal capitalize font-['Helvetica']">
                        {service.title}
                      </span>
                    </div>

                    <div className="mt-3 lg:mt-0 flex justify-end w-full lg:w-auto shrink-0 mr-15">
                      {isActive ? (
                        <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
                          <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-gray-900 bg-white border border-gray-200 group-hover:bg-gray-100 lg:bg-transparent lg:border-none transition-colors shrink-0">
                          <ArrowUpRight className="w-4 h-4 lg:w-6 lg:h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-16 text-center items-start">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center opal-move-up">
              <h3 className="text-[32px] md:text-[40px] font-bold text-[#3B82F6] font-helvetica leading-none mb-1">
                <AnimatedCounter text={stat.value} />
              </h3>

              <div className="w-full max-w-[120px] h-[1px] bg-gray-300 mb-1.5"></div>

              <h4 className="text-sm md:text-sm font-bold text-gray-900 mb-1 tracking-wider uppercase leading-tight">
                {stat.title}
              </h4>

              <p className="text-[11px] md:text-xs text-gray-500 font-normal leading-relaxed max-w-[170px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div ref={imageContainerRef} className="w-full flex justify-center opal-move-up mt-10">
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