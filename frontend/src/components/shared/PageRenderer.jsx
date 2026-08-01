import React, { memo } from 'react';
import ContactFormBlock from '../blocks/ContactFormBlock';

// Import the new Ripples Components
import RipplesHero from '../ripples/RipplesHero';
import RipplesIntroSection from '../ripples/RipplesIntroSection';
import RipplesNatureAquariumSection from '../ripples/RipplesNatureAquariumSection';
import RipplesLetsBeginSection from '../ripples/RipplesLetsBeginSection';
import RipplesAquascapeSection from '../ripples/RipplesAquascapeSection';
import GetStartedCtaSection from '../nature_homepage/GetStartedCtaSection';

const BlockMapper = memo(({ block, index }) => {
  const { type, data } = block;
  
  switch (type) {
    // Generic Blocks
    case 'contactForm': 
      return <ContactFormBlock key={index} data={data} />;
      
    // Ripples Page Blocks
    case 'ripplesHero': 
      return <RipplesHero key={index} data={data} />;
    case 'ripplesIntro': 
      return <RipplesIntroSection key={index} data={data} />;
    case 'ripplesNatureAquarium': 
      return <RipplesNatureAquariumSection key={index} data={data} />;
    case 'ripplesLetsBegin': 
      return <RipplesLetsBeginSection key={index} data={data} />;
    case 'ripplesAquascape': 
      return <RipplesAquascapeSection key={index} data={data} />;
    case 'getStartedCta': 
      return <GetStartedCtaSection key={index} data={data} />;
      
    // Rich Text Block (Updated for dark theme)
    case 'richText':
      return (
        <div key={index} className="py-12 md:py-24 overflow-hidden w-full bg-[#070e06] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <div 
              className="prose prose-invert sm:prose-lg max-w-none w-full mx-auto prose-headings:font-semibold prose-a:text-[#7BA641] hover:prose-a:text-[#6b9337] prose-img:rounded-xl prose-img:w-full break-words overflow-x-auto hide-scrollbar"
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#070e06]">
        <p className="text-center text-zinc-500 italic">
          This page is currently empty. Add blocks from the visual editor.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 bg-[#070e06] min-h-screen">
      {blocks.map((block, index) => (
        <BlockMapper key={block.id || index} block={block} index={index} />
      ))}
    </div>
  );
});

export default PageRenderer;