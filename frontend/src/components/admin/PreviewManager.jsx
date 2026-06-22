import React, { useState, useEffect, useRef } from 'react';
import { Eye, Copy, Trash2, CheckCircle, ExternalLink, RefreshCw, ShieldAlert, ChevronDown } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import { blogsApi } from '../../api/blogs';

const PreviewManager = ({ id, entityType = 'page' }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const api = entityType === 'blog' ? blogsApi : pagesApi;

  useEffect(() => {
    if (id) fetchStatus();
  }, [id, entityType]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getPreviewStatus(id);
      setStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    try {
      setGenerating(true);
      const res = await api.generatePreviewLink(id);
      const generatedUrl = res.data.previewUrl;
      const finalUrl = generatedUrl;
      setStatus({ 
        isActive: true, 
        url: finalUrl, 
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      });
      setIsOpen(true);
    } catch (err) {
      alert(`Failed to generate ${entityType} preview.`);
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (e) => {
    if (e) e.preventDefault();
    if (!window.confirm("Revoke this link? Clients won't be able to view it anymore.")) return;
    try {
      setLoading(true);
      await api.revokePreviewLink(id);
      setStatus({ isActive: false });
      setIsOpen(false);
    } catch (err) {
      alert("Failed to revoke link.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (e) => {
    if (e) e.preventDefault();
    if (status?.url) {
      navigator.clipboard.writeText(status.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!id) {
    return (
      <button type="button" disabled className="px-4 py-2.5 bg-zinc-100 text-zinc-400 rounded-xl text-sm font-medium border border-zinc-200 cursor-not-allowed flex items-center gap-2">
        <Eye className="w-4 h-4" /> Save to Preview
      </button>
    );
  }

  if (loading) return <div className="w-32 h-10 animate-pulse bg-zinc-200 rounded-xl"></div>;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Trigger Button */}
      <button 
        type="button" 
        onClick={(e) => {
          e.preventDefault();
          if (status?.isActive) {
            setIsOpen(!isOpen); // Toggle dropdown if active
          } else {
            handleGenerate(e); // Generate if not active
          }
        }}
        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 shadow-sm outline-none focus:ring-2 focus:ring-amber-500/20 ${
          status?.isActive 
            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
            : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
        }`}
      >
        {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
        {status?.isActive ? 'Preview Active' : 'Generate Preview'}
        {status?.isActive && <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {/* Controlled Dropdown Menu */}
      {status?.isActive && isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Preview Controls
            </div>
            
            {/* Logic: Show URL if freshly generated, else show Regenerate option */}
            {status.url ? (
              <>
                <button 
                  type="button" 
                  onClick={copyToClipboard}
                  className="flex items-center justify-between w-full p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors text-sm text-zinc-700 font-mono overflow-hidden group/copy"
                >
                  <span className="truncate mr-2 opacity-80 group-hover/copy:opacity-100">{status.url}</span>
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> : <Copy className="w-4 h-4 text-zinc-400 shrink-0 group-hover/copy:text-zinc-600" />}
                </button>

                <div className="flex gap-2 mt-1">
                  <a 
                    href={status.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>
                  
                  <button 
                    type="button" 
                    onClick={handleRevoke}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p>Please regenerate to copy the URL again.</p>
                </div>
                
                <div className="flex gap-2 mt-1">
                  <button 
                    type="button" 
                    onClick={handleGenerate}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handleRevoke}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors border border-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                </div>
              </>
            )}
            
            <div className="text-[10px] text-zinc-500 text-center font-medium mt-1 bg-zinc-50 py-1.5 rounded-md border border-zinc-100">
              Expires: {status.expiresAt ? new Date(status.expiresAt).toLocaleString() : '24 hours from now'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewManager;