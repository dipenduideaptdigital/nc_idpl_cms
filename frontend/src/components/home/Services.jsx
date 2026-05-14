import React from 'react';

const servicesData = [
  {
    title: 'Architectural\nDesign',
    description: 'A business house born out of passion for fish keeping and nature conservation'
  },
  {
    title: 'Interior Design\n& Planning',
    description: 'A business house born out of passion for fish keeping and nature conservation'
  },
  {
    title: 'Consulting\nServices',
    description: 'A business house born out of passion for fish keeping and nature conservation'
  },
  {
    title: 'Project\nManagement',
    description: 'A business house born out of passion for fish keeping and nature conservation'
  }
];

const Services = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mb-20 items-start">
          {/* Left: Badge */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                WHO WE ARE
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="fadeInRight">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Experience <span className="text-primary">The Art Of Interior</span> Design
            </h2>
            <p className="text-gray-500 max-w-2xl font-light text-sm leading-relaxed">
              If you use this site regularly and would like consider donating a small sum to help pay for the hosting and bandwidth bill. There is no minimum donation, any sum is appreciated
            </p>
          </div>
        </div>

        {/* Bottom Section: Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <div 
              key={index} 
              className="border border-gray-300 rounded-[2rem] p-8 hover:shadow-xl transition-shadow duration-300 bg-white opal-move-up"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 whitespace-pre-line leading-tight">
                {service.title}
              </h3>
              
              <div className="w-full h-[1px] bg-gray-300 mb-6"></div>
              
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
