import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const teamMembers = [
  { id: '01', name: 'Mark Jackson', role: 'Co-Founder & CEO' },
  { id: '02', name: 'Valeria Novikova', role: 'Lighting Specialist' },
  { id: '03', name: 'Alex Podzemsky', role: 'Graphics Designer' },
  { id: '04', name: 'Helen Reeves', role: 'Material Consultant' },
  { id: '05', name: 'Jake Nicholson', role: '3D Visualisation' },
];

const Team = () => {
  const [activeMember, setActiveMember] = useState('01');

  return (
    <section className="py-15 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-15 gap-12">
          {/* Left: Badge */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                AMAZING DESIGN TEAM
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Meet The <span className="text-primary">Experts Our <br /> Interior</span> Designers
            </h2>
            <p className="text-gray-500 font-light text-sm leading-relaxed max-w-lg">
              Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Large Placeholder */}
          <div className="w-full h-[500px] md:h-[600px] bg-slate-300 rounded-[2.5rem] shadow-lg">
           
          </div>

          {/* Right: Team Members List */}
          <div className="flex flex-col border-t border-gray-200">
            {teamMembers.map((member) => {
              const isActive = activeMember === member.id;
              
              return (
                <div 
                  key={member.id}
                  className={`group flex items-center justify-between py-6 border-b cursor-pointer transition-colors ${
                    isActive ? 'border-primary border-b-2 border-t-2 -mt-[1px] z-10' : 'border-gray-200'
                  }`}
                  onMouseEnter={() => setActiveMember(member.id)}
                >
                  <div className="flex items-center gap-6 sm:gap-12">
                    <span className="text-sm font-medium text-gray-600 w-6">
                      {member.id}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 w-40 sm:w-48">
                      {member.name}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-light uppercase tracking-wider hidden sm:block">
                      {member.role}
                    </span>
                  </div>
                  
                  {isActive ? (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 group-hover:bg-gray-100 transition-colors">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default Team;
