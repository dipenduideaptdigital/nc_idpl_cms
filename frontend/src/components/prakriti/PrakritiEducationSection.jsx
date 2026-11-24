import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Reveal from '../../animations/Reveal';
import { pagesApi } from '../../api/pages';
import plab1 from '../../assets/nc_home/plab1.png';
import plab2 from '../../assets/nc_home/plab2.png';
import plab3 from '../../assets/nc_home/card4.png';

const ACTIVITY_KEYS = ['field-trips', 'community-interaction', 'nature-workshops'];

const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  if (typeof path !== 'string') return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/src/') || path.startsWith('/assets/') || path.startsWith('/@fs/')) return path;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};

const defaultCards = [
  {
    id: 1,
    activityKey: 'field-trips',
    title: 'Field Trips',
    image: plab3,
    alt: 'Field Trips with Students',
    description: 'Explore nature and ecosystems through guided learning in the field.',
    visible: true,
  },
  {
    id: 2,
    activityKey: 'community-interaction',
    title: 'Community\nInteraction',
    image: plab1,
    alt: 'Community Interaction in Nature',
    description: 'Connect with communities and learn from their relationship with nature.',
    visible: true,
  },
  {
    id: 3,
    activityKey: 'nature-workshops',
    title: 'Expert-Led\nNature Workshops',
    image: plab2,
    alt: 'Expert-Led Nature Workshops',
    description: 'Learn about nature and conservation through hands-on workshops.',
    visible: true,
  },
];

const PrakritiEducationSection = ({ data }) => {
  const activitiesRef = useRef(null);
  const location = useLocation();
  const navigationType = useNavigationType();
  const [liveActivityCards, setLiveActivityCards] = useState(null);

  useEffect(() => {
    pagesApi
      .getPublicActivities()
      .then((res) => {
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const extracted = res.data.map((item, idx) => {
            const key = item.activityKey || ACTIVITY_KEYS[idx] || 'field-trips';
            const blockCard = item.page?.content?.blocks?.find((b) => b.type === 'prakritiActivity')?.data?.card;
            const c = blockCard || item.card || defaultCards[idx];
            return {
              ...defaultCards[idx],
              ...c,
              activityKey: key,
            };
          });
          setLiveActivityCards(extracted);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (navigationType !== 'POP') return;
    let savedLocation;
    try {
      savedLocation = JSON.parse(sessionStorage.getItem('prakriti-activity-return') || 'null');
    } catch {
      return;
    }
    if (savedLocation?.pathname !== location.pathname || savedLocation?.key !== location.key) return;
    let secondFrame;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const section = activitiesRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'instant' });
        try {
          sessionStorage.removeItem('prakriti-activity-return');
        } catch {}
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [location.key, location.pathname, navigationType]);

  const rememberActivityReturn = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    try {
      sessionStorage.setItem(
        'prakriti-activity-return',
        JSON.stringify({ pathname: location.pathname, key: location.key })
      );
    } catch {}
  };

  const headlineText = data?.headline || 'Welcome to Prakriti Lab, our classroom without walls.';
  const descriptionText =
    data?.description ||
    "<p>At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery's aquariums and terrariums as models, we expose students to basic scientific techniques and E-STEM teachings that complement their curriculum. Conducted year-round by multidisciplinary teachers, these workshops provide practical, hands-on learning experiences, and students receive certificates upon completion.</p>";

  const rawCards =
    data?.cards && data.cards.length > 0
      ? data.cards
      : liveActivityCards && liveActivityCards.length > 0
      ? liveActivityCards
      : defaultCards;

  const cardsToRender = rawCards
    .map((card, index) => ({
      ...defaultCards[index],
      ...card,
      activityKey: card.activityKey || ACTIVITY_KEYS[index] || 'field-trips',
    }))
    .filter((c) => c.visible !== false);

  return (
    <>
      <section
        data-prakriti-step="welcome"
        data-nav-theme="light"
        className="relative w-full min-h-[100svh] bg-[#FAFAF7] text-zinc-900 pt-28 pb-10 px-6 sm:px-12 lg:px-20 xl:px-24 flex items-center font-kanit"
      >
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 xl:gap-24 items-start">
          <Reveal amount={0.3} duration={1.2} className="md:col-span-6">
            <h2 className="font-kanit font-medium text-3xl sm:text-4xl lg:text-[40px] xl:text-[30px] text-[#6A6A6A] leading-[1.18] tracking-tight max-w-xl">
              {headlineText}
            </h2>
          </Reveal>
          <Reveal amount={0.3} duration={1.2} delay={0.15} className="md:col-span-6 md:pt-2 md:ml-4 lg:ml-10">
            <div
              className="font-kanit text-sm sm:text-base lg:text-[18px] text-[#6A6A6A] font-normal max-w-[420px] tiptap-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(descriptionText) }}
            />
          </Reveal>
        </div>
      </section>

      <section
        ref={activitiesRef}
        data-prakriti-step="activities"
        data-nav-theme="light"
        aria-label="Prakriti Lab activities"
        className="relative w-full min-h-[100svh] bg-white pt-28 pb-10 px-6 sm:px-12 lg:px-20 xl:px-24 flex items-center font-kanit"
      >
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {cardsToRender.map((card, index) => {
            const imgSrc = card.image ? getAssetUrl(card.image) : defaultCards[index]?.image || '';
            const targetSlug = card.activityKey || ACTIVITY_KEYS[index] || 'field-trips';

            return (
              <div key={card.id || targetSlug || index} className="h-full">
                <Link
                  to={`/prakriti-lab/activities/${targetSlug}`}
                  state={{ activityTitle: card.title, activityImage: imgSrc }}
                  onClick={rememberActivityReturn}
                  aria-label={`Explore ${card.title || 'activity'}`}
                  className="block h-full group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4b7133]"
                >
                  <article className="flex h-full flex-col bg-[#e5eee8] p-2 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:bg-[#06232b] group-hover:shadow-[0_18px_32px_rgba(6,35,43,0.26)] group-focus-visible:-translate-y-2 group-focus-visible:bg-[#06232b] group-focus-visible:shadow-[0_18px_32px_rgba(6,35,43,0.26)] motion-reduce:transition-none">
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={card.alt || card.title || 'Education Card'}
                        className="w-full aspect-square object-cover object-center"
                      />
                    )}
                    <div className="relative flex flex-col flex-1 pt-3 pb-1 pr-12">
                      <h3 className="font-kanit font-semibold text-2xl text-[#1b2425] leading-tight tracking-tight whitespace-pre-line transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white group-focus-visible:text-white">
                        {card.title}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm leading-snug text-[#515b57] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#e5eee8] group-focus-visible:text-[#e5eee8]">
                          {card.description || 'Discover nature through learning and shared experiences.'}
                        </p>
                      </div>
                      <ArrowUpRight aria-hidden="true" className="absolute bottom-1 right-1 text-[#6f7974] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#a4cf86] group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:text-[#a4cf86] motion-reduce:transition-none" size={40} />
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default PrakritiEducationSection;
