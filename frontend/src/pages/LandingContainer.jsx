import React, { useState, useEffect } from 'react';
import Home from './Home';
import LandingReference from './LandingReference';
import apiClient from '../api/client';
import { Loader2 } from 'lucide-react';

const LandingContainer = () => {
  const [loading, setLoading] = useState(true);
  const [landingPage, setLandingPage] = useState('default');

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_general');
        if (res.data?.success && res.data?.data?.content?.landingPage) {
          setLandingPage(res.data.data.content.landingPage);
        }
      } catch (error) {
        console.error('Failed to fetch general settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralSettings();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  return landingPage === 'reference' ? <LandingReference /> : <Home />;
};

export default LandingContainer;