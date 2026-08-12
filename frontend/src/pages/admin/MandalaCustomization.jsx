import React, { useState, useEffect } from 'react';
import { Save, Layout, Type, ArrowLeft, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Edit2, Image as ImageIcon } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import TipTapEditor from '../../components/admin/TipTapEditor';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { ncPuckConfig } from '../../config/ncPuck.config';
import MediaPickerModal from '../../components/admin/MediaPickerModal';
import { resolveAssetUrl } from '../../utils/assetResolver';
import ImageField from '../../components/admin/ImageField';

const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'No content added...';
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{label}</label>}
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 dark:text-emerald-400 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
              {isOpen ? 'Close Rich Text Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
        </button>
        {isOpen && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const MandalaCustomization = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pageId, setPageId] = useState(null);
  
  const [isPuckMode, setIsPuckMode] = useState(false);
  const [activeTab, setActiveTab] = useState('panel1');

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null);

  const TABS = [
    { id: 'panel1', label: 'Panel 1 (Hero & Global)' },
    { id: 'panel2', label: 'Panel 2 (Elements)' },
    { id: 'panel3', label: 'Panel 3 (Dark Mandala)' }
  ];

  const [formData, setFormData] = useState({
    panoramic_image: "",
    p1_title: "LIVING MANDALAS",
    p1_subLine1: "A quest to",
    p1_subLine2: "expose the principles of",
    p1_subItalic: "mandala",
    p1_rightTitle: "mandalas",
    p1_rightDesc: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>",
    p1_quote: "This eternal circle of life is playing constantly in and around us.",
    p1_mandalaImage: "",
    p1_mountainImage: "",
    
    p2_titleLine1: "elements of",
    p2_titleLine2: "balance",
    p2_desc1: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>",
    p2_desc2: "<p>Lorem ipsum dolor sit amet...</p>",
    p2_patternImage: "",
    p2_branchImage: "",

    p3_title: "elements of balance",
    p3_desc: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>",
    p3_tagline1: "LIQUID LANDSCAPES MIRRORED IN MINDFUL ART,",
    p3_tagline2: "A LIVING MANDALA'S HEART.",
    p3_mandalaImage: "",
    p3_fishImage: ""
  });

  useEffect(() => {
    fetchMandalaPage();
  }, []);

  useEffect(() => {
    if (isPuckMode) {
      document.body.classList.add('puck-mode');
    } else {
      document.body.classList.remove('puck-mode');
    }
    return () => document.body.classList.remove('puck-mode');
  }, [isPuckMode]);

  const fetchMandalaPage = async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getPublicPageBySlug('mandala');
      if (res.data && res.data.content?.blocks?.length > 0) {
        setPageId(res.data.id);
        const blockData = res.data.content.blocks.find(b => b.type === 'mandalaHorizontalScroll');
        if (blockData && blockData.data) {
          setFormData(prev => ({ ...prev, ...blockData.data }));
        }
      }
    } catch (err) {
      if (err.response?.status !== 404) setError('Failed to fetch Mandala page data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTiptapChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveToServer = async (dataToSave) => {
    setSaving(true); setError(null); setSuccess(false);

    const payload = {
      title: 'Living Mandalas',
      slug: 'mandala',
      status: 'PUBLISHED',
      template: 'mandala-page',
      includeInSitemap: true,
      content: { blocks: [{ id: Date.now().toString(), type: 'mandalaHorizontalScroll', data: dataToSave }] }
    };

    try {
      if (pageId) {
        await pagesApi.updatePage(pageId, payload);
      } else {
        const res = await pagesApi.createPage(payload);
        setPageId(res.data.id);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    saveToServer(formData);
  };

  const handlePuckPublish = async (data) => {
    const block = data.content[0];
    if (block) {
      const { id, ...cleanData } = block.props;
      setFormData(cleanData);
      await saveToServer(cleanData);
    }
    setIsPuckMode(false);
  };

  const puckData = {
    content: [{ type: 'mandalaHorizontalScroll', props: { ...formData, id: 'mandala-master-block' } }],
    root: { props: { title: "Living Mandalas" } },
    zones: {}
  };

  const fieldClass = "w-full mt-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-emerald-400/40 focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors";
  const labelClass = "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900 dark:text-emerald-400" />
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">Loading Mandala engine...</p>
      </div>
    );
  }

  if (isPuckMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <button onClick={() => setIsPuckMode(false)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl font-medium shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Standard Form
          </button>
          <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Puck Visual Editor: Living Mandalas</span>
        </div>
        <div className="flex-1 overflow-y-auto min-h-[calc(100vh-70px)]">
          <Puck config={ncPuckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><Layout className="w-6 h-6 text-emerald-600 dark:text-emerald-400"/> Mandala Customization</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage Mandala Panels</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsPuckMode(true)} className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
            <Type className="w-4 h-4"/> Edit Visually
          </button>
          <button onClick={handleFormSubmit} disabled={saving} className="px-6 py-2.5 bg-zinc-900 dark:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-70">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} 
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {success && <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Changes saved successfully!</div>}
      {error && <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-2 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-zinc-900 dark:bg-emerald-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8">
            
            {activeTab === 'panel1' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Hero & Global Panoramic Image</h2>
                
                <div>
                  <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 block">Global Panoramic Grass Image</label>
                  <ImageField value={formData.panoramic_image} onChange={(url) => handleTiptapChange('panoramic_image', url)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div><label className={labelClass}>Title</label><input type="text" name="p1_title" value={formData.p1_title} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Subtitle Line 1</label><input type="text" name="p1_subLine1" value={formData.p1_subLine1} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Subtitle Line 2</label><input type="text" name="p1_subLine2" value={formData.p1_subLine2} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Subtitle Italic</label><input type="text" name="p1_subItalic" value={formData.p1_subItalic} onChange={handleInputChange} className={fieldClass} /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Mandala Artwork</label>
                    <ImageField value={formData.p1_mandalaImage} onChange={(url) => handleTiptapChange('p1_mandalaImage', url)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Mountain Decoration</label>
                    <ImageField value={formData.p1_mountainImage} onChange={(url) => handleTiptapChange('p1_mountainImage', url)} />
                  </div>
                </div>

                <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <div><label className={labelClass}>Right Box Title</label><input type="text" name="p1_rightTitle" value={formData.p1_rightTitle} onChange={handleInputChange} className={`${fieldClass} mb-4`} /></div>
                  <CollapsibleTiptap label="Right Box Description" value={formData.p1_rightDesc} onChange={v => handleTiptapChange('p1_rightDesc', v)} />
                  <div><label className={labelClass}>Bottom Quote</label><textarea rows="2" name="p1_quote" value={formData.p1_quote} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                </div>
              </div>
            )}

            {activeTab === 'panel2' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Elements of Balance (Pattern)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Title Line 1</label><input type="text" name="p2_titleLine1" value={formData.p2_titleLine1} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Title Line 2</label><input type="text" name="p2_titleLine2" value={formData.p2_titleLine2} onChange={handleInputChange} className={fieldClass} /></div>
                </div>
                <CollapsibleTiptap label="Description 1" value={formData.p2_desc1} onChange={v => handleTiptapChange('p2_desc1', v)} />
                <CollapsibleTiptap label="Description 2" value={formData.p2_desc2} onChange={v => handleTiptapChange('p2_desc2', v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Line Art Mandala Pattern</label>
                    <ImageField value={formData.p2_patternImage} onChange={(url) => handleTiptapChange('p2_patternImage', url)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Plant Branch Decor</label>
                    <ImageField value={formData.p2_branchImage} onChange={(url) => handleTiptapChange('p2_branchImage', url)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'panel3' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Elements of Balance (Dark Mandala)</h2>
                <div><label className={labelClass}>Main Title</label><input type="text" name="p3_title" value={formData.p3_title} onChange={handleInputChange} className={`${fieldClass} mb-4`} /></div>
                <CollapsibleTiptap label="Description" value={formData.p3_desc} onChange={v => handleTiptapChange('p3_desc', v)} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div><label className={labelClass}>Tagline Line 1</label><input type="text" name="p3_tagline1" value={formData.p3_tagline1} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Tagline Line 2</label><input type="text" name="p3_tagline2" value={formData.p3_tagline2} onChange={handleInputChange} className={fieldClass} /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Split Dark Mandala Image</label>
                    <ImageField value={formData.p3_mandalaImage} onChange={(url) => handleTiptapChange('p3_mandalaImage', url)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Fishes Overlay Decoration</label>
                    <ImageField value={formData.p3_fishImage} onChange={(url) => handleTiptapChange('p3_fishImage', url)} />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default MandalaCustomization;