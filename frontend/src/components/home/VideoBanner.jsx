import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import play from '../../assets/homepage/play.jpg'
const VideoBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // You can replace this with your actual YouTube video ID
  const videoId = "ScMzIvxBSi4"; 

  return (
    <>
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-2 sm:px-8 max-w-[1400px]">
          
          {/* Video Banner Container */}
          <div className="relative w-full h-[400px] md:h-[600px] rounded-none sm:rounded-[2rem] overflow-hidden shadow-2xl group">
            
            {/* Background Image */}
            <img 
              src={play}
              alt="Office Interior Video Thumbnail" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Dark Overlays */}
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Play Button (Centered) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 hover:bg-white/40"
              >
                <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-2" fill="currentColor" />
              </button>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              
              {/* Headlines */}
              <div className="flex-1">
                <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.1] tracking-tight">
                  UNLOCK YOUR DREAM <br />
                  HOME TODAY!
                </h2>
              </div>
              
              {/* Description Paragraph */}
              <div className="md:w-1/3 md:mb-4">
                <p className="text-gray-200 text-sm md:text-base font-light leading-relaxed max-w-sm">
                  We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.
                </p>
              </div>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12">
          
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black relative">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          
        </div>
      )}
    </>
  );
};

export default VideoBanner;
