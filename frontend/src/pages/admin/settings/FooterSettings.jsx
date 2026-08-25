import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, PanelBottom } from 'lucide-react';
import { arrayMove } from '@dnd-kit/sortable';
import apiClient from '../../../api/client';
import FooterCustomization from '../../../components/admin/FooterCustomization';

const FooterSettings = () => {
  const [footerData, setFooterData] = useState({
    description: '',
    copyrightText: '© NATURECUBE 2026. ALL RIGHTS RESERVED.',
    privacyUrl: '/privacy',
    termsUrl: '/terms',
    sitemapUrl: '/sitemap',
    address: '',
    phone: '',
    phone2: '',
    email: '',
    email2: '',
    linksTitle1: 'Column 1',
    links1: [],
    linksTitle2: 'Column 2',
    links2: [],
    socialLinks: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/cms/section/homepage_footer');
        if (res.data?.data?.content) {
          const content = res.data.data.content;
          ['links1', 'links2', 'socialLinks'].forEach(arr => {
            if (content[arr]) {
              content[arr] = content[arr].map(item => ({
                ...item,
                id: item.id || `item_${Math.random().toString(36).substr(2, 9)}`
              }));
            }
          });
          
          setFooterData(prev => ({ ...prev, ...content }));
        }
      } catch (error) {
        console.error('Failed to load footer settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFooterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (arrayName, index, field, value) => {
    setFooterData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleAddLink = (arrayName) => {
    setFooterData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), { id: `item_${Date.now()}`, label: '', url: '' }]
    }));
  };

  const handleDeleteLink = (arrayName, index) => {
    setFooterData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };

  // Generic Drag End Handler for any array
  const handleDragEnd = (arrayName, event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFooterData((prev) => {
        const items = prev[arrayName] || [];
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return { ...prev, [arrayName]: arrayMove(items, oldIndex, newIndex) };
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.put('/cms/section/homepage_footer', { content: footerData });
      setMessage({ type: 'success', text: 'Footer settings updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save footer settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <PanelBottom className="w-5 h-5 text-blue-600" /> Global Footer Settings
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage description, draggable links, and socials.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="px-6 py-2.5 bg-zinc-900 dark:bg-emerald-600 text-white rounded-xl font-semibold hover:bg-zinc-800 dark:hover:bg-emerald-500 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Footer
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />} {message.text}
        </div>
      )}

      <FooterCustomization 
        footerData={footerData}
        onChange={handleChange}
        onLinkChange={handleLinkChange}
        onAddLink={handleAddLink}
        onDeleteLink={handleDeleteLink}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default FooterSettings;