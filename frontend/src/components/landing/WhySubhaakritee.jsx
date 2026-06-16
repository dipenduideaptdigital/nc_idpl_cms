import React from 'react';
import { Award, Home, Shield, CalendarDays, Check, Heart, Layers } from 'lucide-react';
import LOGO from '../../assets/logos/LOGO.png'
import home from '../../assets/logos/home.png'
import warranty from '../../assets/logos/warranty.png'
import calender from '../../assets/logos/calender.png'

const WhySubhaakritee = ({ data }) => {
  const features = data?.features || [
    { icon: LOGO, textLine1: '1,400+ design', textLine2: 'experts' },
    { icon: home, textLine1: '20,000+ happy', textLine2: 'customers' },
    { icon: 'ShieldCheck', textLine1: 'Up to 10-years', textLine2: 'material warranty' },
    { icon: 'CalendarDays', textLine1: '45 days or we', textLine2: 'pay you rent', extraBadge: '45\nDAYS' }
  ];

  const getIcon = (iconName, extraBadge) => {
    switch (iconName) {
      case 'Award':
      case LOGO: 
        return (
          <div className="relative mb-6 flex justify-center items-center">
            <img src={LOGO} alt="Design Experts" className="w-16 h-16 object-contain" />
          </div>
        );
      case 'Home':
      case home: 
        return (
          <div className="relative mb-6 flex justify-center items-center">
            <img src={home} alt="Happy Customers" className="w-16 h-16 object-contain" />
          </div>
        );
      case 'ShieldCheck':
      case warranty: 
        return (
          <div className="relative mb-6 flex justify-center items-center">
            <img src={warranty} alt="Warranty" className="w-16 h-16 object-contain" />
          </div>
        );
      case 'CalendarDays':
      case calender: 
        return (
          <div className="relative mb-6 flex justify-center items-center">
            <img src={calender} alt="Calendar" className="w-16 h-16 object-contain" />
            {extraBadge && (
              <div className="absolute top-[26px] flex flex-col items-center leading-none">
                <span className="text-[14px] font-bold text-red-600 tracking-tight leading-none">45</span>
                <span className="text-[8px] font-bold text-red-600 tracking-wider">DAYS</span>
              </div>
            )}
          </div>
        );
      default: 
        return (
          <div className="relative mb-6 flex justify-center items-center">
            <img src={LOGO} alt="Default" className="w-16 h-16 object-contain" />
          </div>
        );
    }
  };

  return (
    <section className="py-24 px-4 bg-white text-center">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-[40px] font-bold mb-8 text-black tracking-tight">{data?.title || 'WHY subhAAkritee?'}</h2>
        <p className="text-zinc-600 mb-20 text-[15px] md:text-base leading-[1.8] max-w-[800px] mx-auto font-medium">
          {data?.description || 'For Over 26 Years, SubhAAkritee - The Design People Has Delivered Innovative, High-Quality Interior And Architectural Solutions Across Residential And Commercial Spaces. With A Strong Presence In Kolkata, Delhi, Siliguri, And Bhubaneswar, We Transform Spaces Into Functional Works Of Art'}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {getIcon(feature.icon, feature.extraBadge)}
              <p className="text-[16px] leading-[1.4] font-semibold text-zinc-600">{feature.textLine1}<br />{feature.textLine2}</p>
            </div>
          ))}
        </div>

        <button className="bg-[#da7b2f] hover:bg-[#c46d29] text-white px-8 py-3 rounded text-[15px] font-medium transition-all shadow-sm">
          {data?.buttonText || 'Get Free Estimated'}
        </button>
      </div>
    </section>
  );
};

export default WhySubhaakritee;
