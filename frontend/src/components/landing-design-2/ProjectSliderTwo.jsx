import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img1 from '../../assets/homepage/project1.png';
import img2 from '../../assets/homepage/project3.png';
import img3 from '../../assets/homepage/project4.png';
import img4 from '../../assets/homepage/project5.png';
import img5 from '../../assets/homepage/gallery3.png';
import img6 from '../../assets/homepage/gallery5.png';

const getAssetUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const ProjectSliderTwo = ({ data }) => {
  const containerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const resolvedImg1 = data?.projects?.[0]?.image ? getAssetUrl(data.projects[0].image, img1) : img1;
  const resolvedImg2 = data?.projects?.[1]?.image ? getAssetUrl(data.projects[1].image, img2) : img2;
  const resolvedImg3 = data?.projects?.[2]?.image ? getAssetUrl(data.projects[2].image, img3) : img3;
  const resolvedImg4 = data?.projects?.[3]?.image ? getAssetUrl(data.projects[3].image, img4) : img4;
  const resolvedImg5 = data?.projects?.[4]?.image ? getAssetUrl(data.projects[4].image, img5) : img5;
  const resolvedImg6 = data?.projects?.[5]?.image ? getAssetUrl(data.projects[5].image, img6) : img6;

  const projects = [
    {
      title: data?.projects?.[0]?.title || 'Industrial Elegance Condo',
      year: data?.projects?.[0]?.year || '2024',
      location: data?.projects?.[0]?.location || 'Kolkata',
      image: resolvedImg1,
    },
    {
      title: data?.projects?.[1]?.title || 'Residential Interior Design',
      year: data?.projects?.[1]?.year || '2024',
      location: data?.projects?.[1]?.location || 'Bhubaneswar',
      image: resolvedImg2,
    },
    {
      title: data?.projects?.[2]?.title || 'Serene Space Studio',
      year: data?.projects?.[2]?.year || '2024',
      location: data?.projects?.[2]?.location || 'Ranchi',
      image: resolvedImg3,
    },
    {
      title: data?.projects?.[3]?.title || 'Art Decor Revival',
      year: data?.projects?.[3]?.year || '2024',
      location: data?.projects?.[3]?.location || 'Kolkata',
      image: resolvedImg4,
    },
    {
      title: data?.projects?.[4]?.title || 'Modern Minimalist Oasis',
      year: data?.projects?.[4]?.year || '2024',
      location: data?.projects?.[4]?.location || 'Siliguri',
      image: resolvedImg5,
    },
    {
      title: data?.projects?.[5]?.title || 'Corporate Executive Suite',
      year: data?.projects?.[5]?.year || '2024',
      location: data?.projects?.[5]?.location || 'Delhi',
      image: resolvedImg6,
    },
  ];

  const checkScrollLimits = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollLimits);
      // Let it evaluate after component layout is done
      setTimeout(checkScrollLimits, 150);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollLimits);
      }
    };
  }, []);

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="projects" className="w-full bg-[#121212] overflow-hidden relative group/slider">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="flex flex-row overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar w-full h-[550px] md:h-[600px] lg:h-[650px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="snap-start min-w-full sm:min-w-[50%] md:min-w-[25%] flex-shrink-0 relative group overflow-hidden cursor-pointer h-full border-r border-white/5 last:border-0"
          >
            {/* Background Image */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              onError={(e) => {
                const fallbacks = [img1, img2, img3, img4, img5, img6];
                e.currentTarget.src = fallbacks[idx] || img1;
              }}
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent z-10"></div>

            {/* Content Container */}
            <div className="absolute bottom-10 left-10 right-10 text-left z-20 flex flex-col justify-end h-auto">
              {/* Project Title */}
              <h3 className="text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight mb-4 font-helvetica drop-shadow-md">
                {project.title}
              </h3>

              {/* Project Info Metadata */}
              <div className="flex flex-col space-y-1.5 text-xs text-white/70 uppercase tracking-widest font-normal">
                <span>{project.year}</span>
                <span>{project.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Navigation Controls (visible on all screens when overflow exists) */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100 transition-opacity duration-300 shadow-xl"
          aria-label="Slide Left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/10 opacity-100 lg:opacity-0 lg:group-hover/slider:opacity-100 transition-opacity duration-300 shadow-xl"
          aria-label="Slide Right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </section>
  );
};

export default ProjectSliderTwo;