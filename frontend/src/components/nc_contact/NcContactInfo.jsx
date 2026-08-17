import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../../api/client';

import fishImg from '../../assets/nc_mandala/fish.png';
import callIcon from '../../assets/nc_contact/call.png';
import call2Icon from '../../assets/nc_contact/call2.png';
import expIcon from '../../assets/nc_contact/experience.png';
import locIcon from '../../assets/nc_contact/location.png';
import bushBg from '../../assets/nc_logo/bush3.png';

const NcContactInfo = ({ data }) => {
  const heading = data?.contactHeading || "Our Contacts";
  const subtext = data?.contactSubtext || "Ensuring the best return on investment for your bespoke SEO campaign requirement.";
  const address = data?.address || "30 B/3 Sarat Ghosh Garden Road.\nDhakuria, Kolkata, India. Pin 700031";
  const emailAddress = data?.email || "sales@naturecube.in";
  const phone1 = data?.phone1 || "+ 91-9830009691";
  const phone2 = data?.phone2 || "+ 91-9830086975";

  const cleanPhone1 = phone1.replace(/[^0-9+]/g, '');
  const cleanPhone2 = phone2 ? phone2.replace(/[^0-9+]/g, '') : '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        message: formData.message
      };

      const response = await apiClient.post('/contacts/submit', payload);

      const dynamicSuccessMessage = response.data?.data?.successMessage || "Thank you! Your message has been sent successfully.";

      setStatus({ loading: false, success: dynamicSuccessMessage, error: null });
      setFormData({ name: '', email: '', phone: '', website: '', message: '' });

      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 6000);
    } catch (err) {
      console.error('Form submission failed:', err);
      let cleanError = 'Something went wrong. Please try again later.';
      if (err.response?.data?.message) {
        try {
          const parsed = JSON.parse(err.response.data.message);
          if (Array.isArray(parsed) && parsed[0]?.message) {
            cleanError = parsed[0].message;
          } else {
            cleanError = err.response.data.message;
          }
        } catch (e) {
          cleanError = err.response.data.message;
        }
      }

      if (cleanError.includes("requires at least 10 description tracking tokens")) {
        cleanError = "Your message must be at least 10 characters long.";
      }

      setStatus({
        loading: false,
        success: false,
        error: cleanError
      });
    }
  };

  return (
    <section className="relative w-full bg-white text-zinc-900 pt-10 md:pt-14 pb-20 md:pb-28 font-kanit overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Title & Floating Fish Section */}
        <div className="relative mb-10 md:mb-14">

          {/* Top Left Organic Watercolor Bush Image behind Our Contacts */}
          <div className="absolute -top-12 -left-16 w-72 sm:w-[400px] pointer-events-none opacity-90 z-0">
            <img
              src={bushBg}
              alt="Bush Background"
              className="w-full h-auto object-contain transform -rotate-12"
            />
          </div>

          <div className="max-w-md pt-2 relative z-10">
            <h2 className="font-reem-fun text-3xl sm:text-4xl lg:text-[42px] font-bold text-zinc-900 tracking-tight leading-tight mb-4">
              {heading}
            </h2>
            <p className="text-zinc-500 font-normal text-sm sm:text-base leading-relaxed max-w-sm whitespace-pre-line">
              {subtext}
            </p>
          </div>

          {/* Floating Fish Image from nc_mandala */}
          <div className="absolute right-0 sm:right-4 md:right-[-10px] -top-6 sm:-top-10 md:-top-14 w-40 sm:w-56 md:w-72 lg:w-80 pointer-events-none z-20 transition-transform duration-700 hover:scale-105">
            <img
              src={fishImg}
              alt="NatureCube Tetra Fish"
              className="w-full h-auto object-contain filter drop-shadow-md"
            />
          </div>
          <div className="absolute right-0 sm:right-4 md:right-[-180px] -top-6 sm:-top-10 md:-top-[-30px] w-40 sm:w-56 md:w-72 lg:w-70 pointer-events-none z-20 transition-transform duration-700 hover:scale-105">
            <img
              src={fishImg}
              alt="NatureCube Tetra Fish"
              className="w-full h-auto object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Main Floating Contact Form Box */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_15px_45px_rgba(0,0,0,0.035)] border border-zinc-100/90 p-7 sm:p-10 lg:p-14 relative z-10 overflow-hidden mb-16 md:mb-24">

          {/* Right Side Organic Watercolor Bush Image inside card */}
          <div className="absolute right-0 bottom-0 w-[320px] sm:w-[440px] pointer-events-none opacity-90 z-0">
            <img
              src={bushBg}
              alt="Bush Background"
              className="w-full h-auto object-contain transform rotate-12 scale-110"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch relative z-10">

            {/* Left Form Section */}
            <div className="lg:col-span-7 flex flex-col justify-between relative z-10">

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">

                {/* Status Banners */}
                {status.success && (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-emerald-200">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {status.success}
                  </div>
                )}
                {status.error && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    {status.error}
                  </div>
                )}

                {/* Input Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-8">
                  
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="text-zinc-500 font-kanit font-light text-xs sm:text-base mb-1">
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status.loading}
                      className="w-full bg-transparent border-b border-zinc-200 py-1.5 px-0 text-zinc-900 font-kanit font-light text-sm sm:text-base outline-none focus:border-zinc-800 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-zinc-500 font-kanit font-light text-xs sm:text-base mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={status.loading}
                      className="w-full bg-transparent border-b border-zinc-200 py-1.5 px-0 text-zinc-900 font-kanit font-light text-sm sm:text-base outline-none focus:border-zinc-800 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Phone No */}
                  <div className="flex flex-col">
                    <label className="text-zinc-500 font-kanit font-light text-xs sm:text-base mb-1">
                      Phone No.*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={status.loading}
                      className="w-full bg-transparent border-b border-zinc-200 py-1.5 px-0 text-zinc-900 font-kanit font-light text-sm sm:text-base outline-none focus:border-zinc-800 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Website */}
                  <div className="flex flex-col">
                    <label className="text-zinc-500 font-kanit font-light text-xs sm:text-base mb-1">
                      Website*
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={status.loading}
                      className="w-full bg-transparent border-b border-zinc-200 py-1.5 px-0 text-zinc-900 font-kanit font-light text-sm sm:text-base outline-none focus:border-zinc-800 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2 flex flex-col pt-1">
                    <label className="text-zinc-500 font-kanit font-light text-xs sm:text-base mb-1">
                      Message*
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={2}
                      required
                      disabled={status.loading}
                      className="w-full bg-transparent border-b border-zinc-200 py-1.5 px-0 text-zinc-900 font-kanit font-light text-sm sm:text-base outline-none focus:border-zinc-800 transition-colors resize-none disabled:opacity-50"
                    />
                  </div>

                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="bg-black hover:bg-zinc-800 text-white font-semibold text-[11px] tracking-wider uppercase px-7 py-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {status.loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      'GET IN TOUCH'
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Right Card Panel */}
            <div className="lg:col-span-5 flex flex-col justify-center pl-0 lg:pl-6 py-4 relative z-10">
              <h3 className="font-reem-fun text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
                Questions?
              </h3>
              <h3 className="font-reem-fun text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight mb-3">
                We have answers.
              </h3>

              <div className="w-14 h-[2px] bg-zinc-800 my-4" />

              <p className="text-zinc-600 text-xs sm:text-sm font-normal mb-0.5">
                Call us for fast support
              </p>

              <a
                href={`tel:${cleanPhone1}`}
                className="text-zinc-900 font-bold text-lg sm:text-xl md:text-2xl tracking-tight hover:text-emerald-700 transition-colors inline-block"
              >
                {phone1}
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Details Section */}
        <div className="space-y-16 md:space-y-20">

          {/* Row 1: 3 Circular Icon Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between border-b border-zinc-100 pb-12">

            {/* Email Contact */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#edf5e6] flex items-center justify-center shrink-0">
                <img src={expIcon} alt="Email" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              </div>
              <a href={`mailto:${emailAddress}`} className="font-outfit font-normal text-xs sm:text-sm text-zinc-800 hover:text-emerald-700 transition-colors break-all sm:break-normal">
                {emailAddress}
              </a>
            </div>

            {/* Address Contact */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#edf5e6] flex items-center justify-center shrink-0">
                <img src={locIcon} alt="Location" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              </div>
              <p className="font-outfit font-normal text-xs sm:text-sm text-zinc-800 leading-snug whitespace-pre-line">
                {address}
              </p>
            </div>

            {/* Phone Contact */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#edf5e6] flex items-center justify-center shrink-0">
                <img src={call2Icon} alt="Phone" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
              </div>
              <div className="flex flex-col font-outfit font-normal text-xs sm:text-sm text-zinc-800">
                <a href={`tel:${cleanPhone1}`} className="hover:text-emerald-700 transition-colors">{phone1}</a>
                {phone2 && <a href={`tel:${cleanPhone2}`} className="hover:text-emerald-700 transition-colors">{phone2}</a>}
              </div>
            </div>

          </div>

          {/* Row 2: Experience Centre & Corporate Offices Grid */}
          <div className="grid grid-cols-2 gap-4 xs:gap-6 sm:gap-10 md:gap-16 max-w-4xl">
            
            {/* Experience Centre */}
            <div className="flex flex-col">
              <h4 className="font-reem-fun text-base sm:text-lg font-bold text-zinc-900 mb-2">
                Experience Centre
              </h4>
              <p className="font-outfit font-normal text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">
                {address}
              </p>
              <div className="flex items-center gap-2">
                <img src={callIcon} alt="Phone Icon" className="w-4 h-4 object-contain" />
                <a href={`tel:${cleanPhone1}`} className="font-outfit font-normal text-sm text-zinc-900 hover:text-emerald-700 transition-colors">
                  {phone1}
                </a>
              </div>
            </div>

            {/* Corporate */}
            <div className="flex flex-col">
              <h4 className="font-reem-fun text-base sm:text-lg font-bold text-zinc-900 mb-2">
                Corporate
              </h4>
              <p className="font-outfit font-normal text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">
                {address}
              </p>
              <div className="flex items-center gap-2">
                <img src={callIcon} alt="Phone Icon" className="w-4 h-4 object-contain" />
                <a href={`tel:${cleanPhone1}`} className="font-outfit font-normal text-sm text-zinc-900 hover:text-emerald-700 transition-colors">
                  {phone1}
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default NcContactInfo;