import React, { useState, useEffect } from 'react';
import { Save, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../api/client';
import ImageField from '../../components/admin/ImageField';

const ContactPageCustomization = () => {
  const [formData, setFormData] = useState({
    bannerTitle: 'Contact Us', bannerImage: '',
    contactHeading: 'Our Contacts', contactSubtext: 'Ensuring the best return on investment for your bespoke SEO campaign requirement.',
    address: '30 B/3 Sarat Ghosh Garden Road.\nDhakuria, Kolkata, India. Pin 700031',
    email: 'sales@naturecube.in', phone1: '+ 91-9830009691', phone2: '+ 91-9830086975',
    teamBannerImage: '', mapEmbedCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    apiClient.get('/cms/section/nc_contact_page').then(res => {
      if (res.data?.data?.content && Object.keys(res.data.data.content).length > 0) {
        setFormData(prev => ({ ...prev, ...res.data.data.content }));
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

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-20 animate-in fade-in">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> Contact Page Customization</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage texts, phones, and images for the Contact Us page.</p>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-70">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />} {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-4">
          <h2 className="font-bold text-lg border-b border-zinc-100 pb-2 mb-4">Top Banner & Texts</h2>
          <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Banner Title</label><input type="text" name="bannerTitle" value={formData.bannerTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
          <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Contact Heading</label><input type="text" name="contactHeading" value={formData.contactHeading} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
          <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Contact Subtext</label><textarea rows="2" name="contactSubtext" value={formData.contactSubtext} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl resize-none" /></div>
          
          <h2 className="font-bold text-lg border-b border-zinc-100 pb-2 mb-4 mt-6">Contact Information</h2>
          <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Address</label><textarea rows="2" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl resize-none" /></div>
          <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Phone 1</label><input type="text" name="phone1" value={formData.phone1} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
            <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Phone 2 (Optional)</label><input type="text" name="phone2" value={formData.phone2} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-6">
          <h2 className="font-bold text-lg border-b border-zinc-100 pb-2 mb-4">Images & Assets</h2>
          <div><label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Main Banner Image</label><ImageField value={formData.bannerImage} onChange={(v) => setFormData({...formData, bannerImage: v})} /></div>
          <div className="pt-4"><label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Team Join Banner Image</label><ImageField value={formData.teamBannerImage} onChange={(v) => setFormData({...formData, teamBannerImage: v})} /></div>
          
          <div className="pt-4 border-t border-zinc-100 mt-6">
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Google Map Embed Code (iFrame)</label>
            <textarea 
              rows="4" 
              name="mapEmbedCode" 
              value={formData.mapEmbedCode} 
              onChange={handleChange} 
              placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>' 
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm bg-zinc-50 font-mono text-zinc-600" 
            />
            <p className="text-xs text-zinc-400 mt-1">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy HTML and paste it here.</p>
          </div>
        </div>
      </div>
    </form>
  );
};
export default ContactPageCustomization;