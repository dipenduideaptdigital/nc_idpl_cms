import React, { useRef, useEffect, useState } from 'react';
import gallery1 from '../../assets/homepage/gallery1.png'
import gallery2 from '../../assets/homepage/gallery2.png'
import gallery3 from '../../assets/homepage/gallery3.png'
import gallery4 from '../../assets/homepage/gallery4.png'
import gallery5 from '../../assets/homepage/gallery5.png'
import gallery6 from '../../assets/homepage/gallery6.png'



const galleryColumns = [
  {
    id: 1,
    marginTop: 'mt-0',
    topHeight: 'h-[220px]',
    bottomHeight: 'h-[300px]',
    images: [
      gallery1,
      gallery2
    ]
  },
  {
    id: 2,
    marginTop: 'mt-16 md:mt-24',
    topHeight: 'h-[150px]',
    bottomHeight: 'h-[200px]',
    images: [
      gallery3,
      gallery4
    ]
  },
  {
    id: 3,
    marginTop: 'mt-0',
    topHeight: 'h-[300px]',
    bottomHeight: 'h-[180px]',
    images: [
      gallery5,
      gallery6
    ]
  }
];

// Create a larger dataset to ensure seamless looping and enough content to fill any screen
const duplicatedSets = [...galleryColumns, ...galleryColumns, ...galleryColumns, ...galleryColumns];

const Gallery = () => {
  const scrollRef = useRef(null);
  const halfRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    let animationId;
    
    const scroll = () => {
      // Only auto-scroll if the user is not actively hovering or swiping
      if (scrollRef.current && halfRef.current && !isInteracting) {
        scrollRef.current.scrollLeft += 1; // Speed of the continuous scroll
        
        // Seamless infinite loop jump
        if (scrollRef.current.scrollLeft >= halfRef.current.clientWidth) {
          scrollRef.current.scrollLeft -= halfRef.current.clientWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isInteracting]);

  // Pause interaction safely with a slight delay on touch end so momentum scrolling isn't interrupted instantly
  const handleTouchEnd = () => {
    setTimeout(() => setIsInteracting(false), 1000);
  };

  return (
    <section className="py-18 bg-white relative overflow-hidden min-h-[800px]">

      {/* Massive Background Text - Positioned at top */}
      <div className="absolute top-12 md:top-20 left-0 right-0 w-full text-center pointer-events-none z-0">
        <h2 className="text-[35vw] md:text-[25vw] font-black text-gray-200 tracking-tighter leading-none select-none lowercase">
          gallery
        </h2>
      </div>

      {/* Carousel Container - Pushed down to reveal text above it */}
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
          
          {/* First Half (Used for measurement and looping) */}
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

          {/* Second Half (Duplicate for seamless scroll behind the first half) */}
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