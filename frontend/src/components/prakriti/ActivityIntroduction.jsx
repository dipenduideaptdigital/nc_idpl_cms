import React from 'react';

export default function ActivityIntroduction({ title }) {
  return (
    <section className="bg-white px-6 py-20 sm:px-12 lg:px-20 lg:py-36 font-outfit text-[#09242b]">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] md:gap-12 lg:gap-20">
        <div className="md:pt-12">
          <h2 className="max-w-[380px] text-[28px] sm:text-[32px] lg:text-[36px] font-semibold uppercase leading-[1.2] tracking-normal">Introduction of<br />{title}</h2>
          <p className="mt-10 sm:mt-14 lg:mt-16 max-w-[340px] text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-[#727272] leading-[1.22] tracking-normal">Discover nature through practical experiences, shared learning, and activities that bring people closer to the natural world.</p>
        </div>
        <div className="grid grid-cols-2 gap-3" aria-label="Partner logo placeholders">
          {[1, 2, 3, 4].map((item) => <div key={item} className="flex aspect-square items-center rounded-sm bg-[#477230] pl-[19%] text-[24px] lg:text-[28px] leading-none font-semibold text-white">LOGO</div>)}
        </div>
      </div>
    </section>
  );
}
