import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactFormsApi } from '../../../api/contactForms';
import { Can } from '../../../components/shared/Can';
import { Inbox, Plus, Edit3, Trash2, AlertCircle, Search } from 'lucide-react';

const ContactFormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await contactFormsApi.getForms();
      setForms(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch forms:', err);
      setError('Failed to load contact forms.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      setIsDeleting(id);
      await contactFormsApi.deleteForm(id);
      setForms(forms.filter(f => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete form. It might be in use.');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredForms = forms.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-500 font-medium">Loading forms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-zinc-900" />
            Contact Forms
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Create and manage your dynamic lead capture forms.</p>
        </div>
        <Can permission="contact_form.create">
          <Link 
            to="/admin/contact-forms/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20"
          >
            <Plus className="w-4 h-4" /> Create Form
          </Link>
        </Can>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {filteredForms.length > 0 ? filteredForms.map((form) => (
                <tr key={form.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-zinc-900">{form.name}</div>
                    <div className="text-xs text-zinc-500 font-mono bg-zinc-100 px-1.5 py-0.5 rounded inline-block mt-1">/{form.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    {form.isActive ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Active</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">Disabled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                      {form._count?.submissions || 0} Leads
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      <Can permission="contact_form.edit">
                        <Link to={`/admin/contact-forms/edit/${form.id}`} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </Can>

                      <Can permission="contact_form.delete">
                        <button onClick={() => handleDelete(form.id)} disabled={isDeleting === form.id} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          {isDeleting === form.id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </Can>

                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-zinc-500 font-medium">No forms found. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactFormList;