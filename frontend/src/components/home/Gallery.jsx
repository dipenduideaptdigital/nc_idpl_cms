import React, { useRef, useEffect, useState } from 'react';
import gallery1 from '../../assets/homepage/gallery1.png';
import gallery2 from '../../assets/homepage/gallery2.png';
import gallery3 from '../../assets/homepage/gallery3.png';
import gallery4 from '../../assets/homepage/gallery4.png';
import gallery5 from '../../assets/homepage/gallery5.png';
import gallery6 from '../../assets/homepage/gallery6.png';
import apiClient from '../../api/client';

const defaultImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6
];

const Gallery = () => {
  const scrollRef = useRef(null);
  const halfRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [content, setContent] = useState(null);
  const [imagesList, setImagesList] = useState(defaultImages);

  useEffect(() => {
    let isMounted = true;

    const fetchGalleryData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_gallery');
        const { data } = res;

        if (data.success && data.data?.content) {
          const fetchedContent = data.data.content;
          if (isMounted) setContent(fetchedContent);

          const serverUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');

          if (fetchedContent.images && fetchedContent.images.length > 0) {
            const mapped = fetchedContent.images.map((img, idx) => {
              return img ? `${serverUrl}${img}` : defaultImages[idx % defaultImages.length];
            });
            if (isMounted) setImagesList(mapped);
          } else if (isMounted) {
            setImagesList(defaultImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery content:', error);
      }
    };

    fetchGalleryData();

    return () => {
      isMounted = false;
    };
  }, []);

  const bgText = content?.bgText || "gallery";

  const galleryColumns = [
    {
      id: 1,
      marginTop: 'mt-0',
      topHeight: 'h-[220px]',
      bottomHeight: 'h-[300px]',
      images: [
        imagesList[0] || gallery1,
        imagesList[1] || gallery2
      ]
    },
    {
      id: 2,
      marginTop: 'mt-16 md:mt-24',
      topHeight: 'h-[150px]',
      bottomHeight: 'h-[200px]',
      images: [
        imagesList[2] || gallery3,
        imagesList[3] || gallery4
      ]
    },
    {
      id: 3,
      marginTop: 'mt-0',
      topHeight: 'h-[300px]',
      bottomHeight: 'h-[180px]',
      images: [
        imagesList[4] || gallery5,
        imagesList[5] || gallery6
      ]
    }
  ];

  const duplicatedSets = [...galleryColumns, ...galleryColumns, ...galleryColumns, ...galleryColumns];

  useEffect(() => {
    let animationId;
    
    const scroll = () => {
      if (scrollRef.current && halfRef.current && !isInteracting) {
        scrollRef.current.scrollLeft += 1;
        if (scrollRef.current.scrollLeft >= halfRef.current.clientWidth) {
          scrollRef.current.scrollLeft -= halfRef.current.clientWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isInteracting]);

  const handleTouchEnd = () => {
    setTimeout(() => setIsInteracting(false), 1000);
  };

  return (
    <section className="py-18 bg-white relative overflow-hidden min-h-[800px]">

      {/* Massive Background Text */}
      <div className="absolute top-12 md:top-20 left-0 right-0 w-full text-center pointer-events-none z-0">
        <h2 className="text-[35vw] md:text-[25vw] font-black text-gray-200 tracking-tighter leading-none select-none lowercase">
          {bgText}
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative z-10 w-full mt-32 md:mt-56 opal-move-up">
        <div 
          ref={scrollRef}
          className={`flex overflow-x-auto hide-scrollbar items-start cursor-grab active:cursor-grabbing ${isInteracting ? 'snap-x snap-mandatory' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* First Half */}
          <div ref={halfRef} className="flex gap-4 md:gap-6 pr-4 md:pr-6 items-start shrink-0">
            {duplicatedSets.map((col, index) => (
              <div 
                key={`h1-${col.id}-${index}`} 
                className={`flex flex-col gap-4 md:gap-6 w-[300px] md:w-[420px] shrink-0 snap-center ${col.marginTop}`}
              >
                <div className={`w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg ${col.topHeight}`}>
                  <img src={col.images[0]} alt="Gallery Top" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
                </div>
                <div className={`w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg ${col.bottomHeight}`}>
                  <img src={col.images[1]} alt="Gallery Bottom" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          {/* Second Half */}
          <div className="flex gap-4 md:gap-6 pr-4 md:pr-6 items-start shrink-0">
            {duplicatedSets.map((col, index) => (
              <div 
                key={`h2-${col.id}-${index}`} 
                className={`flex flex-col gap-4 md:gap-6 w-[300px] md:w-[420px] shrink-0 snap-center ${col.marginTop}`}
              >
                <div className={`w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg ${col.topHeight}`}>
                  <img src={col.images[0]} alt="Gallery Top" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
                </div>
                <div className={`w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg ${col.bottomHeight}`}>
                  <img src={col.images[1]} alt="Gallery Bottom" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Gallery;