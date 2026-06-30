import React, { useState, useEffect } from 'react';
import SEOHead from '../components/shared/SEOHead';
import CtaSectionTwo from '../components/landing-design-2/CtaSectionTwo';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Import named layout sub-components
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectsFilter from '../components/projects/ProjectsFilter';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';

// Import local premium assets
import project1 from '../assets/homepage/project1.png';
import project2 from '../assets/homepage/project2.png';
import project3 from '../assets/homepage/project3.png';
import project4 from '../assets/homepage/project4.png';
import project5 from '../assets/homepage/project5.png';
import heroImg from '../assets/blog/hero.jpg';

const staticProjects = [
  {
    id: 1,
    category: 'Residential',
    title: 'Art Deco Revival',
    year: '2025',
    location: 'Berlin, Germany',
    description: 'Improving outdoor spaces with expert landscape layouts and natural stone paths.',
    details: 'This project focused on bringing classic art deco elements into a modern residential garden. It features custom terrazzo stepping stones, clean geometric planters, and a carefully curated palette of sub-tropical plants that highlight Kolkata\'s climate while keeping the look elegant and structured.',
    image: project1,
    client: 'Heritage Estates',
    area: '2,400 sq. ft.'
  },
  {
    id: 2,
    category: 'Commercial',
    title: 'Art Deco Revival',
    year: '2025',
    location: 'Berlin, Germany',
    description: 'A clean, uncluttered aesthetic prioritizing functionality and natural light.',
    details: 'Designed for a high-end apartment, this lounge utilizes a neutral cream-and-sand palette with oak wood details. Hidden storage walls, flush lighting panels, and premium Italian furniture create a serene, premium atmosphere focused on open space and relaxation.',
    image: project2,
    client: 'Singhal Residence',
    area: '1,800 sq. ft.'
  },
  {
    id: 3,
    category: 'Landscape',
    title: 'Art Deco Revival',
    year: '2025',
    location: 'Berlin, Germany',
    description: 'A luxury single-family home utilizing glass and concrete textures.',
    details: 'A multi-level villa featuring double-height ceiling voids, floor-to-ceiling sliding windows, and raw exposed concrete walls combined with warm teak finishes. The design bridges indoor and outdoor living, complete with private courtyard gardens.',
    image: project3,
    client: 'Dr. Sen & Family',
    area: '4,200 sq. ft.'
  },
  {
    id: 4,
    category: 'Interior',
    title: 'Art Deco Revival',
    year: '2025',
    location: 'Berlin, Germany',
    description: 'Ergonomic layouts and acoustic panelling for next-generation executive workflows.',
    details: 'A premium office suite designed for maximum productivity and quiet focus. Incorporates custom-built modular workstations, soundproof acoustic wall felt, a sleek board room with state-of-the-art presentation tech, and a vibrant break lounge.',
    image: project4,
    client: 'Apex Fintech Ltd',
    area: '5,500 sq. ft.'
  },
  {
    id: 5,
    category: 'Landscape',
    title: 'Art Deco Revival',
    year: '2025',
    location: 'Berlin, Germany',
    description: 'Stunning display fixtures and customer pathways to enhance product interaction.',
    details: 'A retail design conceptualized around immersive product journeys. Utilizing architectural concrete, custom metal hanging rods, and adjustable high-CRI spotlight systems to highlight product details and drive customer engagement.',
    image: project5,
    client: 'Lux Couture',
    area: '3,100 sq. ft.'
  },
  {
    id: 6,
    category: 'Residential',
    title: 'Art Deco Revival',
    year: '2025',
    location: 'Berlin, Germany',
    description: 'A luxury duplex penthouse with panoramic city views and warm lighting systems.',
    details: 'Features a contemporary styling layout utilizing luxury marbles and gold-brushed metal accents. Ambient lighting is hidden in drop-ceilings and skirting boards to create a sophisticated, cozy mood when the sun sets over the skyline.',
    image: project3,
    client: 'Choudhury Duplex',
    area: '3,600 sq. ft.'
  }
];

const categories = ['All', 'Residential', 'Commercial', 'Landscape', 'Interior'];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(staticProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  useScrollAnimation();

  useEffect(() => {
    document.title = 'Our Projects | Subhaakritee';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = staticProjects;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    setFilteredProjects(result);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white pb-24 font-['Inter']">
      <SEOHead 
        data={{
          title: 'Our Projects - Portfolio',
          metaDescription: 'Explore the premium interior design portfolio of Subhaakritee. Discover our residential, commercial, office, and landscape designs.'
        }} 
        type="page" 
      />

      {/* Hero Banner Component */}
      <ProjectsHero title="Projects" heroImg={heroImg} />

      {/* Main Content Area */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1728px] mt-20">
        
        {/* Search & Filter Component */}
        <ProjectsFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Projects Grid List */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#F7F7F7] rounded-[2rem] max-w-xl mx-auto mt-12">
            <h3 className="text-xl font-bold text-black mb-2">No Projects Match</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto">We couldn't find any projects matching your current filters. Try refining your category choices.</p>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Call To Action */}
      <CtaSectionTwo />

      {/* Premium Detail Modal Component */}
      {/* <ProjectDetailModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      /> */}
      

    </div>
  );
};

export default Projects;