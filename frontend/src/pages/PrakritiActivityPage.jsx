import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { pagesApi } from '../api/pages';
import ActivityDetail from '../components/prakriti/ActivityDetail';
import SEOHead from '../components/shared/SEOHead';

const ALIASES = {
  'expert-led-nature-workshop': 'nature-workshops',
  'expert-led-nature-workshops': 'nature-workshops',
};

export default function PrakritiActivityPage() {
  const { activitySlug } = useParams();
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizedSlug = ALIASES[activitySlug] || activitySlug;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (ALIASES[activitySlug]) return;

    let isMounted = true;
    const fetchActivityAndWorkshops = async () => {
      try {
        setLoading(true);

        const [pageRes, workshopsRes] = await Promise.allSettled([
          pagesApi.getPublicPageBySlug(`prakriti-lab/activities/${normalizedSlug}`),
          pagesApi.getPublicPages({ template: 'workshop-page', limit: 100 }),
        ]);

        if (!isMounted) return;

        const fallbackTitle =
          location.state?.activityTitle?.replace(/\s+/g, ' ') || normalizedSlug.replace(/-/g, ' ');

        let baseActivity = {
          activityKey: normalizedSlug,
          card: { title: fallbackTitle, description: '', image: location.state?.activityImage || '' },
          hero: {
            heading: fallbackTitle,
            image: location.state?.activityImage || '',
            alt: fallbackTitle,
            showHeading: !/workshop/i.test(fallbackTitle) && normalizedSlug !== 'nature-workshops',
          },
          introduction: { heading: '', visible: true },
          events: {
            heading: normalizedSlug === 'nature-workshops' ? 'UPCOMING WORKSHOPS' : `UPCOMING ${fallbackTitle.toUpperCase()}`,
            visible: true,
            items: [],
          },
          archive: { heading: `Archive ${ normalizedSlug === 'nature-workshops' ? 'workshop' : fallbackTitle }`, visible: true, items: [] },
          cta: { visible: true },
        };

        if (pageRes.status === 'fulfilled' && pageRes.value?.data) {
          const page = pageRes.value.data;
          setPageData(page);
          const block = page?.content?.blocks?.find((b) => b.type === 'prakritiActivity');
          if (block?.data) {
            baseActivity = {
              ...baseActivity,
              ...block.data,
              hero: { ...baseActivity.hero, ...(block.data.hero || {}) },
              introduction: { ...baseActivity.introduction, ...(block.data.introduction || {}) },
              events: { ...baseActivity.events, ...(block.data.events || {}) },
              archive: { ...baseActivity.archive, ...(block.data.archive || {}) },
              cta: { ...baseActivity.cta, ...(block.data.cta || {}) },
            };
          }
        }

        // Extract mapped Workshop Pages for this specific Activity Page
        const allWorkshopPages =
          workshopsRes.status === 'fulfilled' && Array.isArray(workshopsRes.value?.data)
            ? workshopsRes.value.data
            : [];

        const matchedWorkshops = allWorkshopPages.filter((wp) => {
          const targetActivity = wp.content?.activityKey || 'nature-workshops';
          return targetActivity === normalizedSlug;
        });

        const mappedUpcoming = [];
        const mappedArchive = [];

        matchedWorkshops.forEach((wp) => {
          const blocks = wp.content?.blocks || [];
          const heroBlock = blocks.find((b) => b.type === 'workshopHero')?.data || {};
          const detailsBlock = blocks.find((b) => b.type === 'workshopDetails')?.data || {};
          const galleryBlock = blocks.find((b) => b.type === 'workshopGallery')?.data || {};

          const cardImage =
            wp.content?.thumbnail ||
            heroBlock.backgroundImage ||
            galleryBlock.image1 ||
            wp.featuredImage?.url ||
            '';

          const targetUrl = wp.fullPath || `/${wp.slug}`;
          const placement = wp.content?.placement || 'upcoming';

          if (placement === 'archive') {
            mappedArchive.push({
              id: wp.id,
              title: detailsBlock.title || wp.title,
              venue: wp.content?.venue || detailsBlock.venue || 'NatureCube Experience Centre, Kolkata',
              date: detailsBlock.date || 'Completed',
              image: cardImage,
              linkUrl: targetUrl,
            });
          } else {
            mappedUpcoming.push({
              id: wp.id,
              title: detailsBlock.title || wp.title,
              image: cardImage,
              date: detailsBlock.date || '',
              venue: wp.content?.venue || detailsBlock.venue || '',
              url: targetUrl,
              buttonUrl: targetUrl,
            });
          }
        });

        // Merge mapped Workshop pages with any manually added items
        if (mappedUpcoming.length > 0) {
          baseActivity.events = {
            ...baseActivity.events,
            items: [...mappedUpcoming, ...(baseActivity.events.items || [])],
          };
        }

        if (mappedArchive.length > 0) {
          baseActivity.archive = {
            ...baseActivity.archive,
            items: [...mappedArchive, ...(baseActivity.archive.items || [])],
          };
        }

        setActivityData(baseActivity);
      } catch (err) {
        console.error('Error loading activity page:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActivityAndWorkshops();
    return () => {
      isMounted = false;
    };
  }, [activitySlug, normalizedSlug, location.state]);

  if (ALIASES[activitySlug]) {
    return <Navigate to={`/prakriti-lab/activities/${ALIASES[activitySlug]}`} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-[#6CA844] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {pageData && <SEOHead data={pageData} type="page" />}
      <ActivityDetail data={activityData || { activityKey: normalizedSlug }} />
    </>
  );
}