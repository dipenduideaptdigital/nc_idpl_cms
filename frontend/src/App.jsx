import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Layouts */
import MainLayout from './components/layout/MainLayout';

/* Pages */
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
