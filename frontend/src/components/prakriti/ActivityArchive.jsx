import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';

const DEFAULT_FALLBACK_ITEMS = [
  { title: 'Workshop archive', venue: 'Details will be available here.', date: 'To be announced', image: '' },
  { title: 'Workshop archive', venue: 'Details will be available here.', date: 'To be announced', image: '' },
  { title: 'Workshop archive', venue: 'Details will be available here.', date: 'To be announced', image: '' },
  { title: 'Workshop archive', venue: 'Details will be available here.', date: 'To be announced', image: '' },
];

export default function ActivityArchive({ title, data }) {
  const [page, setPage] = useState(1);
  if (data?.visible === false) return null;

  const heading = data?.heading?.trim() || `Archive ${title}`;
  const hasCustomItems = Array.isArray(data?.items) && data.items.length > 0;
  const allItems = hasCustomItems ? data.items : DEFAULT_FALLBACK_ITEMS;

  const itemsPerPage = 4;
  const totalPages = hasCustomItems ? Math.max(1, Math.ceil(allItems.length / itemsPerPage)) : 3;
  const itemsToRender = hasCustomItems
    ? allItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : DEFAULT_FALLBACK_ITEMS;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section id="activity-archive" className="bg-white px-6 py-20 sm:px-12 lg:px-20 lg:py-28 font-outfit text-[#09242b]">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.2] tracking-normal font-semibold uppercase">
          {heading}
        </h2>
        <div className="space-y-12 lg:space-y-16">
          {itemsToRender.map((item, idx) => {
            const imgUrl = item?.image ? resolveAssetUrl(item.image) : '';
            const targetUrl = item?.linkUrl || item?.url || '';

            const CardInner = (
              <article className="grid gap-6 md:grid-cols-[minmax(0,2.5fr)_minmax(220px,1fr)] md:gap-9 group">
                <div className="aspect-[2.2/1] bg-[#6CA844] overflow-hidden" aria-hidden={!imgUrl}>
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={item.alt || item.title || 'Workshop archive'}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-5 text-[#111]">
                  <h3 className="mb-1 text-[20px] lg:text-[24px] leading-[1.2] tracking-[0.01em] font-semibold uppercase group-hover:text-[#477230] transition-colors">
                    {item.title || 'Workshop archive'}
                  </h3>
                  <div className="space-y-3">
                    <p className="text-[14px] lg:text-[16px] leading-[1.25] font-semibold uppercase">Venue</p>
                    <p className="text-[12px] lg:text-[14px] leading-[1.3] font-medium text-[#727272]">
                      {item.venue || 'Details will be available here.'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[14px] lg:text-[16px] leading-[1.25] font-semibold uppercase">Date</p>
                    <p className="text-[12px] lg:text-[14px] leading-[1.3] font-normal text-[#727272]">
                      {item.date || 'To be announced'}
                    </p>
                  </div>
                </div>
              </article>
            );

            return targetUrl ? (
              <Link key={`${page}-${idx}`} to={targetUrl} className="block cursor-pointer">
                {CardInner}
              </Link>
            ) : (
              <div key={`${page}-${idx}`}>{CardInner}</div>
            );
          })}
        </div>
        <nav aria-label="Archive pages" className="mt-16 flex items-center gap-4">
          {pageNumbers.map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              aria-current={page === number ? 'page' : undefined}
              className={`h-10 w-10 rounded-full text-sm font-semibold cursor-pointer ${
                page === number ? 'bg-[#477230] text-white' : 'bg-[#e5eee8] text-[#1b2425]'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((current) => (current % totalPages) + 1)}
            aria-label="Next archive page"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#477230] text-white cursor-pointer"
          >
            <ArrowRight size={20} />
          </button>
        </nav>
        {!hasCustomItems && (
          <p className="mt-4 text-xs text-[#777]">Example archive layout; workshop records are not connected yet.</p>
        )}
      </div>
    </section>
  );
}