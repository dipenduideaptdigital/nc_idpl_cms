import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projects';
import { resolveAssetUrl } from '../../utils/assetResolver';

const ProjectShowcase = ({ currentProjectSlug }) => {
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await projectsApi.getPublicProjects({ limit: 4 }); 
        const filtered = res.data
          .filter(p => p.slug !== currentProjectSlug)
          .slice(0, 3);
        setRelatedProjects(filtered);
      } catch (err) {
        console.error("Failed to fetch related projects", err);
      }
    };
    fetchRelated();
  }, [currentProjectSlug]);

  if (relatedProjects.length === 0) return null;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1400px] py-16 md:py-24 font-sans bg-white">
      {/* Heading Section */}
      <div className="flex flex-col md:flex-row md:items-start mb-16 gap-6 md:gap-16 lg:gap-24">
        <div className="shrink-0 mt-2">
          <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full border border-zinc-200 bg-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_6px_rgba(249,115,22,0.6)]"></span>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-zinc-500 font-['Outfit']">
              GET IN TOUCH
            </span>
          </div>
        </div>
        <div className="max-w-2xl text-left">
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold font-['Outfit'] leading-[1.1] tracking-tight text-zinc-950">
            Explore <span className="text-[#3B82F6]">Our Project</span>
            <br />
            <span className="text-[#3B82F6]">Showcase</span>
          </h2>
        </div>
      </div>

      {/* 3-Column Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {relatedProjects.map((project) => (
          <Link 
            key={project.id}
            to={`/projects/${project.slug}`}
            className="group flex flex-col text-left cursor-pointer transition-all duration-300"
          >
            <div className="w-full rounded-[2.2rem] overflow-hidden aspect-[4/5] shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1.5 bg-zinc-100">
              <img 
                src={resolveAssetUrl(project.featuredImage?.url || project.featuredImageId, '/default-project.png')} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-2xl font-bold font-['Outfit'] text-zinc-950 mb-2 mt-6 group-hover:text-[#3B82F6] transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed line-clamp-2">
              {project.description || 'Improving spaces with expert craftsmanship.'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;