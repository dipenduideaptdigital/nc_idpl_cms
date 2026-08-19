import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-40 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <div className="relative group flex items-center">
        {/* Tooltip on Hover */}
        <span className="mr-3 px-3 py-1.5 bg-zinc-900 text-white text-xs font-kanit tracking-wider uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-md translate-x-2 group-hover:translate-x-0 border border-zinc-700">
          Move to top
        </span>

        {/* Move to Top Floating Button */}
        <button
          onClick={scrollToTop}
          aria-label="Move to top"
          className="w-12 h-12 rounded-full bg-transparent hover:bg-[#6CA844] text-[#6CA844] hover:text-white border border-[#6CA844]/50 hover:border-[#6CA844] flex items-center justify-center backdrop-blur-md shadow-md hover:shadow-[0_0_20px_rgba(108,168,68,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5] transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ScrollToTop;
