import React, { useState, useEffect } from 'react';
import { Save, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../api/client';
import ImageField from '../../components/admin/ImageField';

const ContactPageCustomization = () => {
  const [formData, setFormData] = useState({
    assignedFormSlug: '',
    bannerTitle: 'Contact Us', bannerImage: '',
    contactHeading: 'Our Contacts', contactSubtext: 'Ensuring the best return on investment for your bespoke SEO campaign requirement.',
    address: '30 B/3 Sarat Ghosh Garden Road.\nDhakuria, Kolkata, India. Pin 700031',
    email: 'sales@naturecube.in', phone1: '+ 91-9830009691', phone2: '+ 91-9830086975',
    teamBannerImage: '', mapEmbedCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [publishedForms, setPublishedForms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      apiClient.get('/cms/section/nc_contact_page'),
      apiClient.get('/admin/dynamic-forms/published-list')
    ]).then(([pageRes, formsRes]) => {
      if (pageRes.data?.data?.content && Object.keys(pageRes.data?.data?.content).length > 0) {
        setFormData(prev => ({ ...prev, ...pageRes.data.data.content }));
      }
      if (formsRes.data?.data) {
        setPublishedForms(formsRes.data.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      await apiClient.put('/cms/section/nc_contact_page', { content: formData });
      setMessage({ type: 'success', text: 'Contact Page updated successfully!' });
    } catch (err) { setMessage({ type: 'error', text: 'Failed to save changes.' }); } 
    finally { setSaving(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fieldClass = "w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 focus:border-blue-400 dark:focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1";

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-900 dark:text-blue-400" /></div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-20 animate-in fade-in">
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Contact Page Customization</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage texts, phones, and images for the Contact Us page.</p>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-blue-600 text-white rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-blue-500 transition-colors disabled:opacity-70">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />} {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
          <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Dynamic Form Assignment</h2>
          <div>
            <label className={labelClass}>Select Form for Contact Page</label>
            <select name="assignedFormSlug" value={formData.assignedFormSlug} onChange={handleChange} className={fieldClass}>
              <option value="">Fallback Form</option>
              {publishedForms.map(f => (
                <option key={f.id} value={f.slug}>{f.title} (/{f.slug})</option>
              ))}
            </select>
            <p className="text-[10px] text-zinc-500 mt-1">Fields from this form will be dynamically injected into the contact page UI.</p>
          </div>

          <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 mt-6 text-zinc-900 dark:text-zinc-100">Top Banner & Texts</h2>
          <div><label className={labelClass}>Banner Title</label><input type="text" name="bannerTitle" value={formData.bannerTitle} onChange={handleChange} className={fieldClass} /></div>
          <div><label className={labelClass}>Contact Heading</label><input type="text" name="contactHeading" value={formData.contactHeading} onChange={handleChange} className={fieldClass} /></div>
          <div><label className={labelClass}>Contact Subtext</label><textarea rows="2" name="contactSubtext" value={formData.contactSubtext} onChange={handleChange} className={`${fieldClass} resize-none`} /></div>
          
          <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 mt-6 text-zinc-900 dark:text-zinc-100">Contact Information</h2>
          <div><label className={labelClass}>Address</label><textarea rows="2" name="address" value={formData.address} onChange={handleChange} className={`${fieldClass} resize-none`} /></div>
          <div><label className={labelClass}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Phone 1</label><input type="text" name="phone1" value={formData.phone1} onChange={handleChange} className={fieldClass} /></div>
            <div><label className={labelClass}>Phone 2 (Optional)</label><input type="text" name="phone2" value={formData.phone2} onChange={handleChange} className={fieldClass} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6">
          <h2 className="font-bold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Images & Assets</h2>
          <div><label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Main Banner Image</label><ImageField value={formData.bannerImage} onChange={(v) => setFormData({...formData, bannerImage: v})} /></div>
          <div className="pt-4"><label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Team Join Banner Image</label><ImageField value={formData.teamBannerImage} onChange={(v) => setFormData({...formData, teamBannerImage: v})} /></div>
          
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
            <label className={labelClass}>Google Map Embed Code (iFrame)</label>
            <textarea 
              rows="4" 
              name="mapEmbedCode" 
              value={formData.mapEmbedCode} 
              onChange={handleChange} 
              placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>' 
              className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 focus:border-blue-400 dark:focus:border-blue-500 transition-colors text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono placeholder-zinc-400 dark:placeholder-zinc-500" 
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy HTML and paste it here.</p>
          </div>
        </div>
      </div>
    </form>
  );
};
export default ContactPageCustomization;