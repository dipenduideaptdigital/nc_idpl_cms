import React, { useState } from 'react';
import aqua1 from '../../assets/nc_home/aqua1.png';
import aqua2 from '../../assets/nc_home/aqua2.png';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import { resolveAssetUrl } from '../../utils/assetResolver';
import { ArrowRight } from 'lucide-react';

const DEFAULT_IMAGES = [aqua1, aqua2, gallery1, gallery2, gallery3];

const resolveImg = (img) => {
  if (!img) return aqua1;
  if (typeof img === 'object' && img.src) return resolveImg(img.src);
  if (typeof img === 'string') {
    return resolveAssetUrl(img, aqua1);
  }
  return img;
};

const NcProjectStackFrames = ({
  images,
  project
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rawList = (project?.galleryImages && project.galleryImages.length > 0) 
    ? project.galleryImages 
    : (images || DEFAULT_IMAGES);

  const imageList = Array.isArray(rawList) && rawList.length > 0
    ? rawList.map(resolveImg)
    : DEFAULT_IMAGES;

  const frontImg = imageList[currentIndex % imageList.length];
  const backImg = imageList[(currentIndex + 1) % imageList.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <section className="w-full bg-white text-zinc-900 py-10 sm:py-14 md:py-16 px-6 sm:px-12 md:px-16 lg:px-24 font-kanit">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="relative w-full max-w-5xl pb-6 sm:pb-10 pr-4 sm:pr-8">
          
          <div className="absolute inset-0 scale-[0.91] sm:scale-[0.93] translate-x-6 sm:translate-x-2 translate-y-6 sm:translate-y-0 origin-bottom-right overflow-hidden rounded-xs border border-zinc-300 shadow-md bg-zinc-100 transition-all duration-500">
            <img
              src={backImg}
              alt="Stacked background view"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

          <div
            onClick={handleNext}
            className="relative z-10 w-full overflow-hidden rounded-xs border border-zinc-200 shadow-xl bg-white cursor-pointer group transition-all duration-500"
            title="Click to shift image"
          >
            <div className="w-full h-[320px] sm:h-[450px] md:h-[540px] lg:h-[620px] bg-zinc-100 overflow-hidden">
              <img
                key={currentIndex}
                src={frontImg}
                alt="Stacked main view" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>

        </div>

        <div className="mt-4 flex items-center justify-between w-full max-w-5xl pr-4 sm:pr-8">
          <span className="text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider font-kanit">
            IMAGE 0{((currentIndex) % imageList.length) + 1} OF 0{imageList.length}
          </span>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-[#7BA641] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded-xs transition-colors shadow-md cursor-pointer group font-kanit"
          >
            <span>NEXT IMAGE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default NcProjectStackFrames;