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
    <div className="w-screen min-w-[100vw] h-full bg-white text-zinc-900 flex-shrink-0 relative grid grid-cols-1 md:grid-cols-2 grid-rows-2 font-kanit select-none pt-20 sm:pt-24 md:pt-0">
      
      {/* Top-Left: 2011 Seminar Text */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1E293B] mb-2 tracking-tight">
          {year2011Title}
        </span>
        <h3 className="font-kanit font-bold text-lg sm:text-xl lg:text-2xl text-[#1E293B] tracking-tight uppercase mb-3 max-w-lg leading-snug">
          {seminarHeading}
        </h3>
        <p className="text-[#6A6A6A] text-xs sm:text-sm lg:text-base leading-relaxed max-w-lg font-medium">
          {seminarText}
        </p>
      </div>

      {/* Top-Right: 2014 Cuttak Public Aquarium Text */}
      <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white border-l border-zinc-100">
        <span className="font-kanit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1E293B] mb-2 tracking-tight">
          {year2014Title}
        </span>
        <h3 className="font-kanit font-bold text-lg sm:text-xl lg:text-2xl text-[#1E293B] tracking-tight uppercase mb-3 max-w-lg leading-snug">
          {cuttakHeading}
        </h3>
        <p className="text-[#6A6A6A] text-xs sm:text-sm lg:text-base leading-relaxed max-w-lg font-medium">
          {cuttakText}
        </p>
      </div>

      {/* Bottom-Left: Tank 2 Image */}
      <div className="relative w-full h-full overflow-hidden bg-zinc-900">
        <img
          src={data?.image1 ? resolveAssetUrl(data.image1) : tank2Img}
          alt="First Nature Aquarium Seminar 2011"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-Right: Tank 3 Image */}
      <div className="relative w-full h-full overflow-hidden bg-zinc-900 border-l border-zinc-100">
        <img
          src={data?.image2 ? resolveAssetUrl(data.image2) : tank3Img}
          alt="First Public Aquarium Setup Cuttak 2014"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
};

export default AboutSeminarsPanel;