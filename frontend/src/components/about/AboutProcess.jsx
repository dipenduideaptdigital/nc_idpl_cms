import React from 'react';
import imagePath from '../../assets/aboutUs/02.png';

const PROCESS_DATA = [
  { number: '01', title: 'Vision', desc: 'To create timeless, inspiring spaces that seamlessly blend design excellence, functionality, and the unique aspirations of every client.' },
  { number: '02', title: 'Purpose', desc: 'To deliver innovative architectural and interior design solutions that combine creativity, technical expertise, and seamless execution, creating functional, elegant spaces that truly reflect our clients’ needs and aspirations.' },
  { number: '03', title: 'Philosophy', desc: 'Great design is more than aesthetics—it creates spaces that are functional,timeless, and enriching to everyday life .' },
  { number: '04', title: 'Our Promise', desc: 'To deliver complete architecture and interior solutions that enhance everyday living—on time, with the quality we promise.' },
];

const AboutProcess = () => {
  const borderClasses = [
    'border-r border-b border-white/20 lg:border-b-0 lg:border-r-2 lg:border-white/30',
    'border-b border-white/20 lg:border-b-0 lg:border-r-2 lg:border-white/30',
    'border-r border-white/20 lg:border-r-2 lg:border-white/30',
    'border-none'
  ];

  return (
    <section className="w-full h-auto lg:h-screen relative overflow-hidden font-['Outfit',sans-serif] py-12 sm:py-16 lg:py-0 flex flex-col justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imagePath} 
          alt="Process Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full grid grid-cols-2 lg:flex lg:flex-row lg:h-full">
        {PROCESS_DATA.map((item, index) => (
          <div 
            key={index}
            className={`group flex-1 flex flex-col justify-end p-6 sm:p-8 lg:p-12 h-[230px] xs:h-[260px] md:h-[290px] lg:h-auto my-2 lg:my-20 ${borderClasses[index]}`}
          >
            <div className="font-['Outfit',sans-serif] text-[48px] sm:text-[60px] lg:text-[80px] font-black text-white/50 group-hover:text-[#228BFF] transition-colors duration-300 mb-2 lg:mb-4">
              {item.number}
            </div>
            
            <div className="text-white font-['Outfit',sans-serif]">
              <h3 className="text-[18px] lg:text-[24px] font-bold mb-1 lg:mb-2">{item.title}</h3>
              <p className="text-[12px] lg:text-[14px] text-white/80 italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutProcess;