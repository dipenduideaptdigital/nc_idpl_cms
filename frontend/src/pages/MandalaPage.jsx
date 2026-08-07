import React, { useEffect, useState } from 'react';
import MandalaHorizontalScroll from '../components/nc_mandala/MandalaHorizontalScroll';
import { pagesApi } from '../api/pages';

const MandalaPage = () => {
  const [mandalaData, setMandalaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMandalaData();
  }, []);

  const fetchMandalaData = async () => {
    try {
      const res = await pagesApi.getPublicPageBySlug('mandala');
      
      if (res.data && res.data.content?.blocks) {
        const block = res.data.content.blocks.find(b => b.type === 'mandalaHorizontalScroll');
        if (block) {
          setMandalaData(block.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch Mandala page data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-[#7BA641] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white text-zinc-900 font-sans antialiased">
      <MandalaHorizontalScroll data={mandalaData} />
    </div>
  );
};

export default MandalaPage;