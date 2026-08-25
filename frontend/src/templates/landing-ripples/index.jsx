import React from 'react';
import Hero from './sections/Hero';
// import Intro from './sections/Intro'; (We will add these back in the next step)

const LandingRipplesTemplate = ({ content }) => {
  // V2 Structure Breakdown
  const sectionContent = content?.content || {};
  const sectionDesign = content?.design || {};

  return (
    <div className="landing-ripples-template">
      {/* Pass Content and Design separately to components */}
      <Hero contentData={sectionContent.hero} designData={sectionDesign.hero} />
    </div>
  );
};

export default LandingRipplesTemplate;