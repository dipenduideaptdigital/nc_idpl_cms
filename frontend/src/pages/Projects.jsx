import React, { useState, useEffect } from 'react';
import SEOHead from '../components/shared/SEOHead';
import NcProjectsHero from '../components/nc_projects/NcProjectsHero';
import NcProjectsSectionHeader from '../components/nc_projects/NcProjectsSectionHeader';
import NcProjectsGrid from '../components/nc_projects/NcProjectsGrid';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';
import NatureFooter from '../components/nature_homepage/NatureFooter';
import PageRenderer from '../components/shared/PageRenderer';
import { pagesApi } from '../api/pages';
import { projectsApi } from '../api/projects';
import useScrollAnimation from '../hooks/useScrollAnimation';

const DEFAULT_CATEGORIES = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'LANDSCAPE', 'INTERIOR'];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [topBlocks, setTopBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollAnimation();

  useEffect(() => {
    document.title = 'Our Projects | NatureCube';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [projectsRes, pageRes] = await Promise.all([
          projectsApi.getPublicProjects().catch(() => ({ data: [] })),
          pagesApi.getPublicPageBySlug('projects').catch(() => ({ data: null }))
        ]);

        setProjects(projectsRes.data || []);
        setFilteredProjects(projectsRes.data || []);

        if (pageRes.data) {
          setPageData(pageRes.data);
          const allBlocks = pageRes.data.content?.blocks || [];
          setTopBlocks(allBlocks.filter(b => b.type === 'projectsBanner'));
        }
      } catch (err) {
        console.error("Data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Category Filtering Logic
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category?.toUpperCase() === selectedCategory.toUpperCase()));
    }
  }, [selectedCategory, projects]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-[#7BA641] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-kanit flex flex-col antialiased">
      <SEOHead
        data={{
          title: pageData?.metaTitle || 'Our Projects | NatureCube',
          metaDescription: pageData?.metaDescription || 'Explore our bespoke aquascape, paludarium, and living art projects.'
        }}
        type="page"
      />

      {/* Hero Section */}
      {topBlocks.length > 0 ? (
        <PageRenderer blocks={topBlocks} />
      ) : (
        <NcProjectsHero />
      )}

      <NcProjectsSectionHeader
        categories={DEFAULT_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Project Showcase Gallery Grid */}
      <NcProjectsGrid projects={filteredProjects} />

      {/* Get Started CTA Section */}
      <GetStartedCtaSection />

      {/* Nature Footer */}
      <NatureFooter />
    </div>
  );
};

export default Projects;