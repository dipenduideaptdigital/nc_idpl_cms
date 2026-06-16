import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import defaultGallery4 from '../../assets/homepage/gallery4.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const GetInTouch = ({ data }) => {
  const image = data?.image ? getAssetUrl(data.image) : defaultGallery4;

  return (
    <section className="py-20 bg-[#eef6fc]">
      <div className="container mx-auto px-8 max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Left Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {data?.title || 'Get In Touch'}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {data?.subtitle || 'Our friendly team would love to hear from you.'}
          </p>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">First Name</label>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c87632]/50 transition-all bg-gray-50/50" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c87632]/50 transition-all bg-gray-50/50" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c87632]/50 transition-all bg-gray-50/50" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
              <div className="flex border border-gray-200 rounded-md overflow-hidden bg-gray-50/50 focus-within:ring-2 focus-within:ring-[#c87632]/50 transition-all">
                <div className="flex items-center px-3 border-r border-gray-200 bg-white">
                  <span className="text-sm text-gray-600 mr-1">US</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Message</label>
              <textarea 
                rows="4" 
                placeholder="Leave us a message..." 
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c87632]/50 transition-all bg-gray-50/50 resize-none" 
              ></textarea>
            </div>

            <button 
              type="button"
              className="w-full bg-[#cd7f32] hover:bg-orange-700 text-white font-semibold py-3.5 rounded-md transition-colors flex justify-center items-center gap-2 shadow-md mt-2"
            >
              {data?.buttonText || 'Send Message'} <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <img src={image} alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h3 className="text-2xl font-bold mb-2">Let's build something great.</h3>
            <p className="text-gray-200 text-sm">Our experts are ready to turn your vision into reality.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
