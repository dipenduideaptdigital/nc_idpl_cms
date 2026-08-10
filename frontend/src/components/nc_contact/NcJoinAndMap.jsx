import React from 'react';
import teamBanner from '../../assets/nc_contact/team_banner.png';
import { resolveAssetUrl } from '../../utils/assetResolver';

const NcJoinAndMap = ({ data }) => {
  const teamImg = data?.teamBannerImage ? resolveAssetUrl(data.teamBannerImage) : teamBanner;
  
  const defaultMapEmbed = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117996.95037632997!2d88.26363953503943!3d22.455246413280048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277f3e8c07659%3A0x6b4458fcc3df8131!2sDhakuria%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  
  const mapEmbedCode = data?.mapEmbedCode || defaultMapEmbed;

  return (
    <div className="w-full font-kanit">
      
      <section className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url(${teamImg})` }}
        >
          <div className="absolute inset-0 bg-black/35" />
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              Join Our Team
            </h2>
            <p className="text-white/95 font-normal text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              We work alongside our clients as one team with a shared ambition to achieve extraordinary results, outperform the competition and redefine industries.
            </p>
            <a
              href="#careers"
              className="inline-block bg-[#7BA641] hover:bg-[#6b9535] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-3 rounded-sm transition-colors shadow-md cursor-pointer"
            >
              JOIN NOW
            </a>
          </div>
        </div>
      </section>

      <section className="w-full h-[350px] sm:h-[450px] md:h-[520px] relative overflow-hidden bg-zinc-100">
        <div 
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: mapEmbedCode }}
        />
      </section>

    </div>
  );
};

export default NcJoinAndMap;