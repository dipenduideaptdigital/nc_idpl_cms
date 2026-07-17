import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pagesApi } from '../../api/pages'; // 👉 API import kora holo
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
  const [dynamicServices, setDynamicServices] = useState([]); // 👉 State setup
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
    <section className="py-20 lg:py-28 bg-[#F8F9FA] font-helvetica">
      <div className="container mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-[32%] flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8 lg:space-y-10 lg:gap-0 shrink-0">
            <div className="w-full sm:w-1/2 lg:w-full bg-white rounded-[24px] pt-10 pb-10 lg:pt-15 lg:pb-15 shadow-sm border border-gray-100/50">
                <h3 className="text-3xl lg:text-[32px] font-bold text-gray-900 mb-8 text-center px-4">
                    Other Services
                </h3>
                
                <div className="flex flex-col px-10">
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
                      <p className="text-sm text-gray-400 text-center italic">Loading services...</p>
                    )}
                </div>
            </div>

            <div className="relative w-full sm:w-1/2 lg:w-full h-[300px] sm:h-auto lg:h-[450px] xl:h-[600px] rounded-[24px] overflow-hidden group">
              <img src={service2} alt="Need Design Help" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Right Content (Static Fallback Details) */}
          <div className="w-full lg:w-[68%] flex flex-col">
            <div className="hidden lg:block w-full h-[500px] rounded-[32px] overflow-hidden mb-10">
              <img src={service1} alt="Commercial Interior Design" className="w-full h-full object-cover" />
            </div>

            <div className="pr-0 lg:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                About The Service
              </h1>
              <p className="text-gray-600 text-[16px] leading-7 mb-10">
                Commercial interior design is constantly evolving, with a new trends emerging to meet the changing to needs and preferences of the businesses and their customers. One of the most significant trends in that's recent years is biophilic design, which involves incorporating natural elements like plants, wood, and stone into the design.
                <br /><br />
                A growing demand for adaptable layouts that can accommodate changing needs. This might include modular movable partitions. Sustainability is alsokey trend in commercial interior design.
              </p>

              <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:gap-x-10 mb-14">
                {FEATURES.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#198CF4] flex items-center justify-center shrink-0">
                      <img src={disruptiveInnovation} alt={item.title} className="w-8 h-8 object-contain"/>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-[20px] font-bold text-[#222] leading-tight">{item.title}</h3>
                      <p className="text-[13px] font-semibold leading-[20px] text-[#444] max-w-[230px]">{item.description}</p>
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