import React from 'react';
import { PenTool, ClipboardList, UserCheck, ShieldCheck, Settings, Monitor, Map, Compass } from 'lucide-react';

import ux from '../../assets/logos/ux.png'
import build from '../../assets/logos/build.png'
import delivery from '../../assets/logos/delivery.png'

const WayWeCreate = ({ data }) => {
  const steps = data?.steps || [
    { icon: 'PenTool', title: 'Discover & Design', desc: "Understanding your vision, space, and goals." },
    { icon: 'ClipboardList', title: 'Build & Manage', desc: "Seamless execution with expert supervision and quality control." },
    { icon: 'UserCheck', title: 'Deliver & Support', desc: "On-time handover with precision finishing and continued assistance." }
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'PenTool':
      case ux:
        return <img src={ux} alt="Discover & Design" className="w-[84px] h-[84px] object-contain mb-8" />;
      case 'ClipboardList':
      case build:
        return <img src={build} alt="Build & Manage" className="w-[84px] h-[84px] object-contain mb-8" />;
      case 'UserCheck':
      case delivery:
        return <img src={delivery} alt="Deliver & Support" className="w-[84px] h-[84px] object-contain mb-8" />;
      default:
        return <img src={ux} alt="Default" className="w-[84px] h-[84px] object-contain mb-8" />;
    }
  };

  return (
    <section className="py-16 px-4 bg-[#eef4fa] text-center">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-[44px] font-bold mb-4 text-black tracking-tight">
          {data?.title || 'The Way We Create'}
        </h2>
        <p className="text-zinc-600 mb-16 text-[17px] md:text-[19px] max-w-3xl mx-auto">
          {data?.subtitle || 'Structured Planning. Precise Execution. Exceptional Results.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center p-4">
              <div className="flex items-center justify-center">
                {getIcon(step.icon)}
              </div>
              <h3 className="text-[26px] font-bold text-black mb-5 tracking-tight">{step.title}</h3>
              <p className="text-[#52525b] text-[17px] leading-[1.6] max-w-[280px] mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
        
        {data?.buttonText !== false && (
          <button className="bg-[#da7b2f] hover:bg-[#c26a25] text-white px-10 py-3.5 rounded text-[16px] font-medium transition-all shadow-sm">
            {data?.buttonText || 'Get Free Estimated'}
          </button>
        )}
      </div>
    </section>
  );
};

export default WayWeCreate;
