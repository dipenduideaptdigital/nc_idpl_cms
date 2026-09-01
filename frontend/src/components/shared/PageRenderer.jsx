import React, { memo } from 'react';

//Ripples
import RipplesHero from '../ripples/RipplesHero';
import RipplesIntroSection from '../ripples/RipplesIntroSection';
import RipplesNatureAquariumSection from '../ripples/RipplesNatureAquariumSection';
import RipplesLetsBeginSection from '../ripples/RipplesLetsBeginSection';
import RipplesAquascapeSection from '../ripples/RipplesAquascapeSection';
import GetStartedCtaSection from '../nature_homepage/GetStartedCtaSection';

//Gulmo
import GulmoHero from '../gulmo/GulmoHero';
import GulmoTerrariumSection from '../gulmo/GulmoTerrariumSection';
import GulmoQuoteSection from '../gulmo/GulmoQuoteSection';
import GulmoForestOrganismSection from '../gulmo/GulmoForestOrganismSection';
import GulmoOurProjectsSection from '../gulmo/GulmoOurProjectsSection';
import GulmoLetsBeginSection from '../gulmo/GulmoLetsBeginSection';
import GulmoConceptSection from '../gulmo/GulmoConceptSection';

//Prakriti Lab
import PrakritiHero from '../prakriti/PrakritiHero';
import PrakritiIntroSection from '../prakriti/PrakritiIntroSection';
import PrakritiEducationSection from '../prakriti/PrakritiEducationSection';
import PrakritiLabShowcaseSection from '../prakriti/PrakritiLabShowcaseSection';
import PrakritiLabExperienceSection from '../prakriti/PrakritiLabExperienceSection';
import PrakritiUpcomingWorkshopsSection from '../prakriti/PrakritiUpcomingWorkshopsSection';
import PrakritiGetInTouchSection from '../prakriti/PrakritiGetInTouchSection';
import PrakritiLetsBeginSection from '../prakriti/PrakritiLetsBeginSection';

// WORKSHOP 
import WorkshopHero from '../workshop/WorkshopHero';
import WorkshopDetailsSection from '../workshop/WorkshopDetailsSection';
import WorkshopGallerySection from '../workshop/WorkshopGallerySection';

// ABOUT SECTION
import AboutHorizontalScroll from '../nc_about/AboutHorizontalScroll';

// MANDALA SECTION
import MandalaHorizontalScroll from '../nc_mandala/MandalaHorizontalScroll';

import NcProjectsHero from '../nc_projects/NcProjectsHero';
import DynamicFormRenderer from '../dynamic-forms/DynamicFormRenderer';

const BlockMapper = memo(({ block, index }) => {
  const { type, data } = block;
  if (data?.isVisible === false) return null;

  switch (type) {
      
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
    case 'gulmoHero': 
      return <GulmoHero key={index} data={data} />;
    case 'gulmoTerrarium': 
      return <GulmoTerrariumSection key={index} data={data} />;
    case 'gulmoQuote': 
      return <GulmoQuoteSection key={index} data={data} />;
    case 'gulmoForestOrganism': 
      return <GulmoForestOrganismSection key={index} data={data} />;
    case 'gulmoOurProjects': 
      return <GulmoOurProjectsSection key={index} data={data} />;
    case 'gulmoLetsBegin': 
      return <GulmoLetsBeginSection key={index} data={data} />;
    case 'gulmoConcept': 
      return <GulmoConceptSection key={index} data={data} />;
    case 'prakritiHero': 
      return <PrakritiHero key={index} data={data} />;
    case 'prakritiIntro': 
      return <PrakritiIntroSection key={index} data={data} />;
    case 'prakritiEducation': 
      return <PrakritiEducationSection key={index} data={data} />;
    case 'prakritiUpcomingWorkshops': 
      return <PrakritiUpcomingWorkshopsSection key={index} data={data} />;
    case 'prakritiLabExperience': 
      return <PrakritiLabExperienceSection key={index} data={data} />;
    case 'prakritiLabShowcase': 
      return <PrakritiLabShowcaseSection key={index} data={data} />;
    case 'prakritiGetInTouch': 
      return <PrakritiGetInTouchSection key={index} data={data} />;
    case 'prakritiLetsBegin': 
      return <PrakritiLetsBeginSection key={index} data={data} />;
    case 'workshopHero':
      return <WorkshopHero key={index} data={data} />;
    case 'workshopDetails':
      return <WorkshopDetailsSection key={index} data={data} />;
    case 'workshopGallery':
      return <WorkshopGallerySection key={index} data={data} />;
    case 'aboutHorizontalScroll':
      return <AboutHorizontalScroll key={index} data={data} />;
    case 'mandalaHorizontalScroll':
      return <MandalaHorizontalScroll key={index} data={data} />;
    case 'projectsBanner':
      return <NcProjectsHero key={index} data={data} />;
      
    // Dynamic Form Block
    case 'contactForm':
      return (
        <div key={index} className="py-16 px-4 sm:px-6 max-w-3xl mx-auto w-full">
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
            {data?.formTitle && (
              <h2 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">
                {data.formTitle}
              </h2>
            )}
            <DynamicFormRenderer slug={data?.formSlug} />
          </div>
        </div>
      );

    case 'dynamicButton': {
      const handleClick = (e) => {
        if (data?.actionType === 'modal') {
          e.preventDefault(); 
          if (data?.formSlug) {
            window.dispatchEvent(new CustomEvent('open-dynamic-form', { 
              detail: { slug: data.formSlug } 
            }));
          } else {
            alert("No form selected for this button.");
          }
        }
      };

      return (
        <div key={index} className={`w-full py-8 px-6 flex ${data?.alignment || 'justify-center'}`}>
          <a 
            href={data?.actionType === 'link' ? (data?.url || '#') : '#'} 
            onClick={handleClick}
            className="bg-[#7BA641] hover:bg-[#6b9337] text-white font-kanit font-semibold tracking-wider text-sm uppercase px-8 py-3.5 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {data?.label || "Click Here"}
          </a>
        </div>
      );
    }

    // Rich Text Block
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

const PageRenderer = memo(({ blocks, template }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#070e06]">
        <p className="text-center text-zinc-500 italic">
          This page is currently empty. Add blocks from the visual editor.
        </p>
      </div>
    );
  }

  let wrapperBg = "bg-[#070e06]";
  
  if (template === 'prakriti-page') {
    wrapperBg = "bg-[#FAFAF7]";
  } else if (template === 'gulmo-page') {
    wrapperBg = "bg-white";
  } else if (template === 'ripple-page') {
    wrapperBg = "bg-white";
  } else if (template === 'workshop-page') {
    wrapperBg = "bg-[#FAFAF7]";
  } else if (template === 'about-page') {
    wrapperBg = "bg-black";
  } else if (template === 'mandala-page') {
    wrapperBg = "bg-white";
  }

  return (
    <div className={`animate-in fade-in duration-700 min-h-screen w-full ${wrapperBg}`}>
      {blocks.map((block, index) => (
        <BlockMapper key={block.id || index} block={block} index={index} />
      ))}
    </div>
  );
});

export default PageRenderer;