import React, { useEffect, useRef } from 'react';

export default function PanelNavigation({ count, activeIndex, onSelect, className = '', visible = true, onInteract }) {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    const activeButton = rail?.children[activeIndex];
    if (!activeButton) return;
    // Keep the current section visible on narrow screens without scrolling the page.
    rail.scrollTo({
      left: activeButton.offsetLeft - rail.clientWidth / 2 + activeButton.offsetWidth / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }, [activeIndex, count]);

  if (count < 2) return null;

  return (
    <nav
      aria-label="Page sections"
      className={`fixed z-40 max-w-[calc(100vw-112px)] transform-gpu rounded-full border border-[#224229]/12 bg-[#f2f7f1f0] px-1.5 py-1 shadow-[0_2px_10px_rgb(6_35_43_/_10%)] backdrop-blur-[8px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none ${visible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-2 scale-95 opacity-0'} ${className}`}
      onPointerEnter={onInteract}
      onFocus={onInteract}
    >
      <div ref={railRef} className="relative flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to section ${index + 1} of ${count}`}
            aria-current={activeIndex === index ? 'step' : undefined}
            className="group flex size-6 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#224229]"
            onClick={(event) => {
              event.stopPropagation();
              onInteract?.();
              onSelect(index);
            }}
          >
            <span className={`size-1.5 rounded-full bg-[#a7b7a2] transition-[background-color,transform,box-shadow] duration-200 ease-in-out group-hover:bg-[#224229] motion-reduce:transition-none ${activeIndex === index ? 'scale-[1.35] bg-[#6ca844] shadow-[0_0_0_3px_rgb(108_168_68_/_16%)]' : ''}`} aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  );
}
