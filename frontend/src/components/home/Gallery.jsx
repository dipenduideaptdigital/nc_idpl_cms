import React, { useRef, useEffect, useState } from 'react';
import gallery1 from '../../assets/homepage/gallery1.png';
import gallery2 from '../../assets/homepage/gallery2.png';
import gallery3 from '../../assets/homepage/gallery3.png';
import gallery4 from '../../assets/homepage/gallery4.png';
import gallery5 from '../../assets/homepage/gallery5.png';
import gallery6 from '../../assets/homepage/gallery6.png';
import apiClient from '../../api/client';

const defaultImages = [
  gallery1, gallery2, gallery3, gallery4, gallery5, gallery6
];

const Gallery = () => {
  // Duto alada row er jonno duto alada ref
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const half1Ref = useRef(null);
  const half2Ref = useRef(null);
  
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
    return () => { isMounted = false; };
  }, []);

  const bgText = content?.bgText || "gallery";

  // Data ke duto alada row te vag kora holo
  const topRowImages = [
    { id: 't1', img: imagesList[0] || gallery1, aspect: 'aspect-[4/3]', margin: 'mt-0' },
    { id: 't2', img: imagesList[2] || gallery3, aspect: 'aspect-[16/9]', margin: 'mt-0 md:mt-16' },
    { id: 't3', img: imagesList[4] || gallery5, aspect: 'aspect-[4/3]', margin: 'mt-0' }
  ];

  const bottomRowImages = [
    { id: 'b1', img: imagesList[1] || gallery2, aspect: 'aspect-[16/9]', margin: 'mt-0' },
    { id: 'b2', img: imagesList[3] || gallery4, aspect: 'aspect-[4/3]', margin: 'mt-0 md:mt-16' },
    { id: 'b3', img: imagesList[5] || gallery6, aspect: 'aspect-[16/9]', margin: 'mt-0' }
  ];

  const duplicatedTop = [...topRowImages, ...topRowImages, ...topRowImages, ...topRowImages];
  const duplicatedBottom = [...bottomRowImages, ...bottomRowImages, ...bottomRowImages, ...bottomRowImages];

  useEffect(() => {
    if (row2Ref.current && half2Ref.current) {
      row2Ref.current.scrollLeft = half2Ref.current.clientWidth;
    }

    let lastScrollY = window.scrollY;

    const handleVerticalScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const speedFactor = 0.2; 
      const horizontalMove = scrollDelta * speedFactor;

      if (row1Ref.current && half1Ref.current) {
        row1Ref.current.scrollLeft += horizontalMove;
        
        // Loop bound checking
        if (row1Ref.current.scrollLeft >= half1Ref.current.clientWidth) {
          row1Ref.current.scrollLeft -= half1Ref.current.clientWidth;
        } else if (row1Ref.current.scrollLeft <= 0) {
          row1Ref.current.scrollLeft += half1Ref.current.clientWidth;
        }
      }

      // 2nd Row (Bottom) 
      if (row2Ref.current && half2Ref.current) {
        row2Ref.current.scrollLeft -= horizontalMove;
        
        // Loop bound checking
        if (row2Ref.current.scrollLeft >= half2Ref.current.clientWidth) {
          row2Ref.current.scrollLeft -= half2Ref.current.clientWidth;
        } else if (row2Ref.current.scrollLeft <= 0) {
          row2Ref.current.scrollLeft += half2Ref.current.clientWidth;
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleVerticalScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleVerticalScroll);
  }, []);

  return (
    <section className="py-10 sm:py-16 md:py-32 bg-white relative overflow-hidden min-h-0 md:min-h-[700px]">
      <div className="absolute -top-8 sm:-top-16 md:-top-16 left-0 w-full flex justify-center pointer-events-none z-0">
        <h2 className="text-[22vw] sm:text-[24vw] md:text-[26vw] font-black text-[#F3F4F6] tracking-[-0.05em] leading-[0.85] select-none lowercase">
          {bgText}
        </h2>
      </div>

      <div className="relative z-10 w-full mt-6 sm:mt-10 md:mt-20 opal-move-up flex flex-col gap-3 sm:gap-4 md:gap-6">
        
        <div 
          ref={row1Ref}
          className="flex overflow-hidden items-start w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div ref={half1Ref} className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedTop.map((item, index) => (
              <div key={`t1-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100`}>
                  <img src={item.img} alt="Gallery Top" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedTop.map((item, index) => (
              <div key={`t2-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100`}>
                  <img src={item.img} alt="Gallery Top" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={row2Ref}
          className="flex overflow-hidden items-start w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div ref={half2Ref} className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedBottom.map((item, index) => (
              <div key={`b1-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100`}>
                  <img src={item.img} alt="Gallery Bottom" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 sm:gap-4 md:gap-6 pr-3 sm:pr-4 md:pr-6 items-start shrink-0">
            {duplicatedBottom.map((item, index) => (
              <div key={`b2-${index}`} className={`w-[200px] sm:w-[280px] md:w-[380px] shrink-0 ${item.margin}`}>
                <div className={`w-full rounded-[1rem] sm:rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-sm ${item.aspect} bg-zinc-100`}>
                  <img src={item.img} alt="Gallery Bottom" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
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