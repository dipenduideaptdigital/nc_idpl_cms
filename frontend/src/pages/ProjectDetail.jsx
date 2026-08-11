import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '../components/shared/SEOHead';
import NcProjectDetailHero from '../components/nc_projects/NcProjectDetailHero';
import NcProjectOverview from '../components/nc_projects/NcProjectOverview';
import NcProjectStackFrames from '../components/nc_projects/NcProjectStackFrames';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';
import NatureFooter from '../components/nature_homepage/NatureFooter';
import { projectsApi } from '../api/projects';
import apiClient from '../api/client';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ctaData, setCtaData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (slug) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const [projectRes, ctaRes] = await Promise.allSettled([
            projectsApi.getPublicProjectBySlug(slug),
            apiClient.get('/cms/section/nc_homepage_cta')
          ]);

          if (projectRes.status === 'fulfilled' && projectRes.value?.data) {
            setProject(projectRes.value.data);
          }
          if (ctaRes.status === 'fulfilled' && ctaRes.value?.data?.data?.content) {
            setCtaData(ctaRes.value.data.data.content);
          }
        } catch (err) {
          console.error("Failed to fetch project detail:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [slug]);

  const projectTitle = project?.title || "NatureCube Aquascape Project";
  const metaDescription = project?.metaDescription || project?.details?.replace(/<[^>]*>?/gm, '').substring(0, 150) || "Bespoke nature aquascape and living art project detail.";

  if (loading) {
    return (
      <div className="w-full h-screen bg-zinc-950 flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-zinc-800 border-t-[#7BA641] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-kanit flex flex-col antialiased selection:bg-[#7BA641] selection:text-white">
      <SEOHead
        data={{
          title: `${projectTitle} | NatureCube`,
          metaDescription: metaDescription
        }}
        type="page"
      />
      
      {/* Hero Section */}
      <NcProjectDetailHero project={project} />

      {/* Main Content Sections */}
      <main className="flex-grow w-full">
        <NcProjectOverview project={project} />
        <NcProjectStackFrames project={project} />
        
        <GetStartedCtaSection data={ctaData} />
      </main>

      {/* Footer */}
      <NatureFooter />
    </div>
  );
};

export default ProjectDetail;