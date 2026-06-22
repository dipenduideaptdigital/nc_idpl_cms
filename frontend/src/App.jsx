import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

/* Layouts */
import MainLayout from './components/layout/MainLayout';
import LandingLayout from './components/layout/LandingLayout';
import AdminLayout from './components/layout/AdminLayout';

/* Pages */
import Home from './pages/Home';
import LandingReference from './pages/LandingReference';
import LandingContainer from './pages/LandingContainer';
import DynamicPage from './pages/DynamicPage';
import PreviewPage from './pages/PreviewPage'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

/* Admin Pages */
import HomeCustomization from './pages/admin/HomeCustomization';
import PageList from './pages/admin/pages/PageList';
import PageEditor from './pages/admin/pages/PageEditor';
import ContactFormList from './pages/admin/contact-forms/ContactFormList';
import ContactFormEditor from './pages/admin/contact-forms/ContactFormEditor';
import BlogList from './pages/admin/blogs/BlogList';
import BlogEditor from './pages/admin/blogs/BlogEditor';
import TaxonomyManager from './pages/admin/blogs/TaxonomyManager';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="home-customization" element={<HomeCustomization />} />
            <Route path="pages" element={<PageList />} />
            <Route path="pages/create" element={<PageEditor />} />
            <Route path="pages/edit/:id" element={<PageEditor />} />
            <Route path="contact-forms" element={<ContactFormList />} />
            <Route path="contact-forms/create" element={<ContactFormEditor />} />
            <Route path="contact-forms/edit/:id" element={<ContactFormEditor />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/create" element={<BlogEditor />} />
            <Route path="blogs/edit/:id" element={<BlogEditor />} />
            <Route path="blogs/taxonomies" element={<TaxonomyManager />} />
          </Route>

          {/* Public Routes - Landing Pages */}
          <Route element={<LandingLayout />}>
            <Route path="/hero-preview" element={<LandingReference />} />
            <Route path="/preview/:token" element={<PreviewPage />} /> 
            <Route path="/*" element={<DynamicPage />} />
          </Route>

          {/* Public Routes - Main Pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingContainer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;