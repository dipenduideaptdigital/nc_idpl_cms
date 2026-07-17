import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import disruptiveInnovation from '../../assets/service/disruptive-innovation.png';
import { resolveAssetUrl } from '../../utils/assetResolver';
import { pagesApi } from '../../api/pages';

const ServiceDetailsBlock = ({
  sidebarImage,
  mainImage,
  aboutTitle,
  aboutDescription,
  features = [],
  midImage1,
  midImage2,
  typesTitle,
  typesDescription,
  elementsTitle,
  elementsDescription,
  leftBullets = [],
  rightBullets = [],
  footerDescription,
  faqs = []
}) => {
  const [openFaq, setOpenFaq] = useState(0);
  const [dynamicServices, setDynamicServices] = useState([]);
  const location = useLocation();

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

            {/* Mobile-only*/}
            <div className="sm:hidden -mx-5 px-5">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-[#3B82F6]"></span>
                Other Services
              </h3>
              <div
                className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {dynamicServices.length > 0 ? (
                  dynamicServices.map((service) => {
                    const isActive = location.pathname === service.fullPath;
                    return (
                      <Link
                        to={service.fullPath}
                        key={service.id}
                        className={`shrink-0 snap-start whitespace-nowrap capitalize text-[13.5px] font-semibold px-4 py-2 rounded-full border transition-colors ${
                          isActive
                            ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm shadow-blue-200'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {service.title}
                      </Link>
                    );
                  })
                ) : (
                  <span className="text-sm text-gray-400 italic py-2">Loading services...</span>
                )}
              </div>
            </div>

            {/*  original card list */}
            <div className="hidden sm:block w-full md:w-1/2 lg:w-full bg-white rounded-[24px] pt-10 pb-10 lg:pt-15 lg:pb-15 shadow-sm border border-gray-100/50">
              <h3 className="text-3xl lg:text-[32px] font-bold text-gray-900 mb-8 text-center px-4">
                  Other Services
              </h3>
              <div className="flex flex-col px-8 lg:px-10">
                {dynamicServices.length > 0 ? (
                  dynamicServices.map((service, index) => {
                    const isActive = location.pathname === service.fullPath;
                    const isLast = index === dynamicServices.length - 1;

                    return (
                      <Link
                        to={service.fullPath}
                        key={service.id}
                        className={`group flex items-center justify-between py-[16px] lg:py-[20px] cursor-pointer transition-colors border-t ${
                            isActive ? 'border-t-[2px] border-[#3B82F6]' : 'border-t border-gray-200'
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
                  <p className="text-sm text-gray-400 text-center italic">No other services found.</p>
                )}
              </div>
            </div>

            {/* Mobile-only */}
            <div className="sm:hidden relative w-full h-[190px] rounded-2xl overflow-hidden">
              <img
                src={resolveAssetUrl(sidebarImage, '/default-sidebar.png')}
                alt="Sidebar Image"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <span className="absolute bottom-3 left-4 right-4 text-white text-[14px] font-semibold">
                Need Design Help?
              </span>
            </div>

            {/* original sidebar image */}
            <div className="hidden sm:block relative w-full md:w-1/2 lg:w-full h-[320px] md:h-auto lg:h-[450px] xl:h-[600px] rounded-[24px] overflow-hidden group">
              <img 
                src={resolveAssetUrl(sidebarImage, '/default-sidebar.png')} 
                alt="Sidebar Image" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-[68%] flex flex-col">
            {/* Main Image */}
            <div className="hidden md:block w-full h-[320px] lg:h-[500px] rounded-[24px] lg:rounded-[32px] overflow-hidden mb-8 lg:mb-10">
              <img 
                src={resolveAssetUrl(mainImage, '/default-main.png')} 
                alt="Service Main" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pr-0 lg:pr-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                {aboutTitle || 'About The Service'}
              </h1>
              
              <div 
                className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10 whitespace-pre-line prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: aboutDescription }}
              />

              {/* Mobile-only*/}
              <div className="sm:hidden -mx-5 px-5 mb-10">
                <div
                  className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {features.map((item, index) => (
                    <div key={index} className="shrink-0 w-[72%] snap-center bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="w-12 h-12 rounded-full bg-[#198CF4] flex items-center justify-center mb-4">
                        <img src={disruptiveInnovation} alt={item.title} className="w-6 h-6 object-contain"/>
                      </div>
                      <h3 className="text-[16px] font-bold text-[#222] leading-tight mb-1">{item.title}</h3>
                      <p className="text-[13px] font-medium leading-[19px] text-[#555] whitespace-pre-line">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 mb-14">
                {features.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#198CF4] flex items-center justify-center shrink-0">
                      <img src={disruptiveInnovation} alt={item.title} className="w-8 h-8 object-contain"/>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-[20px] font-bold text-[#222] leading-tight">{item.title}</h3>
                      <p className="text-[13px] font-semibold leading-[20px] text-[#444] max-w-[230px] whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={resolveAssetUrl(midImage1, '/default-mid1.png')} alt="Detail 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="hidden md:block h-[280px] rounded-[24px] overflow-hidden">
                  <img src={resolveAssetUrl(midImage2, '/default-mid2.png')} alt="Detail 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                {typesTitle || 'Types Of Commercial Spaces'}
              </h1>
              <div className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10 whitespace-pre-line prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: typesDescription }} />

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                {elementsTitle || 'Key Elements Of Interior Design'}
              </h1>
              <div className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10 whitespace-pre-line prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: elementsDescription }} />

              {/* Mobile-only*/}
              <div className="sm:hidden bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 mb-6 overflow-hidden">
                {[...leftBullets, ...rightBullets].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-6 h-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#3B82F6]" strokeWidth={3} />
                    </div>
                    <span className="text-gray-800 text-[14px] leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                <div className="flex flex-col space-y-5">
                  {leftBullets.map((item, idx) => (
                    <div key={`left-${idx}`} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0"></div>
                      <span className="text-gray-900 text-[16px]">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col space-y-5">
                  {rightBullets.map((item, idx) => (
                    <div key={`right-${idx}`} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0"></div>
                      <span className="text-gray-900 text-[16px]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-gray-600 text-[15px] sm:text-[16px] leading-6 sm:leading-7 mb-8 sm:mb-10 whitespace-pre-line prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: footerDescription }} />

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Frequently Asked Questions</h3>

                {/* Mobile-only*/}
                <div className="sm:hidden flex flex-col gap-3">
                  {faqs.map((faqItem, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="text-[15px] font-bold text-gray-900 whitespace-pre-line">{faqItem.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#3B82F6] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            strokeWidth={2.5}
                          />
                        </button>
                        {faqItem.answer && (
                          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                              <p className="px-4 pb-4 text-[13.5px] leading-6 text-gray-600 whitespace-pre-line">{faqItem.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="hidden sm:flex sm:flex-col border-t border-gray-500">
                  {faqs.map((faqItem, index) => (
                    <div key={index} className="border-b border-gray-500 bg-transparent flex items-center justify-between py-3 md:py-5">
                      <span className="text-[18px] md:text-[20px] font-bold text-gray-900 whitespace-pre-line">{faqItem.question}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsBlock;