import React from 'react';
import tank2Img from '../../assets/nc_about/tank2.png';
import tank3Img from '../../assets/nc_about/tank3.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const AboutSeminarsPanel = ({ data }) => {
  const year2011Title = data?.year2011Title || "2011";
  const seminarHeading = data?.seminarHeading || "FIRST NATURE AQUARIUM SEMINAR ORGANIZED";
  const seminarText = data?.seminarText || "The Seminar offers lots to both retailers as well as hobbyists. It becomes instrumental in generating interest in planted aquarium as a hobby, as well as a new business line.";

  const year2014Title = data?.year2014Title || "2014";
  const cuttakHeading = data?.cuttakHeading || "FIRST PUBLIC AQUARIUM SETUP IN CUTTAK";
  const cuttakText = data?.cuttakText || "Nature Cube plays an active role in setting up a state-of-the-art public aquarium in Cuttak, Odisha, with the key exhibits being an eight feet Nature Aquarium.";

  return (
    <div className="w-auto flex-shrink-0 h-full bg-white text-zinc-900 relative flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-0 z-10 select-none font-kanit overflow-hidden">
      <div className="relative z-10 flex flex-row items-center my-auto font-kanit mt-28">
        
        {/* Card Column 4: 2011 Text (top) & Tank 2 Image (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-[#1E293B]">
              {year2011Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#1E293B] leading-tight">
              {seminarHeading}
            </span>
            <p className="font-kanit font-normal text-[10px] sm:text-[11px] text-zinc-500 pt-0.5 leading-relaxed uppercase">
              {seminarText}
            </p>
          </div>

          <div className="bg-zinc-900 aspect-[1.5/1] overflow-hidden relative">
            <img
              src={data?.image1 ? resolveAssetUrl(data.image1) : tank2Img}
              alt="First Nature Aquarium Seminar 2011"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Card Column 5: 2014 Text (top) & Tank 3 Image (bottom) */}
        <div className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col space-y-0 font-kanit">
          <div className="bg-white p-6 sm:p-8 aspect-[1.5/1] flex flex-col justify-center space-y-2">
            <span className="font-kanit font-semibold text-3xl sm:text-4xl tracking-tight leading-none text-[#1E293B]">
              {year2014Title}
            </span>
            <span className="font-kanit font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#1E293B] leading-tight">
              {cuttakHeading}
            </span>
            <p className="font-kanit font-normal text-[10px] sm:text-[11px] text-zinc-500 pt-0.5 leading-relaxed uppercase">
              {cuttakText}
            </p>
          </div>

          <div className="bg-zinc-900 aspect-[1.5/1] overflow-hidden relative">
            <img
              src={data?.image2 ? resolveAssetUrl(data.image2) : tank3Img}
              alt="First Public Aquarium Setup Cuttak 2014"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutSeminarsPanel;