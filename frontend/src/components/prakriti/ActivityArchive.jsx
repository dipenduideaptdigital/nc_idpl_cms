import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function ActivityArchive({ title }) {
  const [page, setPage] = useState(1);
  return (
    <section id="activity-archive" className="bg-white px-6 py-20 sm:px-12 lg:px-20 lg:py-28 font-outfit text-[#09242b]">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.2] tracking-normal font-semibold uppercase">Archive {title}</h2>
        <div className="space-y-12 lg:space-y-16">
          {[1, 2, 3, 4].map((item) => (
            <article key={`${page}-${item}`} className="grid gap-6 md:grid-cols-[minmax(0,2.5fr)_minmax(220px,1fr)] md:gap-9">
              <div className="aspect-[2.2/1] bg-[#6CA844]" aria-hidden="true" />
              <div className="flex flex-col justify-center gap-5 text-[#111]">
                <h3 className="mb-1 text-[20px] lg:text-[24px] leading-[1.2] tracking-[0.01em] font-semibold uppercase">Workshop archive</h3>
                <div className="space-y-3">
                  <p className="text-[14px] lg:text-[16px] leading-[1.25] font-semibold uppercase">Venue</p>
                  <p className="text-[12px] lg:text-[14px] leading-[1.3] font-medium text-[#727272]">Details will be available here.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[14px] lg:text-[16px] leading-[1.25] font-semibold uppercase">Date</p>
                  <p className="text-[12px] lg:text-[14px] leading-[1.3] font-normal text-[#727272]">To be announced</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <nav aria-label="Archive pages" className="mt-16 flex items-center gap-4">
          {[1, 2, 3].map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? 'page' : undefined} className={`h-10 w-10 rounded-full text-sm font-semibold ${page === number ? 'bg-[#477230] text-white' : 'bg-[#e5eee8] text-[#1b2425]'}`}>{number}</button>)}
          <button type="button" onClick={() => setPage((current) => current % 3 + 1)} aria-label="Next archive page" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#477230] text-white"><ArrowRight size={20} /></button>
        </nav>
        <p className="mt-4 text-xs text-[#777]">Example archive layout; workshop records are not connected yet.</p>
      </div>
    </section>
  );
}
