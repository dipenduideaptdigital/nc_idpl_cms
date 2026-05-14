import React, { useRef } from 'react';
import project1 from '../../assets/homepage/project1.png'
import project2 from '../../assets/homepage/project2.png'
import project3 from '../../assets/homepage/project3.png'
import project4 from '../../assets/homepage/project4.png'
import project5 from '../../assets/homepage/project5.png'
import interior from '../../assets/homepage/interior.png'
const projectsData = [
  {
    id: 1,
    category: 'LANDSCAPE',
    title: 'Art Deco Revival',
    description: 'Improving homes with expert craftsmanship for years',
    image: project1,
  },
  {
    id: 2,
    category: 'RESIDENTIAL',
    title: 'Modern Minimalist',
    description: 'Improving homes with expert craftsmanship for years',
    image: project2,
  },
  {
    id: 3,
    category: 'SINGLE HOME',
    title: 'Urban Oasis',
    description: 'Improving homes with expert craftsmanship for years',
    image: project3,
  },
  {
    id: 4,
    category: 'OFFICE AREA',
    title: 'Corporate Elegance',
    description: 'Improving homes with expert craftsmanship for years',
    image: project4,
  },
  {
    id: 5,
    category: 'COMMERCIAL',
    title: 'Retail Experience',
    description: 'Improving homes with expert craftsmanship for years',
    image: project5,
  }
];

const OurProjects = () => {
  const carouselRef = useRef(null);

  // Optional: Add drag to scroll functionality if needed, 
  // but standard overflow-x-auto works well for simple swiping on mobile/trackpads.

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                OUR PROJECT
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Creative <span className="text-primary">Projects That Define</span> Our Style
            </h2>
          </div>
          
          <div className="max-w-md pb-2">
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors.
            </p>
          </div>
        </div>

        {/* Carousel Section */}
        <div 
          className="flex overflow-x-auto gap-8 pb-16 snap-x snap-mandatory hide-scrollbar"
          ref={carouselRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projectsData.map((project, index) => {
            // Staggering effect: alternating margin top
            const isEven = index % 2 === 0;
            const marginTopClass = isEven ? 'mt-24' : 'mt-0';

            return (
              <div 
                key={project.id} 
                className={`min-w-[320px] md:min-w-[380px] snap-center flex flex-col ${marginTopClass} transition-all duration-300 hover:-translate-y-2`}
              >
                {/* Image Card */}
                <div className="relative w-full h-[500px] rounded-[2.5rem] overflow-hidden mb-8 shadow-lg">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white text-[10px] tracking-widest uppercase shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Text */}
                <div className="px-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Section: Typography & Image */}
      <div className="relative w-full mt-24 pt-20 pb-16 flex flex-col items-center justify-end min-h-[400px]">
        {/* Huge Background Typography */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden flex justify-center pointer-events-none z-0">
          <h2 className="text-[22vw] font-black text-gray-100 leading-none select-none">
            Interior
          </h2>
        </div>

        {/* Foreground Image */}
        <div className="container mx-auto px-28 relative z-10">
          <img 
            src={interior} 
            alt="Interior Panoramic" 
            className="w-full object-contain max-h-[400px]"
          />
        </div>
      </div>

    </section>
  );
};

export default OurProjects;
