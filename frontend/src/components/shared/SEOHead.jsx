import React from 'react';
import { Helmet } from 'react-helmet-async';
import { resolveAssetUrl } from '../../utils/assetResolver';

const SEOHead = ({ data, type = 'page' }) => {
  if (!data) return null;

  const siteName = 'Subhaakritee';

  // Current page URL
  const currentUrl = window.location.href.split('?')[0];

  // SEO Title
  const title = data.metaTitle || data.title || siteName;
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // SEO Description
  const description =
    data.metaDescription ||
    data.excerpt ||
    'Subhaakritee - The Design People. End-to-end interior design solutions.';

  // Robots Meta
  let robots = 'index, follow';
  if (data.noIndex && data.noFollow) {
    robots = 'noindex, nofollow';
  } else if (data.noIndex) {
    robots = 'noindex, follow';
  } else if (data.noFollow) {
    robots = 'index, nofollow';
  }

  // Open Graph & Twitter
  const ogTitle = data.ogTitle || fullTitle;
  const ogDescription = data.ogDescription || description;

  // Canonical URL
  const canonical = data.canonicalUrl || currentUrl;

  // Default Social Share Image
  const defaultImage = `${window.location.origin}/desk.png`;

  // Determine OG Image
  let ogImageUrl = defaultImage;
  if (data.ogImage?.url) {
    ogImageUrl = resolveAssetUrl(data.ogImage.url);
  } else if (data.featuredImage?.url) {
    ogImageUrl = resolveAssetUrl(data.featuredImage.url);
  }

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {data.metaKeywords && <meta name="keywords" content={data.metaKeywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type === 'blog' ? 'article' : 'website'} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Blog Specific Meta */}
      {type === 'blog' && data.publishedAt && <meta property="article:published_time" content={data.publishedAt} />}
      {type === 'blog' && data.updatedAt && <meta property="article:modified_time" content={data.updatedAt} />}
    </Helmet>
  );
};

export default SEOHead;