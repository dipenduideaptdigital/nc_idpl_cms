import React from 'react';
import { resolveAssetUrl } from '../../utils/assetResolver';

export default function ActivityIntroduction({ title, data }) {
  if (data?.visible === false) return null;

  const customHeading = data?.heading?.trim();
  const description =
    data?.description?.trim() ||
    'Discover nature through practical experiences, shared learning, and activities that bring people closer to the natural world.';
  
  const rawLogos = Array.isArray(data?.logos) && data.logos.length > 0 ? data.logos : [];
  const slots = [0, 1, 2, 3].map((i) => rawLogos[i] || null);

  return (
    <section className="bg-white px-6 py-20 sm:px-12 lg:px-20 lg:py-36 font-outfit text-[#09242b]">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] md:gap-12 lg:gap-20">
        <div className="md:pt-12">
          <h2 className="max-w-[380px] text-[28px] sm:text-[32px] lg:text-[36px] font-semibold uppercase leading-[1.2] tracking-normal whitespace-pre-line">
            {customHeading ? (
              customHeading
            ) : (
              <>
                Introduction of
                <br />
                {title}
              </>
            )}
          </h2>
          <p className="mt-10 sm:mt-14 lg:mt-16 max-w-[340px] text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-[#727272] leading-[1.22] tracking-normal whitespace-pre-line">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3" aria-label="Partner logo placeholders">
          {slots.map((logoObj, index) => {
            const imgUrl = logoObj?.image ? resolveAssetUrl(logoObj.image) : '';
            return (
              <div
                key={index}
                className={`flex aspect-square items-center rounded-sm bg-[#477230] text-[24px] lg:text-[28px] leading-none font-semibold text-white overflow-hidden ${
                  imgUrl ? 'justify-center p-4' : 'pl-[19%]'
                }`}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={logoObj?.alt || logoObj?.label || `Logo ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  logoObj?.label || 'LOGO'
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}