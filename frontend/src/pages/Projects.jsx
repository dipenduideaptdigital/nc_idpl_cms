import React, { useState, useEffect } from 'react';
import SEOHead from '../components/shared/SEOHead';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectsFilter from '../components/projects/ProjectsFilter';
import ProjectCard from '../components/projects/ProjectCard';
import { projectsApi } from '../api/projects'; // API Import

const categories = ['All', 'Residential', 'Commercial', 'Landscape', 'Interior'];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Our Projects | Subhaakritee';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Database theke fetch
    const fetchProjects = async () => {
      try {
        const res = await projectsApi.getPublicProjects();
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filtering Logic
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase()));
    }
  }, [selectedCategory, projects]);

  return (
    <div className="min-h-screen bg-white pb-24 font-['Inter']">
      <SEOHead data={{ title: 'Our Portfolio Projects | Subhaakritee', metaDescription: 'Explore our latest interior design projects.' }} type="page" />
      <ProjectsHero />
      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1728px] mt-20">
        <ProjectsFilter categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        
        {loading ? (
          <div className="text-center py-20">Loading Projects...</div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#F7F7F7] rounded-[2rem] max-w-xl mx-auto mt-12">
            <h3 className="text-xl font-bold text-black mb-2">No Projects Match</h3>
            <button onClick={() => setSelectedCategory('All')} className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider">View All Projects</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;