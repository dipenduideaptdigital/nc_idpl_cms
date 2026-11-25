import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const labels = {
  about: 'Who We Are',
  blog: 'Knowledge',
  contact: 'Contact Us',
  faq: 'FAQs',
  faqs: 'FAQs',
  gulmo: 'Gulmo',
  mandala: 'Philosophy',
  'prakriti-lab': 'Prakriti LAB',
  projects: 'Projects',
  ripples: 'Ripples',
  services: 'Services',
  shop: 'Store',
  workshop: 'Workshop',
};

const offeringPages = new Set(['ripples', 'gulmo', 'prakriti-lab', 'workshop']);
const displayName = (segment) => labels[segment] || segment.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const SiteBreadcrumb = () => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const currentSegment = segments.at(-1);

  if (!currentSegment) return null;

  const currentLabel = displayName(currentSegment);
  const crumbs = [{ label: 'Home', to: '/' }];

  if (offeringPages.has(currentSegment)) {
    crumbs.push({ label: 'Offerings', to: '/#offerings' });
  } else if (segments[0] === 'projects' && segments.length > 1) {
    crumbs.push({ label: 'Projects', to: '/projects' });
  } else if (segments[0] === 'blog' && segments.length > 1) {
    crumbs.push({ label: 'Knowledge', to: '/blog' });
  } else if (segments[0] === 'services' && segments.length > 1) {
    crumbs.push({ label: 'Services', to: '/services' });
  }

  return (
    <nav aria-label="Breadcrumb" className="relative z-10 bg-[#f6faef] px-5 py-3.5 font-kanit sm:px-8 sm:py-4 md:px-12 lg:px-20">
      <ol className="mx-auto flex max-w-7xl items-center gap-2 font-kanit text-xs font-normal text-[#657168] sm:gap-2.5 sm:text-sm">
        {crumbs.map((crumb) => (
          <React.Fragment key={crumb.to}>
            <li><Link to={crumb.to} className="transition-colors hover:text-[#4d7a31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6CA844]">{crumb.label}</Link></li>
            <li aria-hidden="true" className="text-[#6CA844]">/</li>
          </React.Fragment>
        ))}
        <li aria-current="page" className="font-medium text-[#06232B]">{currentLabel}</li>
      </ol>
    </nav>
  );
};

export default SiteBreadcrumb;
