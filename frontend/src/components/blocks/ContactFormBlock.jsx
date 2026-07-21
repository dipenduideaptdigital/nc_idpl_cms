import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { contactsApi } from '../../api/contacts';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  User,
  Mail,
  Phone,
  FileText,
  PenTool
} from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const ContactFormBlock = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Extract data from the Page Builder
  const { formId, formTitle, submitButtonText, redirectPath } = data || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formId) {
      setStatus('error');
      setFeedbackMsg('Configuration Error: No active Form ID is linked to this block.');
      return;
    }

    if (!executeRecaptcha) {
      setStatus('error');
      setFeedbackMsg('Security verification is still loading. Please try again in a moment.');
      return;
    }

    setStatus('loading');
    setFeedbackMsg('');

    try {
      const recaptchaToken = await executeRecaptcha('contact_form_block');
      
      // Assemble payload matching backend requirements
      const payload = {
        ...formData,
        formId: formId,
        sourcePage: location.pathname, 
        recaptchaToken
      };

      const response = await contactsApi.submitContactForm(payload);

      // Handle Success
      if (redirectPath && redirectPath.startsWith('/')) {
        navigate(redirectPath);
      } else {
        setStatus('success');
        setFeedbackMsg(response.data?.successMessage || 'Thank you! Your message has been sent.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }

    } catch (err) {
      console.error('Form submission failed:', err);
      setStatus('error');
      setFeedbackMsg(
        err.response?.data?.message || 
        'An error occurred while submitting your message. Please try again later.'
      );
    }
  };

  const activeColor = '#3B82F6';
  const shadowColor = 'rgba(59,130,246,0.25)';

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950 font-sans">
      
      {/* Background Decorative Glow Panels */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor, opacity: 0.1 }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: activeColor, opacity: 0.1 }}
      />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Main Glass Container */}
        <div 
          className="relative w-full backdrop-blur-2xl bg-zinc-950/45 border rounded-[2rem] p-8 md:p-14 text-white shadow-2xl transition-all duration-500"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.08)',
            boxShadow: `0 0 50px ${shadowColor}, inset 0 0 20px rgba(255, 255, 255, 0.02)`,
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-zinc-100 mb-4">
              {formTitle || 'Get in Touch'}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
              Fill out the form below and our team will get back to you shortly. We are here to help turn your vision into reality.
            </p>
          </div>

          {/* Feedback Messages */}
          {status === 'success' && (
            <div className="mb-8 p-4 bg-emerald-950/45 border border-emerald-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in duration-500">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-emerald-200 text-sm">{feedbackMsg}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-8 p-4 bg-red-950/45 border border-red-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in duration-500">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{feedbackMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = activeColor;
                      e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = activeColor;
                      e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = activeColor;
                      e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
                  Subject
                </label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = activeColor;
                      e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <PenTool className="absolute left-4 top-4 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 text-sm resize-y"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = activeColor;
                    e.target.style.boxShadow = `0 0 12px rgba(59,130,246,0.2)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                  }}
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-8"
              style={{
                backgroundColor: activeColor,
                color: 'white',
                boxShadow: `0 4px 20px ${shadowColor}`,
              }}
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{submitButtonText || 'Submit Inquiry'}</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-[10px] text-zinc-500 text-center mt-4 px-2 leading-relaxed">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mx-1">Privacy Policy</a> and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline mx-1">Terms of Service</a> apply.
            </p>

          </form>

        </div>
      </div>
    </section>
  );
};

export default ContactFormBlock;