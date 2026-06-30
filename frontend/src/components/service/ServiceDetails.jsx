import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Phone, Plus, Minus, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Images based on your mapping
import service1 from '../../assets/service/Service1.png'; // Main right image
import service2 from '../../assets/service/Service2.png'; // Left sidebar promo image
import service3 from '../../assets/service/Service3.png'; // Small image 1
import service4 from '../../assets/service/Service4.png'; // Small image 2

const SERVICES_LIST = [
  { name: 'Interior 2D/3D Layouts', path: '/services/residential', active: false },
  { name: 'Renovation And Remodelling', path: '/services/commercial', active: true },
  { name: 'Outdoor & Landscape Design', path: '/services/hospitality', active: false },
  { name: 'Interior Design Consultation', path: '/services/workspace', active: false },
  { name: 'Commercial Interior Design', path: '/services/furniture', active: false },
  { name: 'Residential Interior Design', path: '/services/residence', active: false },
];

const SPACES_TYPES = [
  "Corporate Offices & Headquarters",
  "Retail Stores & Showrooms",
  "Restaurants & Cafes",
  "Hotels & Resorts",
  "Healthcare Facilities",
  "Educational Institutions"
];

const FAQS = [
  "How long does a commercial interior project take?",
  "Do you provide custom furniture for commercial spaces?",
  "Will interior design work disrupt my business operations?",
  "What is the standard payment structure for the project?" 
];

const ServiceDetails = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F8F9FA] font-helvetica">
      <div className="container mx-auto max-w-[1400px] px-6 lg:px-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          <div className="w-full lg:w-[32%] flex flex-col space-y-10 shrink-0">
            
            <div className="bg-white rounded-[24px] pt-8 pb-4">
                <h3 className="text-3xl lg:text-[32px] font-bold text-gray-900 mb-8 text-center px-4">
                    Other Services
                </h3>
                
                <div className="flex flex-col px-10">
                    {SERVICES_LIST.map((service, index) => {
                    const isActive = service.active;
                    const isLast = index === SERVICES_LIST.length - 1;

                    return (
                        <Link
                        to={service.path}
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

            <div className="relative w-full h-[400px] rounded-[24px] overflow-hidden group">
              <img 
                src={service2} 
                alt="Need Design Help" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/20"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white text-center">
                <div className="w-14 h-14 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Need Interior Help?</h4>
                <p className="text-gray-300 text-sm mb-6">Talk to our experts and get a free consultation today.</p>
                <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-100 transition-colors">
                  Contact Us <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>


          {/* ===============
              RIGHT CONTENT 
          =================== */}
          <div className="w-full lg:w-[68%] flex flex-col">
            
            <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden mb-10">
              <img 
                src={service1} 
                alt="Commercial Interior Design" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pr-0 lg:pr-8">
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                Commercial Interior Design
              </h2>
              <p className="text-gray-600 leading-relaxed text-[17px] mb-10">
                Commercial interior design focuses on creating professional spaces that are both highly functional and aesthetically inspiring. Whether it is an office, a retail store, or a hospitality venue, the environment must reflect the brand's identity while optimizing workflow, productivity, and customer experience.
              </p>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">About The Service</h3>
              <p className="text-gray-600 leading-relaxed text-[17px] mb-10">
                Our commercial interior design services are tailored to meet the unique demands of businesses. We blend strategic space planning with innovative design elements to craft environments that stir creativity, evoke emotion, and drive success. From conceptualization to final execution, we manage every detail meticulously.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={service3} alt="Service detail 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={service4} alt="Service detail 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Types of Commercial Spaces</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                {SPACES_TYPES.map((type, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3B82F6] shrink-0" />
                    <span className="text-gray-700 font-medium text-[16px]">{type}</span>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Frequently Asked Questions
                </h3>
                
                <div className="flex flex-col border-t border-gray-200">
                  {FAQS.map((question, index) => (
                    <div 
                      key={index} 
                      className="border-b border-gray-200 bg-transparent flex items-center justify-between py-3 md:py-5"
                    >
                      <span className="text-[18px] md:text-[20px] font-bold text-gray-900">
                        {question}
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

export default ServiceDetails;