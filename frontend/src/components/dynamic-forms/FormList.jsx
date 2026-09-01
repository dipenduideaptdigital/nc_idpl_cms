import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminDynamicFormsApi } from '../../api/adminDynamicForms';
import { FilePlus, Edit3, Trash2, LayoutList, Loader2, AlertCircle } from 'lucide-react';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await adminDynamicFormsApi.getAdminForms();
      setForms(res.data || []);
    } catch (err) {
      setError('Failed to load forms.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <LayoutList className="w-6 h-6 text-emerald-600" /> Manage Forms
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Create and manage your dynamic forms.</p>
        </div>
        
        <Link to="/admin/forms/create" className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
          <FilePlus className="w-4 h-4" /> Create Form
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase">Form Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase">Slug / Shortcode</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-500 uppercase">Entries</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {forms.length === 0 ? (
               <tr><td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No forms found. Create your first form!</td></tr>
            ) : forms.map((form) => (
              <tr key={form.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">
                  {form.title} <span className="text-[10px] text-zinc-400 font-mono ml-2">v{form.version}</span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-zinc-500">{form.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${form.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {form.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-zinc-700 dark:text-zinc-300">
                  {form._count.submissions}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/forms/edit/${form.id}`} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Form">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete (Coming Soon)">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormList;