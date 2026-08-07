import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import defaultGallery4 from '../../assets/nc_home/plant_hero.jpg';
import apiClient from '../../api/client';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const GetInTouch = ({ data, isModal = false, onClose }) => {
  const image = data?.image ? getAssetUrl(data.image) : defaultGallery4;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        formId: data?.formId || "cmqzjpzfz0000t00s7pd31okk"
      };

      await apiClient.post('/contacts/submit', payload);

      setStatus({ loading: false, success: true, error: null });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });

      if (isModal && onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('GetInTouch form submission failed:', err);
      setStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.message || 'Something went wrong. Please try again later.' 
      });
    }
  };

  return (
    <section className={isModal ? 'bg-white p-0 relative' : 'py-20 bg-[#F4F7F2]'}>
      <div className={`${isModal ? 'w-full' : 'container mx-auto px-8 max-w-6xl'} flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden relative`}>
        
        {/* Close Button for Modal */}
        {isModal && onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Left Form */}
        <div className={`w-full md:w-1/2 ${isModal ? 'p-8 md:p-10' : 'p-10 md:p-14'}`}>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2 font-kanit tracking-wide">
            {data?.title || 'GET IN TOUCH'}
          </h2>
          <p className="text-zinc-500 text-sm mb-8 font-kanit tracking-wider uppercase">
            {data?.subtitle || 'Our friendly team would love to hear from you.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Status Messages */}
            {status.success && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Message sent successfully!</span>
              </div>
            )}
            {status.error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  disabled={status.loading}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name" 
                  className="w-full border border-zinc-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA641]/50 transition-all bg-zinc-50/50 disabled:opacity-50" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  disabled={status.loading}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name" 
                  className="w-full border border-zinc-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA641]/50 transition-all bg-zinc-50/50 disabled:opacity-50" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                name="email"
                required
                disabled={status.loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com" 
                className="w-full border border-zinc-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA641]/50 transition-all bg-zinc-50/50 disabled:opacity-50" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">Phone Number</label>
              <div className="flex border border-zinc-200 rounded-md overflow-hidden bg-zinc-50/50 focus-within:ring-2 focus-within:ring-[#7BA641]/50 transition-all">
                <div className="flex items-center px-3 border-r border-zinc-200 bg-white">
                  <span className="text-sm text-zinc-600 mr-1">IN</span>
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  disabled={status.loading}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98316 37409" 
                  className="w-full px-4 py-3 text-sm focus:outline-none bg-transparent disabled:opacity-50" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">Message</label>
              <textarea 
                rows="4" 
                name="message"
                required
                disabled={status.loading}
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave us a message..." 
                className="w-full border border-zinc-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BA641]/50 transition-all bg-zinc-50/50 resize-none disabled:opacity-50" 
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status.loading}
              className="w-full bg-[#7BA641] hover:bg-[#6CA844] text-white font-kanit tracking-widest text-sm uppercase py-3.5 rounded-md transition-colors flex justify-center items-center gap-2 shadow-md mt-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {status.loading ? 'Sending...' : (data?.buttonText || 'Send Message')}{' '}
              {status.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <img src={image} alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white text-left font-kanit">
            <h3 className="text-2xl font-light tracking-wide mb-2">LET'S BUILD SOMETHING <span className="font-medium">GREAT.</span></h3>
            <p className="text-zinc-300 text-sm tracking-wider">Our experts are ready to turn your vision into reality.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;