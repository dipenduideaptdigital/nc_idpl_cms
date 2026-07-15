import React from 'react';
import { Link } from 'react-router-dom';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectCard = ({ project }) => {
  const imageUrl = resolveAssetUrl(project.featuredImage?.url || project.featuredImageId, '/default-project.png');

  return (
    <Link to={`/projects/${project.slug}`} className="block">
      <div 
        className="group relative w-full mx-auto overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-zinc-900 rotate-0 opacity-100 rounded-[49px]"
        style={{
          maxWidth: '497.13px',
          height: '560px'
        }}
      >
        {/* Background Image */}
        <img 
          src={imageUrl} 
          alt={project.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
        
        {/* Info Section overlayed at bottom-left */}
        <div className="absolute bottom-12 left-12 right-12 text-left z-20 text-white select-none">
          
          {/* Title */}
          <h3 className="text-3xl lg:text-[32px] font-bold tracking-tight mb-3 font-['Outfit'] drop-shadow-sm leading-tight group-hover:text-zinc-200 transition-colors">
            {project.title}
          </h3>
          
          {/* Metadata Details */}
          <div className="flex flex-col space-y-1.5 text-base lg:text-lg text-white/80 font-normal tracking-wide">
            <span>{project.location}</span>
            <span>{project.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;