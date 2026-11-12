import React from 'react';

export default function ActivityIntroduction({ title }) {
  return (
    <section className="bg-white px-6 py-20 sm:px-12 lg:px-20 lg:py-36 font-kanit text-[#09242b]">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] md:gap-12 lg:gap-20">
        <div className="md:pt-12">
          <h2 className="max-w-[340px] text-3xl sm:text-4xl font-semibold uppercase leading-[1.1]">Introduction of<br />{title}</h2>
          <p className="mt-12 max-w-[310px] text-lg sm:text-xl font-medium text-[#727272] leading-tight">Discover nature through practical experiences, shared learning, and activities that bring people closer to the natural world.</p>
        </div>
        <div className="grid grid-cols-2 gap-3" aria-label="Partner logo placeholders">
          {[1, 2, 3, 4].map((item) => <div key={item} className="flex aspect-square items-center rounded-sm bg-[#477230] pl-[19%] text-2xl font-semibold text-white">LOGO</div>)}
        </div>
      </div>
    </section>
  );
}
