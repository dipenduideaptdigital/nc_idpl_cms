import React, { useState } from 'react';
import trunk from '../../assets/nc_home/trunk.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const PrakritiGetInTouchSection = ({ data }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    topic: 'Pricing',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        topic: 'Pricing',
        message: ''
      });
    }, 4000);
  };

  const badgeText = data?.badgeText || "Our dedicated team is ready to assist you.";
  const phone = data?.phone || "+ 91-9830086975";
  const heading = data?.heading || "Get in touch.";
  const subtext = data?.subtext || "Reach out to us today to schedule your personalized design consultation and start bringing your vision of nature to life.";
  const imageSrc = data?.image ? getAssetUrl(data.image) : trunk;

  return (
    <section className="relative w-full bg-[#FAFAF7] text-zinc-900 py-20 sm:py-28 lg:py-36 px-6 sm:px-12 lg:px-20 xl:px-24 overflow-hidden select-none font-kanit">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Image with Assistance Floating Pill */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[460px] aspect-[3/4] sm:aspect-[4/5] rounded-lg overflow-hidden shadow-2xl border border-zinc-200/80 bg-zinc-100">
            <img
              src={imageSrc}
              alt="Naturecube Terrarium & Aquascape"
              className="w-full h-full object-cover object-center"
            />
            
            {/* Floating Assistance Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] bg-[#FAF8F6] p-4 sm:p-4.5 rounded-2xl shadow-xl flex items-center gap-3.5 border border-white/60">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E6ECE0] flex items-center justify-center flex-shrink-0 text-[#7CA64E]">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="space-y-0.5 font-kanit">
                <p className="text-[11.5px] sm:text-xs text-[#555555] font-semibold leading-snug">
                  {badgeText}
                </p>
                <p className="text-sm sm:text-base font-extrabold text-[#1E293B] tracking-wide">
                  {phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 max-w-2xl">
          <div className="space-y-3">
            <h2 className="font-kanit font-bold text-4xl sm:text-5xl lg:text-[50px] text-[#2D1E18] tracking-tight leading-tight">
              {heading}
            </h2>
            <div 
              className="font-reem-fun text-sm sm:text-base text-[#6A6A6A] leading-relaxed max-w-xl tiptap-content"
              dangerouslySetInnerHTML={{ __html: subtext }}
            />
          </div>

          {submitted ? (
            <div className="bg-[#7BA641]/10 border border-[#7BA641]/30 p-6 rounded-xl text-center space-y-2 animate-fade-in">
              <h3 className="font-kanit font-bold text-xl text-[#7BA641]">Thank you for reaching out!</h3>
              <p className="font-kanit text-sm text-[#555555]">We have received your message and will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-sans pt-2">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#333333] tracking-wide block">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full bg-white border border-zinc-200 rounded-lg p-3.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#7BA641] focus:ring-1 focus:ring-[#7BA641] transition-all font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#333333] tracking-wide block">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full bg-white border border-zinc-200 rounded-lg p-3.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#7BA641] focus:ring-1 focus:ring-[#7BA641] transition-all font-sans"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#333333] tracking-wide block">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  className="w-full bg-white border border-zinc-200 rounded-lg p-3.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#7BA641] focus:ring-1 focus:ring-[#7BA641] transition-all font-sans"
                />
              </div>

              {/* Topics Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#333333] tracking-wide block">Topics</label>
                <div className="relative">
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full bg-white border border-zinc-200 rounded-lg p-3.5 text-sm text-zinc-800 focus:outline-none focus:border-[#7BA641] focus:ring-1 focus:ring-[#7BA641] transition-all appearance-none cursor-pointer pr-10 font-sans"
                  >
                    <option value="Pricing">Pricing</option>
                    <option value="Design Consultation">Design Consultation</option>
                    <option value="Workshop Inquiry">Workshop Inquiry</option>
                    <option value="Custom Aquascape">Custom Aquascape</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#333333] tracking-wide block">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full bg-white border border-zinc-200 rounded-lg p-3.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#7BA641] focus:ring-1 focus:ring-[#7BA641] transition-all resize-none font-sans"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 w-full">
                <button
                  type="submit"
                  className="w-full bg-[#7CA64E] hover:bg-[#6C9343] text-white font-sans font-bold py-3 px-5 sm:px-6 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group"
                >
                  <span className="text-lg font-extrabold tracking-wide pl-2">Submit</span>
                  <div className="w-10 h-10 rounded-xl bg-white text-zinc-900 flex items-center justify-center font-bold text-base shadow-xs transform group-hover:translate-x-1 transition-transform">
                    <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrakritiGetInTouchSection;