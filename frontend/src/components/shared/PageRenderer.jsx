import React, { memo } from 'react';
import Hero from '../home/Hero';
import Services from '../home/Services';
import AboutSection from '../home/AboutSection';
import OurServices from '../home/OurServices';
import HowWeWork from '../home/HowWeWork';
import OurProjects from '../home/OurProjects';
import Panoramas from '../home/Panoramas';
import Team from '../home/Team';
import Testimonials from '../home/Testimonials';
import VideoBanner from '../home/VideoBanner';
import BlogSection from '../home/BlogSection';
import Gallery from '../home/Gallery';
import CtaSection from '../home/CtaSection';
import ContactFormBlock from '../blocks/ContactFormBlock';

const BlockMapper = memo(({ block, index }) => {
  const { type, data } = block;
  
  switch (type) {
    case 'hero': return <Hero key={index} data={data} />;
    case 'services': return <Services key={index} data={data} />;
    case 'about': return <AboutSection key={index} data={data} />;
    case 'our_services': return <OurServices key={index} data={data} />;
    case 'how_we_work': return <HowWeWork key={index} data={data} />;
    case 'our_projects': return <OurProjects key={index} data={data} />;
    case 'panoramas': return <Panoramas key={index} data={data} />;
    case 'team': return <Team key={index} data={data} />;
    case 'testimonials': return <Testimonials key={index} data={data} />;
    case 'video_banner': return <VideoBanner key={index} data={data} />;
    case 'blog_section': return <BlogSection key={index} data={data} />;
    case 'gallery': return <Gallery key={index} data={data} />;
    case 'cta': return <CtaSection key={index} data={data} />;
    case 'contactForm': return <ContactFormBlock key={index} data={data} />;
    case 'richText':
      return (
        <div key={index} className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div 
              className="prose prose-zinc lg:prose-lg mx-auto prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: data?.content || '' }}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
});

const PageRenderer = memo(({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-center text-zinc-500 italic">
          This page is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 min-h-screen">
      {blocks.map((block, index) => (
        <BlockMapper key={block.id || index} block={block} index={index} />
      ))}
    </div>
  );
});

export default PageRenderer;