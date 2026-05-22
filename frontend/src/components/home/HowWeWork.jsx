import React from 'react';

const stepsData = [
  {
    id: '01',
    title: 'Initial Consultation',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    imagePlaceholder: 'bg-blue-500',
    marginTop: 'mt-0',
  },
  {
    id: '02',
    title: 'Design & Planning',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    imagePlaceholder: 'bg-blue-500',
    marginTop: 'mt-12 md:mt-16',
  },
  {
    id: '03',
    title: 'Implementation',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    imagePlaceholder: 'bg-blue-500',
    marginTop: 'mt-24 md:mt-32',
  },
  {
    id: '04',
    title: 'Project Handover',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
    imagePlaceholder: 'bg-blue-500',
    marginTop: 'mt-36 md:mt-48',
  },
];

const HowWeWork = () => {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-20 items-end">
          {/* Left: Badge & Heading */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8 bg-white">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                HOW WE WORK
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Description <span className="text-primary">Architecture Process</span> For Exceptional Results.
            </h2>
          </div>
          
          {/* Right: Description Text */}
          <div className="pb-2 fadeInRight">
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-md">
              Our process is alive – adapting, refining, and growing with your vision. Always.
              Like artists with a blank canvas, we transform rooms into living works of art.
            </p>
          </div>
        </div>

        {/* Staggered Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stepsData.map((step) => (
            <div 
              key={step.id} 
              className={`bg-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col ${step.marginTop} opal-move-up`}
            >
              {/* Image Placeholder */}
              <div className={`w-full h-48 rounded-2xl ${step.imagePlaceholder} mb-8`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {step.id}. {step.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[90%] pb-12">
                  {step.description}
                </p>
              </div>

              {/* Large Faint Number Background */}
              <div className="absolute -bottom-4 right-2 text-8xl font-bold text-gray-100/70 z-0 select-none">
                {step.id}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-gray-900 font-medium">
            We've Been Working Hard To Impress You. <a href="#" className="text-primary hover:underline">Start Your's Today</a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowWeWork;