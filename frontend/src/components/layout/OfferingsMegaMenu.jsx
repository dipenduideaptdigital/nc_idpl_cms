import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import rippleTankImg from '../../assets/nc_mandala/ripple_tank.png';
import gulmoTankImg from '../../assets/nc_mandala/gulmo_tank.png';

const OfferingsMegaMenu = ({ onClose }) => {
  const [dynamicLinks, setDynamicLinks] = useState({
    ripple: '/ripples',
    gulmo: '/gulmo',
    prakriti: '/prakriti-lab',
    workshop: '/workshop'
  });

  useEffect(() => {
    const fetchDynamicSlugs = async () => {
      try {
        const res = await apiClient.get('/pages/public'); 
        const pages = res.data?.data || res.data || [];

        const newLinks = { ...dynamicLinks };

        pages.forEach(page => {
          if (page.template === 'ripple-page') newLinks.ripple = `/${page.slug}`;
          if (page.template === 'gulmo-page') newLinks.gulmo = `/${page.slug}`;
          if (page.template === 'prakriti-page') newLinks.prakriti = `/${page.slug}`;
          if (page.template === 'workshop-page') newLinks.workshop = `/${page.slug}`;
        });

        setDynamicLinks(newLinks);
      } catch (error) {
        console.error("Failed to fetch dynamic slugs for mega menu", error);
      }
    };

    fetchDynamicSlugs();
  }, []);

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-[100] w-[620px] sm:w-[680px] pointer-events-auto font-kanit text-zinc-900 select-none">
      
      <div className="bg-white rounded-md shadow-[0_15px_40px_rgba(0,0,0,0.18)] border border-zinc-100 p-5 sm:p-6 flex flex-row gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
        
        <div className="w-1/2 flex flex-col gap-4">
          
          {/* Dynamic Ripple Link */}
          <Link
            to={dynamicLinks.ripple}
            onClick={onClose}
            className="flex items-center bg-[#EDF3EE] hover:bg-[#E3EDE5] rounded-sm overflow-hidden transition-all duration-300 group cursor-pointer h-24 sm:h-28"
          >
            <div className="w-24 sm:w-28 h-full flex-shrink-0 relative overflow-hidden">
              <img
                src={rippleTankImg}
                alt="Ripple Aquascape"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <span className="font-kanit font-normal text-base sm:text-lg text-zinc-800 group-hover:text-[#7BA641] transition-colors">
                Ripple
              </span>
            </div>
          </Link>

          {/* Dynamic Gulmo Link */}
          <Link
            to={dynamicLinks.gulmo}
            onClick={onClose}
            className="flex items-center bg-[#EDF3EE] hover:bg-[#E3EDE5] rounded-sm overflow-hidden transition-all duration-300 group cursor-pointer h-24 sm:h-28"
          >
            <div className="w-24 sm:w-28 h-full flex-shrink-0 relative overflow-hidden">
              <img
                src={gulmoTankImg}
                alt="Gulmo Terrarium"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <span className="font-kanit font-normal text-base sm:text-lg text-zinc-800 group-hover:text-[#7BA641] transition-colors">
                Gulmo
              </span>
            </div>
          </Link>

        </div>

        {/* Right Column: Prakriti LAB, Workshop & Description */}
        <div className="w-1/2 bg-[#EDF3EE] rounded-sm p-6 flex flex-col justify-between">
          
          <div className="space-y-2">
            {/* Dynamic Prakriti LAB Link */}
            <Link
              to={dynamicLinks.prakriti}
              onClick={onClose}
              className="block font-kanit font-normal text-base sm:text-lg text-zinc-800 hover:text-[#7BA641] transition-colors"
            >
              Prakriti LAB
            </Link>

            {/* Dynamic Workshop Link */}
            <Link
              to={dynamicLinks.workshop}
              onClick={onClose}
              className="block font-kanit font-normal text-base sm:text-lg text-zinc-800 hover:text-[#7BA641] transition-colors"
            >
              Workshop
            </Link>
          </div>

          <p className="font-kanit text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed pt-6">
            Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments.
          </p>

        </div>

      </div>
    </div>
  );
};

export default OfferingsMegaMenu;