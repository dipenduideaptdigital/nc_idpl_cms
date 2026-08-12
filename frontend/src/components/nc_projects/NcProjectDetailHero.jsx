import React from 'react';
import NatureNavbar from '../nature_homepage/NatureNavbar';
import branchImg from '../../assets/nc_home/branch.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const NcProjectDetailHero = ({ project, backgroundImage }) => {
  const rawImage = project?.heroImage?.url || project?.heroImage || project?.image?.url || project?.image || backgroundImage;

  const bgImageUrl = rawImage 
    ? resolveAssetUrl(rawImage) 
    : branchImg;

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[650px] lg:h-screen -mt-24 bg-zinc-950 overflow-hidden font-kanit select-none">
      <NatureNavbar forceDark={true} />
      
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default NcProjectDetailHero;