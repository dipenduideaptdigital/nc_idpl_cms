import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useDynamicHead } from './hooks/useDynamicHead';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import SettingsLayout from './components/layout/SettingsLayout';
import MaintenancePage from './components/shared/MaintenancePage';

// Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminSetup = lazy(() => import('./pages/AdminSetup'));

// Public Pages
const DynamicPage = lazy(() => import('./pages/DynamicPage'));
const PreviewPage = lazy(() => import('./pages/PreviewPage')); 
const NatureHomePreview = lazy(() => import('./pages/NatureHomePreview'));
const RipplesPage = lazy(() => import('./pages/RipplesPage'));
const GulmoPage = lazy(() => import('./pages/GulmoPage'));
const PrakritiLabPage = lazy(() => import('./pages/PrakritiLabPage'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const WorkshopPage = lazy(() => import('./pages/WorkshopPage'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const NcHomeCustomization = lazy(() => import('./pages/admin/NcHomeCustomization'));
const PageList = lazy(() => import('./pages/admin/pages/PageList'));
const PageEditor = lazy(() => import('./pages/admin/pages/PageEditor'));
const ProjectList = lazy(() => import('./pages/admin/projects/ProjectList'));
const ProjectEditor = lazy(() => import('./pages/admin/projects/ProjectEditor'));
const ContactFormList = lazy(() => import('./pages/admin/contact-forms/ContactFormList'));
const ContactFormEditor = lazy(() => import('./pages/admin/contact-forms/ContactFormEditor'));
const ContactInbox = lazy(() => import('./pages/admin/contacts/ContactInbox'));
const BlogList = lazy(() => import('./pages/admin/blogs/BlogList'));
const BlogEditor = lazy(() => import('./pages/admin/blogs/BlogEditor'));
const TaxonomyManager = lazy(() => import('./pages/admin/blogs/TaxonomyManager'));
const GeneralSettings = lazy(() => import('./pages/admin/settings/GeneralSettings'));
const CmsSettings = lazy(() => import('./pages/admin/settings/CmsSettings'));
const WhatsAppSettings = lazy(() => import('./pages/admin/settings/WhatsAppSettings'));
const SystemStateSettings = lazy(() => import('./pages/admin/settings/SystemStateSettings'));
const RolesList = lazy(() => import('./pages/admin/roles/RolesList'));
const RoleEditor = lazy(() => import('./pages/admin/roles/RoleEditor'));
const UsersList = lazy(() => import('./pages/admin/users/UsersList'));
const MediaLibrary = lazy(() => import('./pages/admin/media/MediaLibrary'));

const GlobalSuspenseFallback = () => (
  <div className="min-h-[80vh] w-full flex items-center justify-center bg-[#fafafa]">
    <div className="w-10 h-10 border-4 border-zinc-200 border-t-[#3B82F6] rounded-full animate-spin"></div>
  </div>
);

function App() {
  useDynamicHead();
  const [maintenanceData, setMaintenanceData] = useState(null);

  useEffect(() => {
    const handleMaintenance = (e) => {
      const currentPath = window.location.pathname;
      
      if (
        !currentPath.startsWith('/admin') && 
        !currentPath.startsWith('/login') && 
        !currentPath.startsWith('/admin-setup')
      ) {
        setMaintenanceData(e.detail?.meta);
      }
    };

    window.addEventListener('system:maintenance', handleMaintenance);
    return () => window.removeEventListener('system:maintenance', handleMaintenance);
  }, []);

  // If maintenance mode is active, render ONLY the maintenance page
  if (maintenanceData) {
    return <MaintenancePage data={maintenanceData} />;
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<GlobalSuspenseFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="home-customization" element={<NcHomeCustomization />} />
              <Route path="pages" element={<PageList />} />
              <Route path="pages/create" element={<PageEditor />} />
              <Route path="pages/edit/:id" element={<PageEditor />} />
              <Route path="site-pages" element={<PageList />} />
              <Route path="site-pages/create" element={<PageEditor />} />
              <Route path="site-pages/edit/:id" element={<PageEditor />} />
              <Route path="services" element={<PageList />} />
              <Route path="services/create" element={<PageEditor />} />
              <Route path="services/edit/:id" element={<PageEditor />} />
              
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/create" element={<ProjectEditor />} />
              <Route path="projects/edit/:id" element={<ProjectEditor />} />
              <Route path="contact-forms" element={<ContactFormList />} />
              <Route path="contact-forms/create" element={<ContactFormEditor />} />
              <Route path="contact-forms/edit/:id" element={<ContactFormEditor />} />
              <Route path="contacts/inbox" element={<ContactInbox />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/create" element={<BlogEditor />} />
              <Route path="blogs/edit/:id" element={<BlogEditor />} />
              <Route path="blogs/taxonomies" element={<TaxonomyManager />} />
              <Route path="media" element={<MediaLibrary />} />
              
              <Route path="settings" element={<SettingsLayout />}>
                <Route path="general" element={<GeneralSettings />} />
                <Route path="users" element={<UsersList />} />
                <Route path="roles" element={<RolesList />} />
                <Route path="roles/create" element={<RoleEditor />} />
                <Route path="roles/edit/:id" element={<RoleEditor />} />
                <Route path="cms" element={<CmsSettings />} />
                <Route path="whatsapp" element={<WhatsAppSettings />} />
                <Route path="system" element={<SystemStateSettings />} />
              </Route>
            </Route>

            <Route path="/" element={<NatureHomePreview />} />

            {/* Public Routes - Inner Pages & Previews (Uses standard MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/preview/:token" element={<PreviewPage />} /> 
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/ripples" element={<RipplesPage />} />
              <Route path="/ripple" element={<RipplesPage />} />
              <Route path="/gulmo" element={<GulmoPage />} />
              <Route path="/gulmo-page" element={<GulmoPage />} />
              <Route path="/prakriti" element={<PrakritiLabPage />} />
              <Route path="/prakriti-lab" element={<PrakritiLabPage />} />
              <Route path="/workshop" element={<WorkshopPage />} />
              <Route path="/workshops" element={<WorkshopPage />} />
              
              {/* Dynamic Pages Catch-All */}
              <Route path="/*" element={<DynamicPage />} />
            </Route>
            
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;