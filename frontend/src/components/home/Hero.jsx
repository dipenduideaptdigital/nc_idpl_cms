import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Main Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Area */}
          <div className="text-white max-w-2xl fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-white/90">
                {content?.badgeText || "Fast and Reliable"}
              </span>
            </div>
            
            {/* Headlines */}
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              {content?.titleLine1 || "End-To-End"} <br /> {content?.titleLine2 || "Office Interiors"}
            </h1>
            
            <p className="text-lg text-gray-200 mb-10 max-w-md font-light leading-relaxed">
              {content?.subtitle || "We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision."}
            </p>
            
            {/* CTA Button */}
            <button className="group inline-flex items-center space-x-6 rounded-full border border-white/40 hover:border-white transition-all pl-6 pr-2 py-2">
              <span className="text-sm font-medium tracking-wide">{content?.buttonText || "BOOK A FREE CONSULTATION"}</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Right Content Area - Glassmorphism Cards */}
          <div className="hidden lg:flex h-[500px] items-end justify-end gap-6 pb-4 fadeInRight">
            {/* Glass Card */}
            <div className="w-[280px] h-[280px] bg-[#3a3532]/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl z-20 flex flex-col justify-between shrink-0">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{content?.glassCardNumber || "250+"}</h2>
                <p className="text-xs text-gray-300 font-light">
                  {content?.glassCardText1 || "My Design of art"}
                </p>
              </div>
              
              <div>
                <div className="w-8 h-[1px] bg-gray-500 mb-4"></div>
                <p className="text-lg text-white font-medium leading-tight">
                  {content?.glassCardText2 || "There Is No One Who Loves Pain Itself"}
                </p>
              </div>
            </div>

            {/* Image Card */}
            <div className="w-[280px] h-[280px] rounded-[2rem] overflow-hidden shadow-2xl z-10 border-4 border-white/10 shrink-0 transition-all duration-500">
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
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <ArrowDown className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Hero;