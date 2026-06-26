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
  
  // Mouse Drag States
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

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

  const infiniteProjects = [
    ...projectsList, ...projectsList, ...projectsList, 
    ...projectsList, ...projectsList, ...projectsList, ...projectsList
  ];

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = carouselRef.current.scrollWidth / 3;
    }
  }, [projectsList]);

  useEffect(() => {
    if (isDragging) return; 

    const autoScrollInterval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(autoScrollInterval);
  }, [isDragging]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      carouselRef.current.scrollLeft = scrollLeft - (scrollWidth / 3);
    }

    if (scrollLeft <= 100) {
      carouselRef.current.scrollLeft = scrollLeft + (scrollWidth / 3);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftPos(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    carouselRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const badgeText = content?.badgeText || "OUR PROJECT";
  const title = content?.title || "Creative [Projects That \\n Define] Our Style";
  const description = content?.description || "Our portfolio showcases a diverse range of projects, from beautifully crafted \n residential spaces functional and stylish commercial interiors";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#3B82F6]">
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
    <section className="pt-16 md:pt-24 bg-white overflow-hidden">
      
      {/* Top Header Section */}
      <div className="w-full relative mb-16 md:mb-24 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl relative">
          
          {/* Badge: Absolute to left */}
          <div className="md:absolute left-0 top-0 mb-8 md:mb-0 fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-start w-fit fadeInRight md:pl-32 lg:pl-0">
              <h2 className="text-4xl md:text-5xl lg:text-[64px] font-bold tracking-tight text-gray-900 leading-[1.05] text-left">
                {renderTitle(title)}
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-normal leading-relaxed max-w-[550px] text-left mt-6 whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Carousel Section */}
      <div 
        className={`flex w-full overflow-x-auto hide-scrollbar opal-move-up select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={carouselRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 md:gap-10 px-0 pb-12 items-start shrink-0">
          {infiniteProjects.map((project, index) => {
            const originalIndex = index % 5; 
            const isEven = originalIndex % 2 === 0;
            const marginTopClass = isEven ? 'mt-0' : 'mt-16 md:mt-24';

            return (
              <div 
                key={`${project.id}-${index}`} 
                className={`w-[250px] md:w-[320px] lg:w-[360px] shrink-0 flex flex-col ${marginTopClass}`}
              >
                {/* Image Card */}
                <div className="relative w-full h-[380px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group bg-zinc-100 pointer-events-none">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const defaultImg = defaultProjectsData[originalIndex].image;
                      if (e.currentTarget.src !== defaultImg) {
                        e.currentTarget.src = defaultImg;
                      }
                    }}
                  />
                  {/* Category Pill */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <span className="px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-[10px] tracking-widest uppercase shadow-sm whitespace-nowrap">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Text */}
                <div className="px-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Typography & Image */}
      <div className="relative w-full mt-24 pt-24 md:pt-36 pb-16 flex flex-col items-center justify-end min-h-[400px] opal-move-up">
        
        <div className="absolute -top-10 md:-top-20 left-0 right-0 overflow-hidden flex justify-center pointer-events-none z-0">
          <h2 className="text-[25vw] md:text-[22vw] font-black text-[#F3F4F6] leading-none select-none">
            Interior
          </h2>
        </div>

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