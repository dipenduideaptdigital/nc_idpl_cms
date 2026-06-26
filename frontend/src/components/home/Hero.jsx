import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client'; 
import defaultHeroback from '../../assets/homepage/banner_back.png';
import defaultHerofront from '../../assets/homepage/banner_front.png';

const Hero = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [isLoading, setIsLoading] = useState(!externalData);
  const [bgImage, setBgImage] = useState(defaultHeroback);
  const [frontImg, setFrontImg] = useState(defaultHerofront);

  useEffect(() => {
    const processContent = async (fetchedContent) => {
      setContent(fetchedContent);
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
      const bgUrl = fetchedContent.backgroundImage ? (fetchedContent.backgroundImage.startsWith('http') ? fetchedContent.backgroundImage : `${baseUrl}${fetchedContent.backgroundImage}`) : null;
      const frontUrl = fetchedContent.frontImage ? (fetchedContent.frontImage.startsWith('http') ? fetchedContent.frontImage : `${baseUrl}${fetchedContent.frontImage}`) : null;

      const preloadPromises = [];

      if (bgUrl) {
        preloadPromises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.src = bgUrl;
            img.onload = () => { setBgImage(bgUrl); resolve(); };
            img.onerror = () => { setBgImage(defaultHeroback); resolve(); };
          })
        );
      } else { setBgImage(defaultHeroback); }

      if (frontUrl) {
        preloadPromises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.src = frontUrl;
            img.onload = () => { setFrontImg(frontUrl); resolve(); };
            img.onerror = () => { setFrontImg(defaultHerofront); resolve(); };
          })
        );
      } else { setFrontImg(defaultHerofront); }

      if (preloadPromises.length > 0) {
        await Promise.all(preloadPromises);
      }
      setIsLoading(false);
    };

    if (externalData) {
      processContent(externalData);
      return;
    }

    const fetchHeroData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_hero');
        const data = res.data; 
        if (data.success && data.data?.content) {
          await processContent(data.data.content);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error);
        setIsLoading(false);
      }
    };
    
    fetchHeroData();
  }, [externalData]);

  // Utility to handle 3-line subtitle breaks
  const renderSubtitle = (text) => {
    if (!text) return null;
    return text.split(/\\n|\n/).map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleScrollDown = () => {
    const nextSection = document.getElementById('experience-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-[650px] lg:h-[750px] xl:h-[800px] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-white/70 tracking-widest text-sm uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    // Height fixed to match Figma, removed min-h-screen to fix zoom/crop
    <div className="relative w-full h-[650px] lg:h-[750px] xl:h-[800px] flex items-center justify-center overflow-hidden bg-zinc-900 font-helvetica">
      
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 relative z-10 pt-16 lg:pt-0 pb-16 lg:pb-0">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-12 lg:gap-8 pt-8 lg:pt-0">
          
          {/* Left Content Area */}
          <div className="text-white max-w-xl lg:max-w-2xl xl:max-w-3xl fadeInLeft flex flex-col items-start text-left w-full lg:w-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-sm mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-white/90">
                {content?.badgeText || "Fast and Reliable"}
              </span>
            </div>
            
            {/* Headlines */}
            <h1 className="text-3xl md:text-5xl lg:text-[56px] xl:text-[72px] 2xl:text-[90px] font-bold leading-tight lg:leading-[60px] xl:leading-[76px] 2xl:leading-[93px] mb-4 md:mb-6 drop-shadow-lg font-helvetica">
              <span className="tracking-normal block whitespace-nowrap">{content?.titleLine1 || "End-to-end"}</span>
              <span className="tracking-[0.1em] block whitespace-nowrap">{content?.titleLine2 || "Office Interiors"}</span>
            </h1>
            
            <p className="text-sm md:text-lg text-gray-200 mb-8 md:mb-10 lg:max-w-[430px] font-light leading-relaxed ml-22">
              {content?.subtitle || "We specialize in transforming visions into reality. Explore our interior design projects crafted with precision."}
            </p>
            
            {/* CTA Button */}
            <Link 
              to="/contact" 
              className="group inline-flex items-center space-x-4 md:space-x-6 rounded-full border border-white/40 hover:border-white transition-all pl-5 md:pl-6 pr-2 py-2 ml-20"
            >
              <span className="text-xs md:text-sm font-medium tracking-wide">{content?.buttonText || "BOOK A FREE CONSULTATION"}</span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </Link>
          </div>

          {/* Right Content Area - Glassmorphism Cards - Proportions fixed */}
          <div className="flex flex-row items-center justify-center lg:justify-end gap-6 fadeInRight shrink-0 w-full lg:w-auto mt-0 lg:mt-0">
            {/* Glass Card - Portrait Ratio */}
            <div className="w-[160px] h-[220px] md:w-[220px] md:h-[300px] bg-[#3a3532]/40 glass-dark rounded-[24px] p-6 shadow-2xl z-20 flex flex-col justify-between shrink-0">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{content?.glassCardNumber || "250+"}</h2>
                <p className="text-xs text-gray-200 font-normal leading-relaxed">{content?.glassCardText1 || "Lorem Ipsum Is Simply Dummy Text"}</p>
              </div>
              <p className="text-sm text-white font-medium">{content?.glassCardText2 || "There Is No One Who Loves Pain Itself"}</p>
            </div>

            {/* Image Card - Portrait Ratio */}
            <div className="w-[160px] h-[220px] md:w-[220px] md:h-[300px] rounded-[24px] overflow-hidden shadow-2xl z-10 border-2 border-white/10 shrink-0">
              <img 
                src={frontImg} 
                alt="Modern Interior" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultHerofront) {
                    e.currentTarget.src = defaultHerofront;
                  }
                }}
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Arrow Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opal-move-up">
        <button 
          onClick={handleScrollDown}
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
        >
          <ArrowDown className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Hero;