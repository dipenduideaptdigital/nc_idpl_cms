import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import apiClient from '../../api/client';

const CtaSection = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCtaData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_cta');
        const { data } = res;
        if (data.success && data.data?.content && isMounted) {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch cta content:', error);
      }
    };

    fetchCtaData();

    return () => {
      isMounted = false;
    };
  }, []);

  const badgeText = content?.badgeText || "GET IN TOUCH";
  const title = content?.title || "Have A Project In [Mind? Let's Make] It Happen";
  const buttonText = content?.buttonText || "BOOK A FREE CONSULTATION";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8 max-w-7xl flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8 fadeInLeft">
          <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
            {badgeText}
          </span>
        </div>
        
        {/* Headline */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-12 max-w-4xl fadeInRight">
          {renderTitle(title)}
        </h2>
        
        {/* CTA Button */}
        <button className="group inline-flex items-center space-x-4 rounded-full border border-gray-300 hover:border-primary transition-colors pl-6 pr-2 py-2 opal-move-up cursor-pointer">
          <span className="text-sm font-bold tracking-wide text-gray-700 group-hover:text-primary transition-colors">
            {buttonText}
          </span>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md">
            <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </button>

      </div>
    </section>
  );
};

export default CtaSection;