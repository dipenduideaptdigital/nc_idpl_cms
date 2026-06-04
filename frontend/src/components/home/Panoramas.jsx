import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import defaultView from '../../assets/homepage/view.jpg';
import apiClient from '../../api/client';

const Panoramas = ({ data: externalData }) => {
  const [content, setContent] = useState(externalData || null);
  const [panoramaImg, setPanoramaImg] = useState(defaultView);

  useEffect(() => {
    let isMounted = true;

    const processContent = (fetchedContent) => {
      if (isMounted) setContent(fetchedContent);
      const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
      if (fetchedContent.image) {
        const imgUrl = fetchedContent.image.startsWith('http') ? fetchedContent.image : `${serverUrl}${fetchedContent.image}`;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => { if (isMounted) setPanoramaImg(imgUrl); };
        img.onerror = () => { if (isMounted) setPanoramaImg(defaultView); };
      } else if (isMounted) {
        setPanoramaImg(defaultView);
      }
    };

    if (externalData) {
      processContent(externalData);
      return () => { isMounted = false; };
    }

    const fetchPanoramasData = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_panoramas');
        const { data } = res;
        if (data.success && data.data?.content) {
          processContent(data.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch panoramas content:', error);
      }
    };

    fetchPanoramasData();

    return () => {
      isMounted = false;
    };
  }, [externalData]);

  const badgeText = content?.badgeText || "360-DEGREE PANORAMAS";
  const title = content?.title || "Create An Even [Greater \\n Experience]";

  const renderTitle = (titleText) => {
    if (!titleText) return null;
    const parts = titleText.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={index} className="text-primary">
            {part.slice(1, -1).split(/\\n|\n/).map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part.split(/\\n|\n/).map((line, lIdx, arr) => (
        <React.Fragment key={lIdx}>
          {line}
          {lIdx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl flex flex-col items-center">
        
        {/* Centered Header Section */}
        <div className="flex flex-col items-center text-center mb-16 opal-move-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
              {badgeText}
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] max-w-3xl">
            {renderTitle(title)}
          </h2>
        </div>

        {/* Panoramic Image */}
        <div className="relative w-full max-w-6xl h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl opal-move-up">
          <img 
            src={panoramaImg}
            alt="360 Panoramic View"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              if (e.currentTarget.src !== defaultView) {
                e.currentTarget.src = defaultView;
              }
            }}
          />
          
          {/* Settings Icon */}
          <div className="absolute bottom-8 right-8 cursor-pointer hover:rotate-90 transition-transform duration-500">
            <Settings className="w-10 h-10 text-white opacity-90" strokeWidth={2.5} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Panoramas;