import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import heroback from '../assets/nc_home/plant_hero.jpg';
import logo from '../assets/nc_logo/naturecube.png';
import apiClient from '../api/client';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ loading: false, error: 'Invalid or missing reset token.', success: '' });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setStatus({ loading: false, error: '', success: 'Password reset successful! Redirecting...' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Failed to reset password. Token might be expired.', 
        success: '' 
      });
    }
  };

  const activeColor = '#3B82F6';
  const shadowColor = 'rgba(59,130,246,0.25)';

  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Invalid Request</h2>
        <p className="text-zinc-400 mb-6">No reset token provided in the URL.</p>
        <Link to="/login" className="px-6 py-2 bg-blue-600 rounded-full font-medium">Back to Login</Link>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-zinc-950 px-4 py-8"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.75), rgba(9, 9, 11, 0.9)), url(${heroback})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: activeColor, opacity: 0.15 }} />
      
      <div 
        className="relative w-full max-w-md backdrop-blur-2xl bg-zinc-950/45 border rounded-[2rem] p-8 text-white shadow-2xl flex flex-col items-center"
        style={{ borderColor: 'rgba(255, 255, 255, 0.08)', boxShadow: `0 0 50px ${shadowColor}` }}
      >
        <div className="flex flex-col items-center mb-8 cursor-pointer select-none">
          <Link to="/" className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto object-contain mb-2" />
          </Link>
        </div>

        <h2 className="text-2xl font-bold tracking-wide text-zinc-100 mb-6 text-center">Create New Password</h2>

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
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/60 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">Confirm Password</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${passwordsDontMatch ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-white'}`} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 bg-zinc-900/60 border rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none transition-all text-sm ${passwordsDontMatch ? 'border-red-500/50' : 'border-white/10'}`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordsDontMatch && (
              <p className="flex items-center gap-1.5 text-xs text-red-400 pl-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit" disabled={status.loading || passwordsDontMatch}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 mt-6"
            style={{ backgroundColor: activeColor, color: 'white', boxShadow: `0 4px 20px ${shadowColor}` }}
          >
            {status.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;