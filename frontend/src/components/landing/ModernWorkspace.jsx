import React from 'react';
import { Hammer, Lightbulb, Archive, Settings, Monitor, Layout, Home } from 'lucide-react';

import remodeling from '../../assets/logos/remodeling.png'
import lamp from '../../assets/logos/lamp.png'
import cabinet from '../../assets/logos/cabinet.png'
import turkey from '../../assets/logos/turkey.png'
import desk from '../../assets/logos/desk.png'
import space from '../../assets/logos/space.png'


const ModernWorkspace = ({ data }) => {
  const services = data?.services || [
    { icon: 'Home', title: 'Renovation & Upgrade', desc: 'Transforming existing offices into contemporary, high-performing spaces.' },
    { icon: 'Lightbulb', title: 'Lighting & Electrical', desc: 'Efficient lighting systems and seamless electrical planning for optimal performance.' },
    { icon: 'Archive', title: 'Custom Furniture', desc: 'Ergonomic, bespoke workstations, cabins, and storage solutions.' },
    { icon: 'Settings', title: 'Turnkey Execution', desc: 'Complete project management from concept and design to final handover.' },
    { icon: 'Monitor', title: 'Office Interiors', desc: 'Modern, brand-aligned workspace designs that balance aesthetics and functionality.' },
    { icon: 'Layout', title: 'Space Planning', desc: 'Smart layouts designed to maximize efficiency, workflow, and space utilization.' }
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Hammer':
      case 'Home':
      case remodeling:
        return <img src={remodeling} alt="Renovation" className="w-20 h-20 object-contain mb-6" />;
      case 'Lightbulb':
      case lamp:
        return <img src={lamp} alt="Lighting" className="w-20 h-20 object-contain mb-6" />;
      case 'Archive':
      case cabinet:
        return <img src={cabinet} alt="Cabinet" className="w-20 h-20 object-contain mb-6" />;
      case 'Settings':
      case turkey:
        return <img src={turkey} alt="Turnkey Execution" className="w-20 h-20 object-contain mb-6" />;
      case 'Monitor':
      case desk:
        return <img src={desk} alt="Office Interiors" className="w-20 h-20 object-contain mb-6" />;
      case 'Layout':
      case space:
        return <img src={space} alt="Space Planning" className="w-20 h-20 object-contain mb-6" />;
      default:
        return <img src={remodeling} alt="Default" className="w-20 h-20 object-contain mb-6" />;
    }
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-[1400px] text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-zinc-900 tracking-tight">
          {data?.title || 'Modern Workspace Solutions'}
        </h2>
        {data?.subtitle && (
          <p className="text-zinc-600 mb-16 text-lg md:text-xl font-medium max-w-3xl mx-auto -mt-10">
            {data.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-12 px-4 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">{service.title}</h3>
              {service.desc && (
                <p className="text-zinc-600 text-base leading-relaxed max-w-xs mx-auto">
                  {service.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernWorkspace;
