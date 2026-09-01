import React, { useState, useEffect } from 'react';
import DynamicFormModal from './DynamicFormModal';

const GlobalFormModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(null);

  useEffect(() => {
    const handleOpenDynamicForm = (event) => {
      const slug = event.detail?.slug;
      if (slug) {
        setActiveSlug(slug);
        setIsOpen(true);
      } else {
        console.error("[GlobalFormModal] No slug provided in event detail.");
      }
    };

    window.addEventListener('open-dynamic-form', handleOpenDynamicForm);
    
    return () => {
      window.removeEventListener('open-dynamic-form', handleOpenDynamicForm);
    };
  }, []);

  return (
    <DynamicFormModal 
      slug={activeSlug} 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
    />
  );
};

export default GlobalFormModal;