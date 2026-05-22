import React from 'react';
import { Settings } from 'lucide-react';
import view from '../../assets/homepage/view.jpg'
const Panoramas = () => {
  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl flex flex-col items-center">
        
        {/* Centered Header Section */}
        <div className="flex flex-col items-center text-center mb-16 opal-move-up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
              360-DEGREE PANORAMAS
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] max-w-3xl">
            Create An Even <span className="text-primary">Greater <br /> Experience</span>
          </h2>
        </div>

        {/* Panoramic Image */}
        <div className="relative w-full max-w-6xl h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl opal-move-up">
          <img 
            src={view}
            className="w-full h-full object-cover object-center"
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