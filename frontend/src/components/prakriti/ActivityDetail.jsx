import React from 'react';
import workshopHero from '../../assets/nc_home/Workshop_hero.png';
import fieldImage from '../../assets/nc_home/card4.png';
import communityImage from '../../assets/nc_home/plab1.png';
import ActivityIntroduction from './ActivityIntroduction';
import ActivityArchive from './ActivityArchive';
import PrakritiUpcomingWorkshopsSection from './PrakritiUpcomingWorkshopsSection';
import GetStartedCtaSection from '../nature_homepage/GetStartedCtaSection';
import { resolveAssetUrl } from '../../utils/assetResolver';
import SiteBreadcrumb from '../shared/SiteBreadcrumb';

const FALLBACK_HERO_BY_KEY = {
  'field-trips': fieldImage,
  'community-interaction': communityImage,
  'nature-workshops': workshopHero,
};

export default function ActivityDetail({ data = {} }) {
  const activityKey = data.activityKey || 'field-trips';
  const hero = data.hero || {};
  const introduction = data.introduction || {};
  const events = data.events || {};
  const archive = data.archive || {};
  const cta = data.cta || {};

  const rawTitle = hero.heading || data.card?.title || activityKey.replace(/-/g, ' ');
  const title = rawTitle.replace(/\s+/g, ' ').trim();
  const isWorkshop = /workshop/i.test(title) || activityKey === 'nature-workshops';

  const fallbackImg = isWorkshop
    ? workshopHero
    : FALLBACK_HERO_BY_KEY[activityKey] || (/community/i.test(title) ? communityImage : fieldImage);

  const heroImage = hero.image ? resolveAssetUrl(hero.image) : fallbackImg;
  const showHeading = hero.showHeading !== undefined ? hero.showHeading : !isWorkshop;

  // Preserve original PrakritiUpcomingWorkshopsSection fallback unless customized in admin
  const upcomingData = {
    heading: events.heading?.trim() || (isWorkshop ? 'UPCOMING WORKSHOPS' : `UPCOMING ${title.toUpperCase()}`),
    ...(events.description?.trim() ? { subtext: events.description } : {}),
    ...(events.buttonLabel?.trim() ? { buttonText: events.buttonLabel } : {}),
    ...(Array.isArray(events.items) && events.items.length > 0 ? { workshops: events.items } : {}),
  };

  // Preserve original GetStartedCtaSection fallback unless customized in admin
  const ctaMappedData = {
    isVisible: cta.visible !== false,
    ...(cta.title?.trim() ? { titlePart1: cta.title } : {}),
    ...(cta.accent?.trim() ? { titlePart2: cta.accent } : {}),
    ...(cta.headline?.trim() ? { headline: cta.headline } : {}),
    ...(cta.description?.trim() ? { subtext: cta.description } : {}),
    ...(cta.buttonLabel?.trim() ? { buttonText: cta.buttonLabel } : {}),
    ...(cta.buttonUrl?.trim() ? { buttonLink: cta.buttonUrl } : {}),
  };

  return (
    <div className="-mt-24 bg-white text-[#09242b]">
      <section data-nav-theme="dark" className="relative min-h-[60vh] md:min-h-[min(100vh,800px)] bg-[#10252a]">
        <img
          src={heroImage}
          alt={hero.alt || ''}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {showHeading ? (
          <div className="absolute inset-0 bg-black/35 flex items-end px-6 pb-16 sm:px-12 lg:px-20">
            <h1 className="font-kanit text-4xl md:text-6xl font-semibold text-white capitalize">
              {title}
            </h1>
          </div>
        ) : (
          <h1 className="sr-only">{title}</h1>
        )}
      </section>

      <SiteBreadcrumb />

      <ActivityIntroduction title={isWorkshop ? 'workshops' : title} data={introduction} />

      {events.visible !== false && <PrakritiUpcomingWorkshopsSection data={upcomingData} />}

      <ActivityArchive title={isWorkshop ? 'workshop' : title} data={archive} />

      <GetStartedCtaSection data={ctaMappedData} />
    </div>
  );
}
