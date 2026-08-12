import React, { useState, useEffect } from 'react';
import { Send, Save, Loader2, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import apiClient from '../../../api/client';

const ContactRoutingSettings = () => {
  const [formData, setFormData] = useState({
    successMessage: 'Thank you! Your message has been sent successfully.',
    redirectUrl: '',
    notifyEmails: []
  });
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/cms/section/contact_routing_settings');
      if (res.data?.data?.content && Object.keys(res.data.data.content).length > 0) {
        setFormData(prev => ({ ...prev, ...res.data.data.content }));
      }
    } catch (error) {
      console.error('Failed to load routing settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await apiClient.put('/cms/section/contact_routing_settings', { content: formData });
      setMessage({ type: 'success', text: 'Lead routing settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save routing settings.' });
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 dark:text-emerald-400 animate-spin" /></div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in pb-10">
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><Send className="w-5 h-5 text-blue-600 dark:text-emerald-400" /> Lead Routing & Actions</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Configure where leads go and what users see after submission.</p>
        </div>
        <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-emerald-600 text-white rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-emerald-500 transition-colors disabled:opacity-70">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5">
        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Lead Notification Emails</label>
          <div className="flex gap-2 mb-3">
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())} placeholder="e.g. sales@naturecube.in" className="flex-1 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:border-zinc-900 dark:focus:border-emerald-500 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-emerald-400/40 outline-none transition-colors" />
            <button type="button" onClick={addEmail} className="px-4 py-2 bg-blue-50 dark:bg-emerald-950/40 text-blue-600 dark:text-emerald-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.notifyEmails.length === 0 && <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">Will use system default inbox if empty.</span>}
            {formData.notifyEmails.map(email => (
              <div key={email} className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700">
                {email} <button type="button" onClick={() => removeEmail(email)} className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Success Message</label>
          <textarea rows="2" value={formData.successMessage} onChange={e => setFormData(p => ({...p, successMessage: e.target.value}))} className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:border-zinc-900 dark:focus:border-emerald-500 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-emerald-400/40 outline-none resize-y transition-colors" placeholder="Message shown after successful submission"></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Success Redirect URL (Optional)</label>
          <input type="text" value={formData.redirectUrl} onChange={e => setFormData(p => ({...p, redirectUrl: e.target.value}))} placeholder="e.g. /thank-you" className="w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:border-zinc-900 dark:focus:border-emerald-500 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-emerald-400/40 outline-none transition-colors" />
        </div>
      </div>
    </form>
  );
};
export default ContactRoutingSettings;