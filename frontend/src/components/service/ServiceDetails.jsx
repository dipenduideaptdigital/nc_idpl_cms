import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import service1 from '../../assets/service/Service1.png';
import service2 from '../../assets/service/Service2.png';
import disruptiveInnovation from '../../assets/service/disruptive-innovation.png';
import service3 from '../../assets/service/Service3.png';
import service4 from '../../assets/service/Service4.png';

const FEATURES = [
  { title: "Space Optimization", description: "Through The Best Smart Space Optimisation Interior Design." },
  { title: "Space Optimization", description: "Through The Best Smart Space Optimisation Interior Design." },
  { title: "Space Optimization", description: "Through The Best Smart Space Optimisation Interior Design." },
  { title: "Space Optimization", description: "Through The Best Smart Space Optimisation Interior Design." },
];

const FAQS = [
  "What Interior Design Services Do You Offer?",
  "What Services Do You Offer?",
  "What Is Your Design Process?",
  "How Do You Establish Your Design Fees?"
];

const ServiceDetails = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [dynamicServices, setDynamicServices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchDynamicServices = async () => {
      try {
        const response = await pagesApi.getPublicPages();
        const allPages = response.data || [];
        const servicePages = allPages.filter(page =>
          page.fullPath && page.fullPath.startsWith('/services/')
        );
        setDynamicServices(servicePages);
      } catch (error) {
        console.error("Failed to fetch dynamic services for sidebar:", error);
      }
    };

    fetchDynamicServices();
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-[#F8F9FA] font-helvetica">
      <div className="container mx-auto max-w-[1400px] px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16">

          {/* Left Sidebar */}
          <div className="w-full lg:w-[32%] flex flex-col md:flex-row lg:flex-col gap-6 md:gap-6 lg:space-y-10 lg:gap-0 shrink-0">
            {/* Mobile-only Dropdown */}
            <div className="sm:hidden -mx-5 px-5 relative mb-4" ref={dropdownRef}>
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-[#3B82F6]"></span>
                Other Services
              </h3>

              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3.5 shadow-sm text-left focus:outline-none transition-all duration-200 hover:border-[#3B82F6]"
              >
                <span className="text-[15px] font-bold text-gray-900 capitalize">
                  {dynamicServices.find(s => location.pathname === s.fullPath)?.title || "Select Service"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#3B82F6]' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-5 right-5 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="max-h-[300px] overflow-y-auto py-1">
                    {dynamicServices.length > 0 ? (
                      dynamicServices.map((service) => {
                        const isActive = location.pathname === service.fullPath;
                        return (
                          <Link
                            key={service.id}
                            to={service.fullPath}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`block px-5 py-3.5 text-[14.5px] font-semibold transition-colors border-b border-gray-50 last:border-b-0 ${isActive
                                ? 'bg-blue-50/70 text-[#3B82F6]'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-[#3B82F6]'
                              }`}
                          >
                            {service.title}
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4 italic">Loading services...</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile-only Need Design Help Image */}
            <div className="sm:hidden relative w-full h-[190px] rounded-2xl overflow-hidden mb-6">
              <img
                src={service2}
                alt="Need Design Help"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span className="absolute bottom-3 left-4 right-4 text-white text-[14px] font-semibold">
                Need Design Help?
              </span>
            </div>

            {/* Desktop-only card list */}
            <div className="hidden sm:block w-full md:w-1/2 lg:w-full bg-white rounded-[24px] pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-15 lg:pb-15 shadow-sm border border-gray-100/50">
              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 mb-6 sm:mb-8 text-center px-4">
                Other Services
              </h3>

              <div className="flex flex-col px-5 sm:px-8 lg:px-10">
                {dynamicServices.length > 0 ? (
                  dynamicServices.map((service, index) => {
                    const isActive = location.pathname === service.fullPath;
                    const isLast = index === dynamicServices.length - 1;

                    return (
                      <Link
                        to={service.fullPath}
                        key={service.id}
                        className={`group flex items-center justify-between py-[16px] lg:py-[20px] cursor-pointer transition-colors border-t ${isActive ? 'border-t-[2px] border-[#3B82F6]' : 'border-t border-gray-200'
                          } ${isLast ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="flex items-center space-x-4 md:space-x-5 transform group-hover:translate-x-2 transition-transform duration-300 pr-4 pl-4 lg:pl-6">
                          <span className={`text-[17px] lg:text-[19px] font-base leading-[1.2] capitalize font-helvetica transition-colors ${isActive ? 'text-[#3B82F6]' : 'text-gray-900 group-hover:text-[#3B82F6]'}`}>
                            {service.title}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 text-center italic">Loading services...</p>
                )}
              </div>
            </div>

            {/* Desktop-only Need Design Help Image */}
            <div className="hidden sm:block relative w-full md:w-1/2 lg:w-full h-[260px] sm:h-[320px] md:h-auto lg:h-[450px] xl:h-[600px] rounded-[24px] overflow-hidden group">
              <img src={service2} alt="Need Design Help" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Right Content (Static Fallback Details) */}
          <div className="w-full lg:w-[68%] flex flex-col">
<div className="hidden md:block w-[660px] h-[500px] rounded-[20px] overflow-hidden mb-8 lg:mb-10 ml-10">    
            </div>

            <div className="pr-0 lg:pr-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                About The Service
              </h1>
              <p className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10">
                Commercial interior design is constantly evolving, with a new trends emerging to meet the changing to needs and preferences of the businesses and their customers. One of the most significant trends in that's recent years is biophilic design, which involves incorporating natural elements like plants, wood, and stone into the design.
                <br /><br />
                A growing demand for adaptable layouts that can accommodate changing needs. This might include modular movable partitions. Sustainability is alsokey trend in commercial interior design.
              </p>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-y-8 sm:gap-x-10 mb-10 sm:mb-14">
                {FEATURES.map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5 sm:gap-4">
                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#198CF4] flex items-center justify-center shrink-0">
                      <img src={disruptiveInnovation} alt={item.title} className="w-5.5 h-5.5 sm:w-8 sm:h-8 object-contain" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="text-[15px] sm:text-[20px] font-bold text-[#222] leading-tight mb-0.5 sm:mb-0">{item.title}</h3>
                      <p className="text-[11.5px] sm:text-[13px] font-semibold leading-[16px] sm:leading-[20px] text-[#444] max-w-none sm:max-w-[230px]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={service3} alt="Service detail 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="hidden md:block h-[280px] rounded-[24px] overflow-hidden">
                  <img src={service4} alt="Service detail 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;