import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client'; 
import { ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const AdminSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Invalid Link</h2>
          <p className="text-zinc-500 mb-6">The setup link is invalid or missing the security token.</p>
          <Link to="/" className="text-blue-600 font-semibold hover:underline">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      setLoading(true);
      await apiClient.post('/auth/setup-admin', { token, password });
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login?mode=admin');
      }, 3000);

    } catch (err) {
      console.error("Setup Error:", err);
      setError(err.response?.data?.message || 'Failed to setup account. The link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Setup Your Account</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Welcome! Set a secure password for <br/> <strong className="text-zinc-800">{email}</strong>
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center animate-in zoom-in-95">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-emerald-800 mb-1">Account Activated!</h3>
            <p className="text-sm text-emerald-600">Redirecting you to the login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Activate Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;