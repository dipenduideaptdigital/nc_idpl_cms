import React from 'react';
import { resolveAssetUrl } from '../../../utils/assetResolver';

const Hero = ({ contentData, designData }) => {
  if (!contentData) return null;
  
  const bgImage = resolveAssetUrl(contentData.backgroundImage, '/assets/nc_home/ripple_bg.png');
  
  const customStyles = designData?.heroStyles || {};
  const rawCss = customStyles.customCss || '';

  return (
    <>
      {/* INJECT RAW CSS SAFELY FOR THIS SECTION */}
      {rawCss && <style>{rawCss}</style>}

      <section className="nc-hero-section relative w-full h-[60vh] sm:h-[72vh] md:h-[85vh] lg:h-screen min-h-[380px] sm:min-h-[480px] overflow-hidden select-none bg-[#070e06]">
        
        <div className="absolute inset-0 w-full h-full">
          <img src={bgImage} alt="Hero" className="w-full h-full object-cover object-[center_35%] md:object-center filter brightness-95 contrast-105" />
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-28">
          <div className="max-w-2xl space-y-4 text-left">
            
            {contentData.tagline && (
              <span className="nc-hero-tagline font-kanit text-sm font-semibold text-[#7BA641] uppercase tracking-[0.2em] block">
                {contentData.tagline}
              </span>
            )}
            
            {contentData.title && (
              // Added "nc-hero-title" here for easy targeting
              <h1 className="nc-hero-title font-reem text-5xl md:text-7xl font-bold tracking-wide uppercase leading-tight drop-shadow-xl text-white">
                {contentData.title}
              </h1>
            )}
            
            {contentData.description && (
              <p className="nc-hero-description font-kanit text-lg text-zinc-200/90 font-light leading-relaxed">
                {contentData.description}
              </p>
            )}

            <button className="nc-hero-btn mt-6 px-8 py-3 bg-[#7BA641] text-white rounded-md font-bold transition-all hover:bg-white hover:text-[#7BA641]">
              Explore More
            </button>

          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;