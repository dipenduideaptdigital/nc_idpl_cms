import React, { useEffect, useState } from 'react';
import NcContactBanner from '../components/nc_contact/NcContactBanner';
import NcContactInfo from '../components/nc_contact/NcContactInfo';
import NcJoinAndMap from '../components/nc_contact/NcJoinAndMap';
import useScrollAnimation from '../hooks/useScrollAnimation';
import apiClient from '../api/client';

const ContactUs = () => {
  useScrollAnimation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Contact Us | Naturecube';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    apiClient.get('/cms/section/nc_contact_page')
      .then(res => {
        if (res.data?.data?.content) setData(res.data.data.content);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#485b34]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
  }

  return (
    <div className="min-h-screen bg-white font-kanit">
      <NcContactBanner data={data} />
      <NcContactInfo data={data} />
      <NcJoinAndMap data={data} />
    </div>
  );
};

export default ContactUs;