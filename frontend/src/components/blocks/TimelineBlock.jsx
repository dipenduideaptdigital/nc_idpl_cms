import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const TimelineBlock = ({ badgeText, title, items = [] }) => {
  
  const renderTitle = (titleText) => {
    if (!titleText) return null;
    
    const lines = titleText.split(/\\n|\n/);
    
    return lines.map((line, index) => {
      const parts = line.split(/(\[[^\]]+\])/g);
      return (
        <React.Fragment key={index}>
          {parts.map((part, i) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              return (
                <span key={i} className="text-[#3B82F6]">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
          })}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <section className="py-20 lg:py-24 bg-white font-helvetica overflow-hidden">
      <div className="container mx-auto max-w-[1300px] px-6 lg:px-8">
        <div className="relative">
          {/* Badge */}
          <div className="absolute left-0 top-2">
            <div className="inline-flex items-center justify-center gap-1.5 border border-gray-200 rounded-full w-[115px] h-[30px] bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
              <span className="text-[9px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                {badgeText || 'GET IN TOUCH'}
              </span>
            </div>
          </div>
          
          {/* Heading */}
          <div className="flex justify-center">
            <h2 className="text-[38px] md:text-[50px] lg:text-[60px] font-bold text-[#111827] leading-[1.05] tracking-[-0.02em] text-left lg:whitespace-nowrap">
              {renderTitle(title || 'Our History [Is Full Of]\n[Interesting] Stages And\nEvents.')}
            </h2>
          </div>
        </div>

        <div className="mt-20 lg:mt-24 relative w-full overflow-x-auto hide-scrollbar pb-10 pl-2 lg:pl-10">
          <div className="relative flex items-start gap-[50px] lg:gap-[65px] min-w-[1100px]">
            <div className="absolute left-0 w-full h-[2px] bg-gray-200 z-0" style={{ top: '196px' }}></div>
            
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-[170px] relative z-10 shrink-0">
                <div className="w-[160px] h-[160px] rounded-[36px] overflow-hidden bg-zinc-50 shrink-0">
                  <img
                    src={resolveAssetUrl(item.image, '/default-project.png')}
                    alt={`History ${item.year}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="h-[30px] w-full"></div>
                <div className="w-[12px] h-[12px] rounded-full bg-[#3B82F6] shrink-0 ring-4 ring-white"></div>
                <div className="h-[25px] w-full"></div>
                
                <div className="w-full flex flex-col items-start px-1">
                  <h3 className="text-[35px] lg:text-[42px] font-bold text-[#111827] leading-none mb-3">
                    {item.year}
                  </h3>
                  <p className="text-[15px] lg:text-[16px] text-gray-600 leading-[1.2] font-normal text-left">
                    {item.description || 'A business house born out of passion for fish keeping and nature conservation'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineBlock;