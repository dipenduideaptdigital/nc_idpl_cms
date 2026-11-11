import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import workshopHero from '../assets/nc_home/Workshop_hero.png';
import fieldImage from '../assets/nc_home/card4.png';
import communityImage from '../assets/nc_home/plab1.png';
import ActivityIntroduction from '../components/prakriti/ActivityIntroduction';
import ActivityArchive from '../components/prakriti/ActivityArchive';
import PrakritiUpcomingWorkshopsSection from '../components/prakriti/PrakritiUpcomingWorkshopsSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

export default function PrakritiActivityPage() {
  const { activitySlug } = useParams();
  const location = useLocation();
  const title = location.state?.activityTitle?.replace(/\s+/g, ' ') || activitySlug.replace(/-/g, ' ');
  const isWorkshop = /workshop/i.test(title);
  const image = isWorkshop ? workshopHero : (location.state?.activityImage || (/community/i.test(title) ? communityImage : fieldImage));

  useEffect(() => { window.scrollTo(0, 0); }, [activitySlug]);

  return (
    <div className="-mt-24 bg-white text-[#09242b]">
      <section data-nav-theme="dark" className="relative min-h-[60vh] md:min-h-[min(100vh,800px)] bg-[#10252a]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        {!isWorkshop && <div className="absolute inset-0 bg-black/35 flex items-end px-6 pb-16 sm:px-12 lg:px-20"><h1 className="font-kanit text-4xl md:text-6xl font-semibold text-white capitalize">{title}</h1></div>}
        {isWorkshop && <h1 className="sr-only">{title}</h1>}
      </section>
      <ActivityIntroduction title={isWorkshop ? 'workshops' : title} />
      <PrakritiUpcomingWorkshopsSection data={{ heading: isWorkshop ? 'UPCOMING WORKSHOPS' : `UPCOMING ${title.toUpperCase()}` }} />
      <ActivityArchive title={isWorkshop ? 'workshop' : title} />
      <GetStartedCtaSection />
    </div>
  );
}
