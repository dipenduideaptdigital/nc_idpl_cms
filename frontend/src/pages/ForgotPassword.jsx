import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'; 
import heroback from '../assets/homepage/banner_back.png';
import logo from '../assets/logos/logo2.svg';
import apiClient from '../api/client';

const ForgotPassword = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    if (!executeRecaptcha) {
      setStatus({ loading: false, error: 'Security verification is loading...', success: '' });
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('forgot_password');
      
      const payload = { email, recaptchaToken };
      const res = await apiClient.post('/auth/forgot-password', payload);
      
      setStatus({ 
        loading: false, 
        error: '', 
        success: res.data?.message || 'If an account exists, a reset link has been sent to your email.' 
      });
      setEmail('');
    } catch (err) {
      setStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Failed to send reset link.', 
        success: '' 
      });
    }
  };

  const activeColor = '#3B82F6';
  const shadowColor = 'rgba(59,130,246,0.25)';

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-zinc-950 px-4 py-8"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.75), rgba(9, 9, 11, 0.9)), url(${heroback})`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: activeColor, opacity: 0.15 }} />
      
      <div 
        className="relative w-full max-w-md backdrop-blur-2xl bg-zinc-950/45 border rounded-[2rem] p-8 text-white shadow-2xl flex flex-col items-center"
        style={{ borderColor: 'rgba(255, 255, 255, 0.08)', boxShadow: `0 0 50px ${shadowColor}` }}
      >
        <div className="flex flex-col items-center mb-8 cursor-pointer select-none">
          <Link to="/" className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto object-contain mb-2" />
            <div className="text-[9px] tracking-[0.22em] uppercase opacity-60">The Design People</div>
          </Link>
        </div>

        <h2 className="text-2xl font-bold tracking-wide text-zinc-100 mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-zinc-400 text-center mb-6">Enter your email and we'll send you instructions to reset your password.</p>

        {status.error && (
          <div className="w-full flex items-start gap-3 bg-red-950/45 border border-red-500/30 text-red-200 text-sm p-4 rounded-2xl mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /><span>{status.error}</span>
          </div>
        )}

        {status.success && (
          <div className="w-full flex items-start gap-3 bg-emerald-950/45 border border-emerald-500/30 text-emerald-200 text-sm p-4 rounded-2xl mb-6">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /><span>{status.success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit" disabled={status.loading}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 mt-6"
            style={{ backgroundColor: activeColor, color: 'white', boxShadow: `0 4px 20px ${shadowColor}` }}
          >
            {status.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Send Reset Link</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-400">
          Remember your password? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;