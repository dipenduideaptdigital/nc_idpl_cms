import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/shared/SEOHead';
import ProjectDetailHero from '../components/projects/ProjectDetailHero';
import ProjectSpecs from '../components/projects/ProjectSpecs';
import ProjectDesignDetails from '../components/projects/ProjectDesignDetails';
import ProjectCarousel from '../components/projects/ProjectCarousel';
import ProjectShowcase from '../components/projects/ProjectShowcase';
import { projectsApi } from '../api/projects';
import { ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const fetchProject = async () => {
      try {
        const res = await projectsApi.getPublicProjectBySlug(slug);
        setProject(res.data);
        document.title = `${res.data.title} | Subhaakritee`;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!project) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-semibold text-zinc-800 mb-2">Project Not Found</h2>
        <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-full">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-['Inter']">
      <SEOHead 
        data={{
          title: `${project.title} - ${project.category} Design`,
          metaDescription: project.description
        }} 
      />
      <ProjectDetailHero project={project} />
      <ProjectSpecs project={project} />
      <ProjectDesignDetails project={project} />
      <ProjectCarousel />
      <ProjectShowcase currentProjectSlug={slug} />
    </div>
  );
};

export default ProjectDetail;