import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { DEFAULT_MEGA_MENU, MEGA_MENU_KEY, mergeMegaMenu } from '../../config/offeringsMegaMenu';
import OfferingsMegaMenuPanel from './OfferingsMegaMenuPanel';

const defaultLinks = {
  ripple: '/ripples',
  gulmo: '/gulmo',
  prakriti: '/prakriti-lab',
};

export default function OfferingsMegaMenu({ links, ...props }) {
  const [content, setContent] = useState(DEFAULT_MEGA_MENU);
  useEffect(() => {
    const controller = new AbortController();
    apiClient.get(`/cms/section/${MEGA_MENU_KEY}`, { signal: controller.signal })
      .then(res => { if (!controller.signal.aborted) setContent(mergeMegaMenu(res.data?.data?.content)); })
      .catch(error => { if (!controller.signal.aborted) console.warn('Mega menu fallback:', error.message); });
    return () => controller.abort();
  }, []);
  const [resolvedLinks, setResolvedLinks] = useState(defaultLinks);

  useEffect(() => {
    if (links) return;
    let active = true;
    apiClient.get('/pages/public').then((response) => {
      const pages = response.data?.data || response.data || [];
      if (!Array.isArray(pages) || !active) return;
      const nextLinks = { ...defaultLinks };
      const templates = { 'ripple-page': 'ripple', 'gulmo-page': 'gulmo', 'prakriti-page': 'prakriti' };
      pages.forEach((page) => {
        const key = templates[page.template];
        if (key && page.slug) nextLinks[key] = `/${page.slug}`;
      });
      setResolvedLinks(nextLinks);
    }).catch((error) => {
      console.error('Failed to fetch mega menu links, using defaults.', error);
    });
    return () => { active = false; };
  }, [links]);

  return <OfferingsMegaMenuPanel {...props} content={content} links={{ ...resolvedLinks, ...links }} />;
}
