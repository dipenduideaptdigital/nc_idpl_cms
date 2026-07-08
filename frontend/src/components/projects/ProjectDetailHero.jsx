import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectDetailHero = ({ project }) => {
  if (!project) return null;

  // Resolve Image URL
  const bgImageUrl = resolveAssetUrl(project.featuredImage?.url || project.featuredImageId, '/default-project.png');

  return (
    <div 
      className="relative w-full mx-auto flex items-center justify-center bg-zinc-950 overflow-hidden"
      style={{
        maxWidth: '1728px',
        height: '520px',
        top: '-6px',
        opacity: 1,
        transform: 'rotate(0deg)'
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ 
          backgroundImage: `url(${bgImageUrl})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Styled text & breadcrumbs */}
      <div className="relative z-10 text-center text-white px-4 mt-15 select-none">
        
        {/* Category Tag */}
        <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#3B82F6] bg-white/5 mb-6">
          {project.category}
        </span>

        {/* Project Title */}
        <h1 
          className="font-['Outfit'] mb-6 tracking-normal align-middle capitalize text-center"
          style={{
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '50px',
            lineHeight: '100%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            textShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          {project.title}
        </h1>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-center gap-3 text-xs md:text-sm font-semibold tracking-widest uppercase opacity-85">
          <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
          <span className="text-[#3B82F6] opacity-70">&gt;</span>
          <Link to="/projects" className="hover:text-[#3B82F6] transition-colors">Projects</Link>
          <span className="text-[#3B82F6] opacity-70">&gt;</span>
          <span className="text-zinc-300 font-normal">{project.title}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHero;