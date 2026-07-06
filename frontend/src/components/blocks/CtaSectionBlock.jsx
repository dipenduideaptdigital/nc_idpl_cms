import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CtaSectionBlock = ({ badgeText, title, buttonText }) => {
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
          <div className="lg:col-span-3 lg:pr-4 fadeInLeft" data-in-view="true">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right Column: Headline & Button */}
          <div className="lg:col-span-9 flex flex-col items-start fadeInRight" data-in-view="true">
            <h2 className="font-['Outfit'] text-[40px] md:text-[68px] font-bold text-zinc-900 leading-[1.1] tracking-tight mb-12">
              {renderTitle(title)}
            </h2>
            
            <Link to="/contact">
              <button className="group inline-flex items-center space-x-4 rounded-full border border-zinc-300 hover:border-[#3B82F6] transition-colors pl-6 pr-2 py-2 cursor-pointer">
                <span className="text-[13px] font-bold tracking-wider text-zinc-600 uppercase group-hover:text-zinc-900 transition-colors">
                  {buttonText}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md">
                  <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSectionBlock;