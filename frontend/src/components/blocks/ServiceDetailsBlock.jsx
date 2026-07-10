import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import disruptiveInnovation from '../../assets/service/disruptive-innovation.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ServiceDetailsBlock = ({
  sidebarServices = [],
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

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FA] font-helvetica">
      <div className="container mx-auto max-w-[1400px] px-6 lg:px-10">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar / Top Section on Mobile */}
          <div className="w-full lg:w-[32%] flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8 lg:space-y-10 lg:gap-0 shrink-0">
            <div className="w-full sm:w-1/2 lg:w-full bg-white rounded-[24px] pt-10 pb-10 lg:pt-15 lg:pb-15 shadow-sm border border-gray-100/50">
              <h3 className="text-3xl lg:text-[32px] font-bold text-gray-900 mb-8 text-center px-4">
                  Other Services
              </h3>
              <div className="flex flex-col px-10">
                {sidebarServices.map((service, index) => {
                  const isActive = service.active;
                  const isLast = index === sidebarServices.length - 1;

                  return (
                    <Link
                      to={service.path || '#'}
                      key={index}
                      className={`group flex items-center justify-between py-[16px] lg:py-[20px] cursor-pointer transition-colors border-t ${
                          isActive ? 'border-t-[2px] border-[#3B82F6]' : 'border-t border-gray-200'
                      } ${isLast ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="flex items-center space-x-4 md:space-x-5 transform group-hover:translate-x-2 transition-transform duration-300 pr-4 pl-4 lg:pl-6">
                        <span className={`text-[17px] lg:text-[19px] font-base leading-[1.2] capitalize font-helvetica transition-colors ${isActive ? 'text-[#3B82F6]' : 'text-gray-900 group-hover:text-[#3B82F6]'}`}>
                          {service.name}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="relative w-full sm:w-1/2 lg:w-full h-[300px] sm:h-auto lg:h-[450px] xl:h-[600px] rounded-[24px] overflow-hidden group">
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
            <div className="hidden lg:block w-full h-[500px] rounded-[32px] overflow-hidden mb-10">
              <img 
                src={resolveAssetUrl(mainImage, '/default-main.png')} 
                alt="Service Main" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pr-0 lg:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                {aboutTitle || 'About The Service'}
              </h1>
              
              <p className="text-gray-600 text-[16px] leading-7 mb-10 whitespace-pre-line">
                {aboutDescription}
              </p>

              <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:gap-x-10 mb-14">
                {features.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#198CF4] flex items-center justify-center shrink-0">
                      <img
                        src={disruptiveInnovation} 
                        alt={item.title}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-[20px] font-bold text-[#222] leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[13px] font-semibold leading-[20px] text-[#444] max-w-[230px] whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img
                    src={resolveAssetUrl(midImage1, '/default-mid1.png')} 
                    alt="Detail 1" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="hidden md:block h-[280px] rounded-[24px] overflow-hidden">
                  <img
                    src={resolveAssetUrl(midImage2, '/default-mid2.png')} 
                    alt="Detail 2" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                {typesTitle || 'Types Of Commercial Spaces'}
              </h1>
              <p className="text-gray-600 text-[16px] leading-7 mb-10 whitespace-pre-line">
                {typesDescription}
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                {elementsTitle || 'Key Elements Of Interior Design'}
              </h1>
              <p className="text-gray-600 text-[16px] leading-7 mb-10 whitespace-pre-line">
                {elementsDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
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

              <p className="text-gray-600 text-[16px] leading-7 mb-10 whitespace-pre-line">
                {footerDescription}
              </p>

              <div className="mt-8 pt-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Frequently Asked Questions
                </h3>
                <div className="flex flex-col border-t border-gray-500">
                  {faqs.map((faqItem, index) => (
                    <div 
                      key={index} 
                      className="border-b border-gray-500 bg-transparent flex items-center justify-between py-3 md:py-5"
                    >
                      <span className="text-[18px] md:text-[20px] font-bold text-gray-900 whitespace-pre-line">
                        {faqItem.question}
                      </span>
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