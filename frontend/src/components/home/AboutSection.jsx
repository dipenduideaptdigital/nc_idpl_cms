import React, { useState, useEffect } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import about_img from "../../assets/homepage/about_img.png"

const AboutSection = () => {
  const [content, setContent] = useState(null);
  const [aboutImage, setAboutImage] = useState(about_img);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/cms/homepage/about');
        const data = await res.json();
        if (data.success && data.data?.content) {
          const fetchedContent = data.data.content;
          setContent(fetchedContent);

          const imageUrl = fetchedContent.image ? `http://localhost:5000${fetchedContent.image}` : null;
          if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
              setAboutImage(imageUrl);
            };
            img.onerror = () => {
              setAboutImage(about_img);
            };
          } else {
            setAboutImage(about_img);
          }
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      }
    };
    fetchAboutData();
  }, []);

  const badgeText = content?.badgeText || "STARTED IN 1991";
  const title = content?.title || "Where Spaces Inspire, And [Design Comes Alive]";
  const description = content?.description || "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life. Our numbers speak better than words:";
  const buttonText = content?.buttonText || "More About Us";
  const highlights = content?.highlights || [
    "Latest Technologies",
    "High-Quality Designs",
    "10 Years Warranty",
    "Residential Design"
  ];

  // Helper component or function to render title with primary colored text inside square brackets [like this]
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
    <section className="py-24 bg-[#1a1a1a] overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="text-white max-w-xl fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-600 mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[10px] uppercase tracking-widest font-medium text-gray-300">
                {badgeText}
              </span>
            </div>
            
            {/* Headline */}
            <h2 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-10 tracking-tight">
              {renderTitle(title)}
            </h2>
            
            {/* Checkmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                  <span className="font-semibold text-sm">{highlight}</span>
                </div>
              ))}
            </div>
            
            {/* Paragraph Text */}
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-10 max-w-md">
              {description}
            </p>
            
            {/* CTA Button */}
            <button className="group inline-flex items-center space-x-6 rounded-full border border-gray-500 hover:border-white transition-all pl-6 pr-2 py-2">
              <span className="text-sm font-medium tracking-wide">{buttonText}</span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-lg">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl fadeInRight">
            <img 
              src={aboutImage} 
              alt="Modern Residential Exterior" 
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== about_img) {
                  e.currentTarget.src = about_img;
                }
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;