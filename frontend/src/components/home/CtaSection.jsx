import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import apiClient from '../../api/client';

const CtaSection = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);

  useEffect(() => {
    let isMounted = true;

    if (externalData) {
      setContent(externalData);
      return () => { isMounted = false; };
    }

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
  }, [externalData]);

  const badgeText = content?.badgeText || "GET IN TOUCH";
  const title = content?.title || "Have A Project In [Mind? Let's]\n[Make] It Happen";
  const buttonText = content?.buttonText || "BOOK A FREE CONSULTATION";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-[#3B82F6]">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-24 bg-white border-t border-zinc-200">
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Badge */}
          <div className="lg:col-span-3 lg:pr-4 fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right Column: Headline & Button */}
          <div className="lg:col-span-9 flex flex-col items-start fadeInRight">
            <h2 className="font-['Outfit'] text-[40px] md:text-[68px] font-bold text-zinc-900 leading-[1.1] tracking-tight mb-12">
              {renderTitle(title)}
            </h2>
            
            {/* CTA Button */}
            <button className="group inline-flex items-center space-x-4 rounded-full border border-zinc-300 hover:border-[#3B82F6] transition-colors pl-6 pr-2 py-2 opal-move-up cursor-pointer">
              <span className="text-[13px] font-bold tracking-wider text-zinc-600 uppercase group-hover:text-zinc-900 transition-colors">
                {buttonText}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md">
                <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;