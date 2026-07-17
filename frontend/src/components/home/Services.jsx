import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const defaultServicesData = [
  {
    title: 'Architectural\nDesign',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  },
  {
    title: 'Interior Design\n& Planning',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  },
  {
    title: 'Consulting\nServices',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  },
  {
    title: 'Project\nManagement',
    description: '<p>A business house born out of passion for fish keeping and nature conservation</p>'
  }
];

const Services = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);

  useEffect(() => {
    if (externalData) {
      setContent(externalData);
      return;
    }
    const fetchServicesData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_services');
        const { data } = res;
        
        if (data.success && data.data?.content) {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch services content:', error);
      }
    };
    fetchServicesData();
  }, [externalData]);

  const badgeText = content?.badgeText || "WHO WE ARE";
  const title = content?.title || "Experience [The Art Of Interior] Design";
  const description = content?.description || "<p>If you use this site regularly and would like consider donating a small sum to help pay for the hosting and bandwidth bill. There is no minimum donation, any sum is appreciated</p>";
  const servicesList = content?.services || defaultServicesData;

  return (
    <section id="services-section" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Top Section */}
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
            <div 
              className="text-gray-500 max-w-2xl font-light text-sm md:text-base leading-relaxed prose prose-sm sm:prose-base max-w-none prose-p:my-2 prose-a:text-blue-500 hover:prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        {/* Bottom Section: Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className="group border border-gray-200 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-8 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 transform transition-all duration-500 bg-white opal-move-up flex flex-col justify-between"
            >
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full mb-2">
                <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 text-center whitespace-pre-line leading-tight group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
              </div>
              
              <div className="w-full h-[1px] bg-gray-300 mb-2"></div>
              
              <div 
                className="text-gray-400 text-[11px] sm:text-xs md:text-sm font-light leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-a:text-blue-500 hover:prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Helper component or function to render title with primary colored text inside square brackets [like this]
const renderTitle = (titleText) => {
  if (!titleText) return null;
  const parts = titleText.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={index} className="text-primary">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

export default Services;