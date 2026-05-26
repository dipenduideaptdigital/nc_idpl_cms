import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

const defaultStepsData = [
  {
    id: '01',
    title: 'Initial Consultation',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
  },
  {
    id: '02',
    title: 'Design & Planning',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
  },
  {
    id: '03',
    title: 'Implementation',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
  },
  {
    id: '04',
    title: 'Project Handover',
    description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.',
  },
];

const marginClasses = [
  'mt-0',
  'mt-12 md:mt-16',
  'mt-24 md:mt-32',
  'mt-36 md:mt-48'
];

const placeholderColors = [
  'bg-blue-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-violet-500'
];

const HowWeWork = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStepsData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_how_we_work');
        const { data } = res;
        if (data.success && data.data?.content && isMounted) {
          setContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch how we work content:', error);
      }
    };

    fetchStepsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const badgeText = content?.badgeText || "HOW WE WORK";
  const title = content?.title || "Description [Architecture Process] For Exceptional Results.";
  const description = content?.description || "Our process is alive – adapting, refining, and growing with your vision. Always. Like artists with a blank canvas, we transform rooms into living works of art.";
  const steps = content?.steps || defaultStepsData;
  const bottomText = content?.bottomText || "We've Been Working Hard To Impress You.";
  const bottomLinkText = content?.bottomLinkText || "Start Your's Today";
  const bottomLinkUrl = content?.bottomLinkUrl || "#";

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
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 mb-20 items-end">
          {/* Left: Badge & Heading */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8 bg-white">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              {renderTitle(title)}
            </h2>
          </div>
          
          {/* Right: Description Text */}
          <div className="pb-2 fadeInRight">
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-md">
              {description}
            </p>
          </div>
        </div>

        {/* Staggered Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {steps.map((step, index) => {
            const stepId = step.id || `0${index + 1}`;
            const marginTopClass = marginClasses[index % marginClasses.length];
            const placeholderColor = placeholderColors[index % placeholderColors.length];

            return (
              <div 
                key={index} 
                className={`bg-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col ${marginTopClass} opal-move-up`}
              >
                {/* Image Placeholder */}
                <div className={`w-full h-48 rounded-2xl ${placeholderColor} mb-8`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {stepId}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[90%] pb-12">
                    {step.description}
                  </p>
                </div>

                {/* Large Faint Number Background */}
                <div className="absolute -bottom-4 right-2 text-8xl font-bold text-gray-100/70 z-0 select-none">
                  {stepId}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-gray-900 font-medium">
            {bottomText} <a href={bottomLinkUrl} className="text-primary hover:underline">{bottomLinkText}</a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowWeWork;