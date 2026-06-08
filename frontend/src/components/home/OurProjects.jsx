import React, { useState, useEffect, useRef } from 'react';
import project1 from '../../assets/homepage/project1.png';
import project2 from '../../assets/homepage/project2.png';
import project3 from '../../assets/homepage/project3.png';
import project4 from '../../assets/homepage/project4.png';
import project5 from '../../assets/homepage/project5.png';
import defaultInterior from '../../assets/homepage/interior.png';
import apiClient from '../../api/client';

const defaultProjectsData = [
  { id: 1, category: 'LANDSCAPE', title: 'Art Deco Revival', description: 'Improving homes with expert craftsmanship for years', image: project1 },
  { id: 2, category: 'RESIDENTIAL', title: 'Modern Minimalist', description: 'Improving homes with expert craftsmanship for years', image: project2 },
  { id: 3, category: 'SINGLE HOME', title: 'Urban Oasis', description: 'Improving homes with expert craftsmanship for years', image: project3 },
  { id: 4, category: 'OFFICE AREA', title: 'Corporate Elegance', description: 'Improving homes with expert craftsmanship for years', image: project4 },
  { id: 5, category: 'COMMERCIAL', title: 'Retail Experience', description: 'Improving homes with expert craftsmanship for years', image: project5 }
];

const OurProjects = ({ data: externalData }) => {
  const carouselRef = useRef(null);
  const [content, setContent] = useState(externalData || null);
  const [projectsList, setProjectsList] = useState(defaultProjectsData);
  const [interiorImg, setInteriorImg] = useState(defaultInterior);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

      // Resolve project images
      if (fetchedContent.projects && fetchedContent.projects.length > 0) {
        const mapped = fetchedContent.projects.map((p, idx) => {
          const defaultImg = defaultProjectsData[idx % defaultProjectsData.length].image;
          return {
            ...p,
            image: p.image ? (p.image.startsWith('http') ? p.image : `${serverUrl}${p.image}`) : defaultImg
          };
        });
        if (isMounted) setProjectsList(mapped);
      } else if (isMounted) {
        setProjectsList(defaultProjectsData);
      }

      // Resolve bottom graphic image
      if (fetchedContent.bottomImage) {
        const botUrl = fetchedContent.bottomImage.startsWith('http') ? fetchedContent.bottomImage : `${serverUrl}${fetchedContent.bottomImage}`;
        const img = new Image();
        img.src = botUrl;
        img.onload = () => { if (isMounted) setInteriorImg(botUrl); };
        img.onerror = () => { if (isMounted) setInteriorImg(defaultInterior); };
      } else if (isMounted) {
        setInteriorImg(defaultInterior);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchProjectsData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_our_projects');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch our projects content:', error);
      }
    };

    fetchProjectsData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "OUR PROJECT";
  const title = content?.title || "Creative [Projects That Define] Our Style";
  const description = content?.description || "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors.";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
          
          <div className="max-w-2xl fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              {renderTitle(title)}
            </h2>
          </div>
          
          <div className="max-w-md pb-2 fadeInRight">
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Carousel Section */}
        <div 
          className="flex overflow-x-auto gap-8 pb-16 snap-x snap-mandatory hide-scrollbar opal-move-up"
          ref={carouselRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projectsList.map((project, index) => {
            const isEven = index % 2 === 0;
            const marginTopClass = isEven ? 'mt-12 md:mt-24' : 'mt-0';

            return (
              <div 
                key={project.id || index} 
                className={`min-w-[320px] md:min-w-[380px] snap-center flex flex-col ${marginTopClass} transition-all duration-300 hover:-translate-y-2`}
              >
                {/* Image Card */}
                <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-8 shadow-lg group">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const defaultImg = defaultProjectsData[index % defaultProjectsData.length].image;
                      if (e.currentTarget.src !== defaultImg) {
                        e.currentTarget.src = defaultImg;
                      }
                    }}
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
      <div className="relative w-full mt-24 pt-20 pb-16 flex flex-col items-center justify-end min-h-[400px] opal-move-up">
        {/* Huge Background Typography */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden flex justify-center pointer-events-none z-0">
          <h2 className="text-[22vw] font-black text-gray-100 leading-none select-none">
            Interior
          </h2>
        </div>

        {/* Foreground Image */}
        <div className="container mx-auto px-8 md:px-28 relative z-10">
          <img 
            src={interiorImg} 
            alt="Interior Panoramic" 
            className="w-full object-contain max-h-[400px]"
            onError={(e) => {
              if (e.currentTarget.src !== defaultInterior) {
                e.currentTarget.src = defaultInterior;
              }
            }}
          />
        </div>
      </div>

    </section>
  );
};

export default OurProjects;