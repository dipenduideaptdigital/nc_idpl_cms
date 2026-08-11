import React from 'react';
import NatureNavbar from '../nature_homepage/NatureNavbar';
import branchImg from '../../assets/nc_home/branch.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const NcProjectDetailHero = ({ project, backgroundImage }) => {
  const bgImageUrl = project?.heroImage || project?.image || backgroundImage
    ? resolveAssetUrl(project?.heroImage || project?.image || backgroundImage)
    : branchImg;

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-zinc-950 overflow-hidden font-kanit">
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