import React from 'react';
import imagePath from '../../assets/aboutUs/02.png';

const PROCESS_DATA = [
  { number: '01', title: 'Concept Design', desc: 'Initial ideation and space planning.' },
  { number: '02', title: 'Space Planning', desc: 'Detailed layout and functionality.' },
  { number: '03', title: 'Design Execution', desc: 'Crafting and site management.' },
  { number: '04', title: 'Final Finishing', desc: 'Polished results and handover.' },
];

const AboutProcess = () => {
  return (
    <section className="w-full h-screen relative overflow-hidden font-helvetica">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imagePath} 
          alt="Process Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-row">
        {PROCESS_DATA.map((item, index) => (
          <div 
            key={index}
            className="group flex-1 flex flex-col justify-end p-8 lg:p-12 border-r-2 border-white/30 last:border-none my-20"
          >
            <div className="text-[60px] lg:text-[80px] font-black text-white/50 group-hover:text-[#228BFF] transition-colors duration-300 mb-4">
              {item.number}
            </div>
            
            <div className="text-white">
              <h3 className="text-[20px] lg:text-[24px] font-bold mb-2">{item.title}</h3>
              <p className="text-[14px] text-white/80 font-serif italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutProcess;