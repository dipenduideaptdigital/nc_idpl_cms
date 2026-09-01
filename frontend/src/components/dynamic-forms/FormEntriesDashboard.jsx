import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminDynamicFormsApi } from '../../api/adminDynamicForms';
import { Inbox, MessageSquare, Loader2, AlertCircle, ArrowRight, Activity } from 'lucide-react';

//  Colors for Cards
const CARD_COLORS = [
  { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'group-hover:border-blue-500/40', shadow: 'group-hover:shadow-blue-500/10' },
  { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'group-hover:border-violet-500/40', shadow: 'group-hover:shadow-violet-500/10' },
  { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'group-hover:border-emerald-500/40', shadow: 'group-hover:shadow-emerald-500/10' },
  { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'group-hover:border-rose-500/40', shadow: 'group-hover:shadow-rose-500/10' },
  { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'group-hover:border-amber-500/40', shadow: 'group-hover:shadow-amber-500/10' },
];

const FormEntriesDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const res = await adminDynamicFormsApi.getAdminForms({ limit: 50 });
        setForms(res.data || []);
      } catch (err) {
        setError('Failed to load forms data.');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10">
      
      {/* Modern Header */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-[20px] shadow-sm border border-zinc-200/60 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Form Entries
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 font-medium">
              Monitor and manage submissions across all your dynamic forms.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-2 border border-red-200 dark:border-red-500/20">
          <AlertCircle className="w-5 h-5"/> <span className="font-semibold text-sm">{error}</span>
        </div>
      )}

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[24px] p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
          </div>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No Forms Found</p>
          <p className="text-sm text-zinc-500 mt-1 mb-4">You haven't created any dynamic forms yet.</p>
          <Link to="/admin/forms/create" className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:scale-105 inline-block">
            Create Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {forms.map((form, index) => {
            const color = CARD_COLORS[index % CARD_COLORS.length];
            const isPublished = form.status === 'PUBLISHED';

            return (
              <Link 
                key={form.id} 
                to={`/admin/forms/${form.id}/submissions`}
                className={`relative bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-[20px] p-5 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1 overflow-hidden ${color.border} ${color.shadow}`}
              >
                {/* Top Row: Icon & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color.bg} ${color.text} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                    isPublished 
                      ? 'bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200/50 dark:border-emerald-500/20' 
                      : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 border-zinc-200 dark:border-zinc-700'
                  }`}>
                    {form.status}
                  </span>
                </div>
                
                {/* Middle Row: Title & Slug */}
                <div className="mb-6">
                  <h3 className="font-extrabold text-[17px] text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors line-clamp-1">
                    {form.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                    <span className="truncate">/{form.slug}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <span>v{form.version}</span>
                  </div>
                </div>

                {/* Bottom Row: Entry Count & Arrow */}
                <div className="flex items-end justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${form._count?.submissions > 0 ? color.text : 'text-zinc-300 dark:text-zinc-700'}`} />
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
                        {form._count?.submissions || 0}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                        Entries
                      </span>
                    </div>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-all duration-300 group-hover:${color.bg} group-hover:${color.text}`}>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormEntriesDashboard;