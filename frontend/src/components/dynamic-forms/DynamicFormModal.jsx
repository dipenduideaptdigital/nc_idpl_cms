import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import DynamicFormRenderer from './DynamicFormRenderer';

const DynamicFormModal = ({ slug, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !slug) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white text-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-200 flex flex-col">
        
        <div className="sticky top-0 z-20 flex items-center justify-end p-4">
          <button 
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 bg-white/80 backdrop-blur-md hover:bg-zinc-100 p-2 rounded-full transition-colors focus:outline-none cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-10 sm:px-10">
          <DynamicFormRenderer slug={slug} />
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;