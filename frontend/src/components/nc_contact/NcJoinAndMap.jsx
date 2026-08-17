import React from 'react';
import teamBanner from '../../assets/nc_contact/team_banner.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const NcJoinAndMap = ({ data }) => {
  const teamImg = data?.teamBannerImage ? resolveAssetUrl(data.teamBannerImage) : teamBanner;

  const defaultMapEmbed = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117996.95037632997!2d88.26363953503943!3d22.455246413280048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277f3e8c07659%3A0x6b4458fcc3df8131!2sDhakuria%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  const mapEmbedCode = data?.mapEmbedCode || defaultMapEmbed;

  return (
    <div className="w-full font-kanit select-none">
      
      {/* Join Our Team Section */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 min-h-[340px] xs:min-h-[380px] sm:min-h-[420px] md:min-h-[480px] flex items-center overflow-hidden">
        
        {/* Background Image Container with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url(${teamImg})` }}
        >
          <div className="absolute inset-0 bg-black/25 sm:bg-black/20" />
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 w-full text-white">
          <div className="max-w-xl">
            
            {/* Title */}
            <h2 className="font-reem font-bold text-3xl xs:text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-3.5 sm:mb-5 drop-shadow-lg">
              Join Our Team
            </h2>

            {/* Description */}
            <p className="font-kanit font-normal text-xs xs:text-sm sm:text-base md:text-lg text-zinc-100/95 leading-relaxed mb-6 sm:mb-8 max-w-lg">
              We work alongside our clients as one team with a shared ambition to achieve extraordinary results, outperform the competition and redefine industries.
            </p>

            {/* Sleek CTA Button */}
            <div>
              <a
                href="#careers"
                className="inline-flex items-center justify-center bg-[#7BA641] hover:bg-[#6b9535] active:scale-95 text-white font-medium text-xs sm:text-sm tracking-widest uppercase px-8 py-3.5 sm:px-9 sm:py-4 rounded-full sm:rounded-sm transition-all duration-300 shadow-[0_4px_20px_rgba(123,166,65,0.4)] cursor-pointer"
              >
                JOIN NOW
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="w-full h-[300px] xs:h-[360px] sm:h-[450px] md:h-[520px] relative overflow-hidden bg-zinc-100">
        <div 
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: mapEmbedCode }}
        />
      </section>

    </div>
  );
};

export default NcJoinAndMap;