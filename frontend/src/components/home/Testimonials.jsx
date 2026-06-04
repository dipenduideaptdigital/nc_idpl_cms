import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import apiClient from '../../api/client';

const defaultMainImg = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop";
const defaultAuthorImg = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop";
const defaultLogos = ['LOGO 01', 'LOGO 02', 'LOGO 03', 'LOGO 04', 'LOGO 05'];

const Testimonials = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [mainImg, setMainImg] = useState(defaultMainImg);
  const [authorImg, setAuthorImg] = useState(defaultAuthorImg);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

      if (fetchedContent.image) {
        const mainUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img1 = new Image();
        img1.src = mainUrl;
        img1.onload = () => { if (isMounted) setMainImg(mainUrl); };
        img1.onerror = () => { if (isMounted) setMainImg(defaultMainImg); };
      } else if (isMounted) {
        setMainImg(defaultMainImg);
      }

      if (fetchedContent.authorImage) {
        const authUrl = fetchedContent.authorImage.startsWith('http') ? fetchedContent.authorImage : `${serverUrl}${fetchedContent.authorImage}`;
        const img2 = new Image();
        img2.src = authUrl;
        img2.onload = () => { if (isMounted) setAuthorImg(authUrl); };
        img2.onerror = () => { if (isMounted) setAuthorImg(defaultAuthorImg); };
      } else if (isMounted) {
        setAuthorImg(defaultAuthorImg);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchTestimonialsData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_testimonials');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials content:', error);
      }
    };

    fetchTestimonialsData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "OUR CLIENTS SAY";
  const title = content?.title || "Here's What [Warm Words] \\n [Our Clients] Say";
  const description = content?.description || "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors";
  const ratingValue = content?.ratingValue || "4.80";
  const reviewCount = content?.reviewCount || "2,688 Reviews";
  const conceptText = content?.conceptText || "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!";
  const mainQuote = content?.mainQuote || "I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!";
  const authorName = content?.authorName || "Morgan Dufresne";
  const authorRole = content?.authorRole || "Company owner";
  const bottomText = content?.bottomText || "Our Website [75000+] VIP Customer";
  const logos = content?.logos || defaultLogos;

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
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
    <section className="py-15 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left: Badge */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="fadeInRight">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {renderTitle(title)}
            </h2>
            <p className="text-gray-500 max-w-2xl font-light text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Middle Section: Image and Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-center">
          
          {/* Left: Image */}
          <div className="w-full h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl fadeInLeft">
            <img 
              src={mainImg} 
              alt="Office Interior" 
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src !== defaultMainImg) {
                  e.currentTarget.src = defaultMainImg;
                }
              }}
            />
          </div>

          {/* Right: Testimonial Content */}
          <div className="flex flex-col fadeInRight">
            
            {/* Rating Stats row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="text-6xl font-bold text-gray-900 tracking-tighter">{ratingValue}</div>
              
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="bg-primary text-white flex space-x-1 px-3 py-1.5 rounded-full shadow-md">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900 pl-1">{reviewCount}</span>
              </div>
              
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[250px] sm:pl-4 sm:border-l border-gray-200">
                {conceptText}
              </p>
            </div>
            
            <div className="w-full h-[1px] bg-gray-200 mb-8"></div>

            {/* Testimonial Quote */}
            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-lg">
              &ldquo;{mainQuote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center space-x-4">
              <img 
                src={authorImg} 
                alt={authorName} 
                className="w-12 h-12 rounded-full object-cover shadow-sm"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultAuthorImg) {
                    e.currentTarget.src = defaultAuthorImg;
                  }
                }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{authorName}</span>
                <span className="text-[10px] text-gray-400">{authorRole}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Logos */}
        <div className="pt-8 opal-move-up">
          {/* Divider Text */}
          <div className="flex items-center justify-center mb-16">
            <div className="h-px bg-gray-200 flex-grow max-w-[200px] lg:max-w-[400px]"></div>
            <h3 className="px-6 text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
              {renderTitle(bottomText)}
            </h3>
            <div className="h-px bg-gray-200 flex-grow max-w-[200px] lg:max-w-[400px]"></div>
          </div>

          {/* Logos Grid */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
            {logos.map((logo, index) => (
              <h4 key={index} className="text-2xl font-black text-gray-900 tracking-tighter">
                {logo}
              </h4>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;