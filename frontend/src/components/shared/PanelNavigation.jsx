import React, { useEffect, useRef } from 'react';
import './PanelNavigation.css';

export default function PanelNavigation({ count, activeIndex, onSelect, className = '' }) {
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
    <nav aria-label="Page sections" className={`panel-navigation ${className}`}>
      <div ref={railRef} className="panel-navigation__rail">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to section ${index + 1} of ${count}`}
            aria-current={activeIndex === index ? 'step' : undefined}
            className="panel-navigation__button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(index);
            }}
          >
            {/* Previous numbered label: {String(index + 1).padStart(2, '0')} */}
            <span className="panel-navigation__dot" aria-hidden="true" />
          </button>
        ))}
      </div>
    </nav>
  );
}
