import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Phone, Plus, Minus, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import service1 from '../../assets/service/Service1.png'; 
import service2 from '../../assets/service/Service2.png'; 
import disruptiveInnovation from '../../assets/service/disruptive-innovation.png';
import service3 from '../../assets/service/Service3.png'; 
import service4 from '../../assets/service/Service4.png'; 

const SERVICES_LIST = [
  { name: 'Interior 2D/3D Layouts', path: '/services/residential', active: false },
  { name: 'Renovation And Remodelling', path: '/services/commercial', active: true },
  { name: 'Outdoor & Landscape Design', path: '/services/hospitality', active: false },
  { name: 'Interior Design Consultation', path: '/services/workspace', active: false },
  { name: 'Commercial Interior Design', path: '/services/furniture', active: false },
  { name: 'Residential Interior Design', path: '/services/residence', active: false },
];

const FEATURES = [
  {
    title: "Space Optimization",
    description:
      "Through The Best Smart Space Optimisation Interior Design.",
  },
  {
    title: "Space Optimization",
    description:
      "Through The Best Smart Space Optimisation Interior Design.",
  },
  {
    title: "Space Optimization",
    description:
      "Through The Best Smart Space Optimisation Interior Design.",
  },
  {
    title: "Space Optimization",
    description:
      "Through The Best Smart Space Optimisation Interior Design.",
  },
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
            
            <div className="bg-white rounded-[24px] pt-15 pb-15">
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

            <div className="relative w-full h-screen rounded-[24px] overflow-hidden group">
              <img 
                src={service2} 
                alt="Need Design Help" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

          </div>

          {/* Right Content*/}
          <div className="w-full lg:w-[68%] flex flex-col">
            
            <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden mb-10">
              <img 
                src={service1} 
                alt="Commercial Interior Design" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pr-0 lg:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                About The Service
              </h1>
              <p className="text-gray-600 text-[16px] leading-7 mb-10">
                Commercial interior design is constantly evolving, with a new trends emerging to meet the changing to needs and preferences of the businesses and their customers. One of the most significant trends in that's recent years is biophilic design, which involves incorporating natural elements like plants, wood, and stone into the design.
                <br />
                <br />
                A growing demand for adaptable layouts that can accommodate changing needs. This might include modular movable partitions. Sustainability is alsokey trend in commercial interior design.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 mb-14">
                {FEATURES.map((item, index) => (
                  <div className="flex items-center gap-4">

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

                      <p className="text-[13px] font-semibold leading-[20px] text-[#444] max-w-[230px]">
                        {item.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={service3} alt="Service detail 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="h-[280px] rounded-[24px] overflow-hidden">
                  <img src={service4} alt="Service detail 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                Types Of Commercial Spaces
              </h1>
              <p className="text-gray-600 text-[16px] leading-7 mb-10">
                In design, we bring characteristics of the natural world into built spaces, such as water, greenery, and natural light, or elements like wood and stone. Encouraging the use of natural systems and processes in design allows for exposure to nature, and in turn, these design approaches improve health and wellbeing. There are a number of possible benefits, including reduced heart rate variability and pulse rates, decreased blood pressure, and increased activity in our nervous systems, to name a few.
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2 tracking-tight leading-tight">
                Key Elements Of Interior Design
              </h1>
              <p className="text-gray-600 leading-relaxed text-[17px] mb-8">
                Several key elements are essential to successful commercial interior design. These include space planning, lighting design, material selection, furniture and fixtures, color and texture, technology integration, and acoustics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                {/* Left Column */}
                <div className="flex flex-col space-y-5">
                  {[
                    "We provide high quality design services.",
                    "Project on time and Latest Design.",
                    "Scientific Skills For getting a better result.",
                    "Renovations Benefit of Service"
                  ].map((item, idx) => (
                    <div key={`left-${idx}`} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0"></div>
                      <span className="text-gray-900 text-[16px]">{item}</span>
                    </div>
                  ))}
                </div>
                {/* Right Column */}
                <div className="flex flex-col space-y-5">
                  {[
                    "Flexible with any structure of the building",
                    "Commitment to customer service",
                    "Experienced, time-served engineers",
                    "We are confident about our projects."
                  ].map((item, idx) => (
                    <div key={`right-${idx}`} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0"></div>
                      <span className="text-gray-900 text-[16px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-[17px] mb-12">
                Commercial interior design is a dynamic and multifaceted field that plays a critical role in the success of businesses across a wide range of industries. By blending creativity with practicality, commercial interior design
              </p>
              

              <div className="mt-8 pt-10">
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