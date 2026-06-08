import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import apiClient from '../../api/client';

const defaultTeamMembers = [
  { id: '01', name: 'Mark Jackson', role: 'Co-Founder & CEO' },
  { id: '02', name: 'Valeria Novikova', role: 'Lighting Specialist' },
  { id: '03', name: 'Alex Podzemsky', role: 'Graphics Designer' },
  { id: '04', name: 'Helen Reeves', role: 'Material Consultant' },
  { id: '05', name: 'Jake Nicholson', role: '3D Visualisation' },
];

const Team = ({ data: externalData }) => {
  const [activeMember, setActiveMember] = useState('01');
  const [content, setContent] = useState(externalData || null);
  const [teamImg, setTeamImg] = useState('');

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
      if (fetchedContent.image) {
        const imgUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => { if (isMounted) setTeamImg(imgUrl); };
        img.onerror = () => { if (isMounted) setTeamImg(''); };
      } else if (isMounted) {
        setTeamImg('');
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchTeamData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_team');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch team content:', error);
      }
    };

    fetchTeamData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "AMAZING DESIGN TEAM";
  const title = content?.title || "Meet The [Experts Our \\n Interior] Designers";
  const description = content?.description || "Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors";
  const teamMembers = content?.members || defaultTeamMembers;

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 gap-8 md:gap-12">
          {/* Left: Badge */}
          <div className="fadeInLeft">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                {badgeText}
              </span>
            </div>
          </div>
          
          {/* Right: Heading & Description */}
          <div className="max-w-2xl fadeInRight">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              {renderTitle(title)}
            </h2>
            <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed max-w-lg">
              {description}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Team Photo / Slate Placeholder */}
          {teamImg ? (
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-lg fadeInLeft group">
              <img src={teamImg} alt="Interior Design Team" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ) : (
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-slate-300 rounded-[2.5rem] shadow-lg fadeInLeft"></div>
          )}

          {/* Right: Team Members List */}
          <div className="flex flex-col border-t border-gray-200 fadeInRight">
            {teamMembers.map((member, index) => {
              const memberId = member.id || `0${index + 1}`;
              const isActive = activeMember === memberId;
              
              return (
                <div 
                  key={index}
                  className={`group flex items-center justify-between py-5 md:py-6 border-b cursor-pointer transition-all duration-300 ${
                    isActive ? 'border-primary border-b-2 border-t-2 -mt-[1px] z-10' : 'border-gray-200 hover:bg-gray-50'
                  } rounded-xl px-2 -mx-2`}
                  onMouseEnter={() => setActiveMember(memberId)}
                >
                  <div className="flex items-center gap-6 sm:gap-12">
                    <span className="text-sm font-medium text-gray-600 w-6">
                      {memberId}
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