import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { contactFormsApi } from '../../../api/contactForms';
import { Can } from '../../../components/shared/Can';
import { Save, ArrowLeft, AlertCircle, Settings, Mail, Link as LinkIcon, Plus, X } from 'lucide-react';

const ContactFormEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    successMessage: 'Thank you! Your submission has been successfully processed.',
    redirectUrl: '',
    isActive: true,
    notifyEmails: []
  });

  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    if (isEditMode) fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const res = await contactFormsApi.getFormById(id);
      setFormData({
        name: res.data.name || '',
        slug: res.data.slug || '',
        successMessage: res.data.successMessage || '',
        redirectUrl: res.data.redirectUrl || '',
        isActive: res.data.isActive,
        notifyEmails: res.data.notifyEmails || []
      });
    } catch (err) {
      setError('Failed to load form data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEmail = () => {
    if (emailInput && emailInput.includes('@') && !formData.notifyEmails.includes(emailInput)) {
      setFormData(prev => ({ ...prev, notifyEmails: [...prev.notifyEmails, emailInput] }));
      setEmailInput('');
    }
  };

  const removeEmail = (email) => {
    setFormData(prev => ({ ...prev, notifyEmails: prev.notifyEmails.filter(e => e !== email) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (isEditMode) {
        await contactFormsApi.updateForm(id, formData);
      } else {
        await contactFormsApi.createForm(formData);
      }
      navigate('/admin/contact-forms');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save form. Check inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-zinc-900"></div></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/contact-forms" className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{isEditMode ? 'Edit Contact Form' : 'Create Contact Form'}</h1>
            <p className="text-zinc-500 text-sm mt-1">Configure your lead generation engine.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only" />
              <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isActive ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-zinc-700">{formData.isActive ? 'Active' : 'Disabled'}</div>
          </label>
          <Can permission={isEditMode ? 'contact_form.edit' : 'contact_form.create'}>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />} Save Form
            </button>
          </Can>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-5">
          <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Settings className="w-5 h-5 text-zinc-400" /> General Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Form Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Sales Inquiry" className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-zinc-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">System Slug <span className="text-xs text-zinc-400">(Auto-generated if blank)</span></label>
              <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="sales-inquiry" className="w-full px-4 py-2 border border-zinc-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-zinc-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Success Message</label>
              <textarea name="successMessage" rows="3" value={formData.successMessage} onChange={handleInputChange} placeholder="Message shown after submission..." className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-zinc-50 resize-y"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Success Redirect URL (Optional)</label>
              <input type="text" name="redirectUrl" value={formData.redirectUrl} onChange={handleInputChange} placeholder="e.g. /thank-you" className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-zinc-50 text-sm" />
              <p className="text-xs text-zinc-400 mt-1">If provided, users will be redirected here instead of seeing the success message.</p>
            </div>
          </div>
        </div>

        {/* Email Routing */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-5">
          <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Mail className="w-5 h-5 text-zinc-400" /> Email Routing (Notifications)
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">Whenever someone fills this specific form, notification emails will be sent to the addresses below.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                placeholder="e.g. sales@company.com" 
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-zinc-50 text-sm" 
              />
              <button type="button" onClick={addEmail} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.notifyEmails.length === 0 && <span className="text-xs text-zinc-400 italic">No specific emails set. Will use system default.</span>}
              {formData.notifyEmails.map((email, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-800 rounded-lg text-sm border border-zinc-200">
                  {email}
                  <button type="button" onClick={() => removeEmail(email)} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactFormEditor;