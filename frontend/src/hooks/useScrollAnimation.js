import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-in-view', 'true');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0,
      rootMargin: "0px 0px -10% 0px" 
    });

    const observeElements = () => {
      const elements = document.querySelectorAll('.opal-move-up, .opal-move-right, .opal-move-left, .fadeInLeft, .fadeInRight');
      elements.forEach(el => {
        if (!el.hasAttribute('data-in-view')) {
          observer.observe(el);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useScrollAnimation;