import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Layouts */
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

/* Pages */
import Home from './pages/Home';
import LandingReference from './pages/LandingReference';
import LandingContainer from './pages/LandingContainer';
import DynamicPage from './pages/DynamicPage';
import Login from './pages/Login';
import Register from './pages/Register';

/* Admin Pages */
import HomeCustomization from './pages/admin/HomeCustomization';
import PageList from './pages/admin/pages/PageList';
import PageEditor from './pages/admin/pages/PageEditor';
import ContactFormList from './pages/admin/contact-forms/ContactFormList';
import ContactFormEditor from './pages/admin/contact-forms/ContactFormEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home-customization" element={<HomeCustomization />} />
          <Route path="pages" element={<PageList />} />
          <Route path="pages/create" element={<PageEditor />} />
          <Route path="pages/edit/:id" element={<PageEditor />} />
          <Route path="contact-forms" element={<ContactFormList />} />
          <Route path="contact-forms/create" element={<ContactFormEditor />} />
          <Route path="contact-forms/edit/:id" element={<ContactFormEditor />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/hero-preview" element={<LandingReference />} />
          <Route path="/" element={<LandingContainer />} />
          <Route path="/:slug*" element={<DynamicPage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;