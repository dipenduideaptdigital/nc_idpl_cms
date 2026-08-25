import React from 'react';
import Hero from './sections/Hero';
import Content from './sections/Content';
import CTA from './sections/CTA';

const LandingBasicTemplate = ({ content }) => {
  const safeContent = content || {};

  return (
    <div className="landing-basic-template font-sans">
      <Hero data={safeContent.hero} />
      <Content data={safeContent.content} />
      <CTA data={safeContent.cta} />
    </div>
  );
};

export default LandingBasicTemplate;