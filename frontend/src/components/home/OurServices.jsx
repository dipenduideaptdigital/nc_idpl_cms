import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import service from '../../assets/homepage/service.png'
import counting from '../../assets/homepage/counting.png'
const servicesList = [
  { id: '01', title: 'Residential Interior Design' },
  { id: '02', title: 'Outdoor & Landscape Design' },
  { id: '03', title: 'Interior Design Consultation' },
  { id: '04', title: 'Commercial Interior Design' },
  { id: '05', title: 'Renovation And Remodeling' },
  { id: '06', title: 'Interior 2D/3D Layouts' },
];

const statsData = [
  { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
  { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
  { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
  { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' },
];

const OurServices = () => {
  const [activeService, setActiveService] = useState('01');

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mb-20 items-start">
          {/* Left: Badge */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                OUR SERVICES
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="fadeInRight">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Explore Our <span className="text-primary">Comprehensive Interior Design</span> Services
            </h2>
            <p className="text-gray-500 max-w-3xl font-light text-sm leading-relaxed">
              We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.
            </p>
          </div>
        </div>

        {/* Middle Section: Image & Services List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          
          {/* Left: Image with Overlay */}
          <div className="relative rounded-[2rem] overflow-hidden h-[500px] shadow-2xl fadeInLeft">
            <img 
              src={service} 
              alt="Interior Design Service" 
              className="w-full h-full object-cover"
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
            {servicesList.map((service) => {
              const isActive = activeService === service.id;
              
              return (
                <div 
                  key={service.id}
                  className="group flex items-center justify-between py-6 border-b border-gray-200 cursor-pointer"
                  onMouseEnter={() => setActiveService(service.id)}
                >
                  <div className="flex items-center space-x-8">
                    <span className="text-lg font-medium text-gray-600 w-6">
                      {service.id}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32 text-center">
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
          {/* Using an architectural 3D rendering image from Unsplash as placeholder */}
          <img 
            src={counting}
            alt="3D Floor Plan Rendering" 
            className="w-full max-w-5xl rounded-3xl object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default OurServices;