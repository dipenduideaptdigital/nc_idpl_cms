import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDynamicForm } from '../dynamic-forms/useDynamicForm';

import fishImg from '../../assets/nc_mandala/fish.png';
import callIcon from '../../assets/nc_contact/call.png';
import call2Icon from '../../assets/nc_contact/call2.png';
import expIcon from '../../assets/nc_contact/experience.png';
import locIcon from '../../assets/nc_contact/location.png';
import bushBg from '../../assets/nc_logo/brush1.png';
import bushBg2 from '../../assets/nc_logo/bush3.png';

const NcContactInfo = ({ data }) => {
  const heading = data?.contactHeading || "Our Contacts";
  const subtext = data?.contactSubtext || "Ensuring the best return on investment for your bespoke SEO campaign requirement.";
  const address = data?.address || "30 B/3 Sarat Ghosh Garden Road.\nDhakuria, Kolkata, India. Pin 700031";
  const emailAddress = data?.email || "sales@naturecube.in";
  const phone1 = data?.phone1 || "+ 91-9830009691";
  const phone2 = data?.phone2 || "+ 91-9830086975";

  const cleanPhone1 = phone1.replace(/[^0-9+]/g, '');
  const cleanPhone2 = phone2 ? phone2.replace(/[^0-9+]/g, '') : '';

  // === NEW DYNAMIC FORM INTEGRATION ===
  const assignedSlug = data?.assignedFormSlug || '';
  
  const { 
    schema, settings, formData, fieldErrors, 
    status: formStatus, handleFieldChange, submitForm, resetStatus 
  } = useDynamicForm(assignedSlug);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (assignedSlug && schema) {
      // Dynamic Submission through our hook
      await submitForm();
    } else {
      // Fallback if admin hasn't assigned a form
      alert("No dynamic form assigned to this page. Please assign one from admin settings.");
    }
  };

  return (
    <section className="relative w-full bg-white text-zinc-900 pt-10 lg:mt-20 md:pt-14 pb-20 md:pb-28 font-kanit overflow-hidden">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Header Title & Floating Fish Section */}
        <div className="relative mb-10 md:mb-14">
          
          {/* Top Left Organic Watercolor Bush Image behind Our Contacts */}
          <div className="absolute -top-12 -left-20 sm:-top-20 sm:-left-28 md:-top-32 md:-left-40 lg:-top-50 lg:-left-90 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[540px] lg:h-[500px] pointer-events-none brightness-100 opacity-90 z-0 rotate-4">
            <img 
              src={bushBg} 
              alt="Bush Background" 
              className="w-full h-full object-contain transform -rotate-12" 
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

          {/* Floating Fishes from nc_mandala */}
          {/* Background Fish (Small, Blurred, Top Right) */}
          <div className="absolute right-0 sm:right-4 md:right-2 lg:right-[-10px] -top-6 sm:-top-10 md:-top-14 w-24 sm:w-32 md:w-40 lg:w-40 pointer-events-none z-10 transition-transform duration-700 hover:scale-105">
            <img 
              src={fishImg} 
              alt="NatureCube Tetra Fish Background" 
              className="w-full h-auto object-contain filter drop-shadow-sm blur-[3px] opacity-80"
            />
          </div>

          {/* Foreground Fish (Large, Sharp, Bottom Left) */}
          <div className="absolute right-12 sm:right-24 md:right-32 lg:right-40 top-2 sm:top-6 md:top-10 w-36 sm:w-52 md:w-64 lg:w-[180px] pointer-events-none z-20 transition-transform duration-700 hover:scale-105">
            <img 
              src={fishImg} 
              alt="NatureCube Tetra Fish Foreground" 
              className="w-full h-auto object-contain filter drop-shadow-xl"
            />
          </div>
        </div>

        {/* Main Floating Contact Form Box */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_15px_45px_rgba(0,0,0,0.035)] border border-zinc-100/90 p-7 sm:p-10 lg:p-14 relative z-10 overflow-hidden mb-16 md:mb-24">
          
          {/* Right Side Organic Watercolor Bush Image inside card */}
          <div className="absolute top-[-50px] right-[-50px] lg:top-[-100px] lg:right-[-100px] w-[400px] sm:w-[600px] lg:w-[620px] pointer-events-none opacity-90 z-0 transform rotate-135">
            <img 
              src={bushBg2} 
              alt="Bush Background" 
              className="w-full h-auto object-contain" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch relative z-10">

            {/* Left Form Section */}
            <div className="lg:col-span-7 flex flex-col justify-between relative z-10 pr-0 lg:pr-6">
              
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">

                {/* Glass Lighting Success Popup Modal */}
                {formStatus.state === 'success' && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-300">
                    
                    {/* The Glass Modal */}
                    <div className="relative w-full max-w-sm p-8 text-center overflow-hidden rounded-[32px] bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                      
                      {/* Subtle Lighting / Glow Effects behind the glass */}
                      <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#7BA641]/40 dark:bg-[#7BA641]/30 blur-[50px] rounded-full pointer-events-none"></div>
                      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-400/20 dark:bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                      
                      {/* Inner Glass Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/5 dark:from-white/10 dark:to-transparent pointer-events-none rounded-[32px]"></div>

                      <div className="relative z-10">
                        {/* Glowing Icon Container */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#7BA641]/20 border border-[#7BA641]/30 flex items-center justify-center shadow-[0_0_30px_rgba(123,166,65,0.3)] backdrop-blur-md">
                          <CheckCircle className="w-10 h-10 text-[#7BA641] drop-shadow-lg" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 font-kanit tracking-wide drop-shadow-sm">
                          Success!
                        </h3>
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4 leading-relaxed font-medium">
                          {formStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {formStatus.state === 'error' && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-200 dark:border-red-500/20 mb-6 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {formStatus.message}
                  </div>
                )}

                {/* Dynamic Input Fields Grid with Legacy CSS */}
                {formStatus.state === 'loading' ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                  </div>
                ) : schema?.fields ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8">
                    {schema.fields.map(field => {
                      const isFullWidth = field.type === 'textarea';
                      const hasError = !!fieldErrors[field.key];
                      const commonInputClass = `w-full bg-transparent border-b py-1.5 px-0 text-zinc-900 font-normal text-sm sm:text-base outline-none focus:border-zinc-800 transition-colors disabled:opacity-50 ${hasError ? 'border-red-400' : 'border-zinc-200'}`;

                      return (
                        <div key={field.id} className={`flex flex-col ${isFullWidth ? 'sm:col-span-2 pt-1' : ''}`}>
                          <label className="text-zinc-500 font-normal text-sm sm:text-base mb-1">
                            {field.label}{field.required && '*'}
                          </label>
                          
                          {field.type === 'textarea' ? (
                            <textarea
                              name={field.key}
                              value={formData[field.key] || ''}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
                              rows={field.rows || 2}
                              required={field.required}
                              placeholder={field.placeholder || ''}
                              disabled={formStatus.state === 'submitting'}
                              className={`${commonInputClass} resize-none`}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              name={field.key}
                              value={formData[field.key] || ''}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
                              required={field.required}
                              disabled={formStatus.state === 'submitting'}
                              className={commonInputClass}
                            >
                              <option value="" disabled hidden>{field.placeholder || 'Select...'}</option>
                              {(Array.isArray(field.options) ? field.options : []).map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type === 'phone' ? 'tel' : field.type}
                              name={field.key}
                              value={formData[field.key] || ''}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
                              required={field.required}
                              placeholder={field.placeholder || ''}
                              disabled={formStatus.state === 'submitting'}
                              className={commonInputClass}
                            />
                          )}
                          
                          {/* Field level validation errors from Zod */}
                          {hasError && (
                            <span className="text-[10px] text-red-500 mt-1 font-medium tracking-wide">
                              {fieldErrors[field.key]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 italic">No form assigned or form is currently unavailable.</p>
                )}

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={formStatus.state === 'submitting' || !schema}
                    className="bg-black hover:bg-zinc-800 text-white font-semibold text-[11px] tracking-wider uppercase px-7 py-3 rounded-full transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {formStatus.state === 'submitting' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      settings?.submitButton?.text || 'GET IN TOUCH'
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Right Card Panel */}
            <div className="lg:col-span-5 flex flex-col justify-center items-start text-left pl-0 lg:pl-10 py-4 relative z-10 mt-8 lg:mt-0">
              <h3 className="font-kanit text-4xl sm:text-5xl lg:text-[50px] font-semibold text-[#06232B] tracking-tight leading-[1.1]">
                Questions?
              </h3>
              <h3 className="font-kanit text-4xl sm:text-5xl lg:text-[50px] font-semibold text-[#06232B] tracking-tight leading-[1.1] mb-6">
                We have answers.
              </h3>

              <div className="w-24 h-[2px] bg-[#142A2C] mb-8" />

              <p className="text-[#4A3C38] text-base sm:text-lg lg:text-xl font-medium mb-1">
                Call us for fast support
              </p>
              
              <a 
                href={`tel:${cleanPhone1}`} 
                className="text-[#3B5266] font-outfit text-xl sm:text-2xl md:text-[28px] tracking-tight hover:text-[#7BA641] transition-colors inline-block"
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
                <img src={expIcon} alt="Email" className="w-12 h-12 object-contain" />
              </div>
              <a href={`mailto:${emailAddress}`} className="text-xs sm:text-sm font-outfit text-zinc-800 hover:text-[#7BA641] transition-colors">
                {emailAddress}
              </a>
            </div>

            {/* Address Contact */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#edf5e6] flex items-center justify-center shrink-0">
                <img src={locIcon} alt="Location" className="w-12 h-12 object-contain" />
              </div>
              <p className="text-xs sm:text-sm font-outfit text-zinc-800 leading-snug whitespace-pre-line">
                {address}
              </p>
            </div>

            {/* Phone Contact */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#edf5e6] flex items-center justify-center shrink-0">
                <img src={call2Icon} alt="Phone" className="w-6 h-6 object-contain" />
              </div>
              <div className="flex flex-col text-xs sm:text-sm font-outfit text-zinc-800">
                <a href={`tel:${cleanPhone1}`} className="hover:text-[#7BA641] transition-colors">{phone1}</a>
                {phone2 && <a href={`tel:${cleanPhone2}`} className="hover:text-[#7BA641] transition-colors">{phone2}</a>}
              </div>
            </div>

          </div>

          {/* Row 2: Experience Centre & Corporate Offices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-4xl">
            
            {/* Experience Centre */}
            <div className="flex flex-col">
              <h4 className="text-xl sm:text-2xl font-reem text-zinc-900 mb-3">
                Experience Centre
              </h4>
              <p className="text-zinc-500 font-light text-sm sm:text-base leading-relaxed mb-5 whitespace-pre-line">
                {address}
              </p>
              <div className="flex items-center gap-2.5">
                <img src={callIcon} alt="Phone Icon" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                <a href={`tel:${cleanPhone1}`} className="font-kanit text-base sm:text-lg text-zinc-900 hover:text-[#7BA641] transition-colors">
                  {phone1}
                </a>
              </div>
            </div>

            {/* Corporate */}
            <div className="flex flex-col">
              <h4 className="text-xl sm:text-2xl font-reem text-zinc-900 mb-3">
                Corporate
              </h4>
              <p className="text-zinc-500 font-light text-sm sm:text-base leading-relaxed mb-5 whitespace-pre-line">
                {address}
              </p>
              <div className="flex items-center gap-2.5">
                <img src={callIcon} alt="Phone Icon" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                <a href={`tel:${cleanPhone1}`} className="font-kanit text-base sm:text-lg text-zinc-900 hover:text-[#7BA641] transition-colors">
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