import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Layouts */
import MainLayout from './components/layout/MainLayout';

/* Pages */
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './components/layout/AdminLayout';
import HomeCustomization from './pages/admin/HomeCustomization';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home-customization" element={<HomeCustomization />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;