import React from 'react';
import { resolveAssetUrl } from '../../../utils/assetResolver';

const Intro = ({ contentData, designData }) => {
  if (!contentData) return null;
  
  const personImageSrc = resolveAssetUrl(contentData.personImage, '/assets/nc_home/person.png');
  const customStyles = designData?.introStyles || {};
  const rawCss = customStyles.customCss || '';

  return (
    <>
      {rawCss && <style>{rawCss}</style>}
      
      <section className="nc-intro-section w-full bg-white select-none font-kanit pb-16 sm:pb-20 md:pb-28 overflow-hidden">
        {/* Top Intro Section */}
        <div className="max-w-7xl mx-auto pt-10 sm:pt-16 md:pt-24 lg:pt-28 pb-2 px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-16 items-start">
            
            {/* Main Title (Left Column) */}
            <div className="lg:col-span-7 pr-0 lg:pr-6">
              {contentData.mainTitle && (
                <h2 className="nc-intro-maintitle font-kanit text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#222222] leading-[1.2] sm:leading-[1.16] tracking-tight whitespace-pre-line">
                  {contentData.mainTitle}
                </h2>
              )}
            </div>

            {/* Subtitle, Description & Explore Action (Right Column) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              {contentData.subTitle && (
                <h3 className="nc-intro-subtitle font-kanit text-base sm:text-xl md:text-[22px] font-bold text-[#444444] leading-snug whitespace-pre-line">
                  {contentData.subTitle}
                </h3>
              )}

              {contentData.description && (
                <div 
                  className="nc-intro-desc font-kanit text-xs sm:text-sm md:text-base font-light text-[#666666] leading-relaxed max-w-lg whitespace-pre-line prose-p:my-2"
                  dangerouslySetInnerHTML={{ __html: contentData.description }}
                />
              )}

              {/* Explore Button */}
              <div className="pt-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-consultation-modal'))}
                  className="nc-intro-btn group inline-flex items-center gap-3 text-zinc-700 hover:text-[#7BA641] transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-200/80 group-hover:bg-[#7BA641] text-zinc-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_0_14px_rgba(123,166,65,0.45)] group-active:scale-95">
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="font-kanit text-xs sm:text-sm font-semibold tracking-wide lowercase text-zinc-800 group-hover:text-[#7BA641] transition-colors">
                    explore
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Navy Banner: Prominent Overlapping Image & Spacious Quote */}
        <div className="nc-intro-bottom-banner w-full bg-[#0e222b] mt-20 xs:mt-24 sm:mt-32 md:mt-40 mb-12 sm:mb-16 md:mb-20 py-8 sm:py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative">
            <div className="grid grid-cols-12 gap-4 xs:gap-6 sm:gap-10 md:gap-12 items-center">
              
              <div className="col-span-5 sm:col-span-5 md:col-span-6 relative z-10 flex justify-start -my-10 xs:-my-12 sm:-my-18 md:-my-28 lg:-my-32">
                <div className="w-full max-w-[200px] xs:max-w-[250px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[500px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)] rounded-xs border border-white/15">
                  <img src={personImageSrc} alt={contentData.authorName || "Author"} className="w-full h-auto object-cover block" />
                </div>
              </div>

              <div className="col-span-7 sm:col-span-7 md:col-span-6 space-y-2 xs:space-y-3 sm:space-y-4 py-2 sm:py-6 md:py-10 pl-1 sm:pl-4 text-left text-white">
                {contentData.quote && (
                  <blockquote className="nc-intro-quote font-kanit text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-[34px] font-normal leading-snug sm:leading-tight tracking-wide whitespace-pre-line">
                    {contentData.quote}
                  </blockquote>
                )}
                {contentData.authorName && (
                  <p className="nc-intro-author font-kanit text-xs xs:text-sm sm:text-xl md:text-2xl font-normal italic tracking-wide text-[#8CB84D] sm:text-zinc-200 whitespace-pre-line pt-1">
                    {contentData.authorName}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Intro;