import React, { useState, useEffect } from 'react';
import { Save, Layout, Type, ArrowLeft, Loader2, CheckCircle, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp, Edit2, Image as ImageIcon } from 'lucide-react';
import { pagesApi } from '../../api/pages';
import TipTapEditor from '../../components/admin/TipTapEditor';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { ncPuckConfig } from '../../config/ncPuck.config';
import ImageField from '../../components/admin/ImageField';

// Tiptap Wrapper
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
            <Edit2 className="w-4 h-4 text-zinc-500 dark:text-blue-400 shrink-0" />
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

// Main Component
const AboutCustomization = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pageId, setPageId] = useState(null);
  
  const [isPuckMode, setIsPuckMode] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  const TABS = [
    { id: 'hero', label: 'Hero & Panoramic' },
    { id: 'journey', label: 'Journey' },
    { id: 'awards', label: 'Awards' },
    { id: 'history', label: 'History' },
    { id: 'seminars', label: 'Seminars' },
    { id: 'ripples', label: 'Ripples' },
    { id: 'brands', label: 'Brands & Showcase' },
    { id: 'team', label: 'Mentor & Team' }
  ];

  const [formData, setFormData] = useState({
    hero_isVisible: true,
    journey_isVisible: true,
    awards_isVisible: true,
    history_isVisible: true,
    seminars_isVisible: true,
    ripples_isVisible: true,
    brands_isVisible: true,
    team_isVisible: true,
    hero_headlineLine1: "LOOK DEEP INTO NATURE, AND THEN YOU WILL",
    hero_headlineLine2: "UNDERSTAND EVERYTHING BETTER",
    hero_subtext: "We are evolving the landscape of how nature and science bringing peace in your inner world.",
    hero_yearsExp: "25+",
    hero_sinceYear: "SINCE 2010",
    hero_clientCount: "+100K SATISFIED CLIENTS",
    
    journey_heading: "BORN FROM A CHILDHOOD FASCINATION WITH LOCAL WATERBODIES...",
    journey_paragraph1: "<p>EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING...</p>",
    journey_paragraph2: "<p>WITH A COMMITMENT TO ETHICAL BUSINESS PRACTICES...</p>",
    
    awards_headingLine1: "THE AWARDS WON",
    awards_headingLine2: "BY OUR PROJECTS.",
    awards_subtext: "Evolving from artificial decor to natural aquascaping...",
    awards_list: [],

    history_title: "OUR HISTORY",
    history_smallText: "EVOLVING FROM ARTIFICIAL DECOR...",
    history_boldText: "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING...",

    seminars_year2011Title: "2011",
    seminars_seminarHeading: "FIRST NATURE AQUARIUM SEMINAR ORGANIZED",
    seminars_seminarText: "The Seminar offers lots to both retailers as well as hobbyists.",
    seminars_year2014Title: "2014",
    seminars_cuttakHeading: "FIRST PUBLIC AQUARIUM SETUP IN CUTTAK",
    seminars_cuttakText: "Nature Cube plays an active role in setting up a state-of-the-art public aquarium.",

    ripples_year2015Title: "2015",
    ripples_shopHeading: "RIPPLES STARTS SHOP",
    ripples_shopText: "RIPPLES, THE RETAIL STORE CUM GALLERY OF NATURE CUBE GETS INAUGURATED.",
    ripples_year2016Title: "2016",
    ripples_journalHeading: "RIPPLES FEATURED IN THE ADA AQUA JOURNAL",

    brands_year2017Title: "2017",
    brands_terrariumHeading: "TERRARIUM PRODUCTS INTRODUCED",
    brands_terrariumText: "NATURE CUBE STARTS DEALING WITH PRESTIGIOUS TERRARIUM PRODUCTS...",
    brands_year2020Title: "2020",
    brands_bringsLine1: "NATURE CUBE BRINGS 2 HR AQUARIST TO INDIA",
    brands_bringsLine2: "NATURE CUBE BRINGS OASE TO INDIA",
    brands_year2025Title: "2025",
    brands_centreHeading: "OPEN STATE OF THE ART EXPERIENCE CENTRE IN KOLKATA",

    team_title: "OUR TEAM",
    team_statement: "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING...",
    team_name: "GAUTAM GUPTA",
    team_role: "MENTOR",
    team_description: "<p>Gautam Gupta is a committed Nature Advocate...</p>",

    members_leader1Name: "COL. BASUDEV MITRA",
    members_leader1Bio: "Colonel Basudev Mitra retired from the army...",
    members_leader2Name: "PARTHA CHAKRABORTY",
    members_leader2Bio: "Partha, a management graduate with expertise...",
    members_leader3Name: "SANJOY DUTTA",
    members_leader3Bio: "He heads the finance team at Naturecube...",

    // ALL Exact Image Keys
    panoramic_image: "",
    hero_image: "",
    journey_image: "",
    history_image1: "",
    history_image2: "",
    seminars_image1: "",
    seminars_image2: "",
    ripples_image1: "",
    ripples_image2: "",
    brands_image1: "",
    brands_image2: "",
    brands_image3: "",
    main_image: "",
    team_image: "",
    members_leader1Image: "",
    members_leader2Image: "",
    members_leader3Image: "",
    members_groupImage: ""
  });

  useEffect(() => {
    fetchAboutPage();
  }, []);

  useEffect(() => {
    if (isPuckMode) {
      document.body.classList.add('puck-mode');
    } else {
      document.body.classList.remove('puck-mode');
    }
    
    return () => {
      document.body.classList.remove('puck-mode');
    };
  }, [isPuckMode]);

  const fetchAboutPage = async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getPublicPageBySlug('about');
      if (res.data && res.data.content?.blocks?.length > 0) {
        setPageId(res.data.id);
        const blockData = res.data.content.blocks.find(b => b.type === 'aboutHorizontalScroll');
        if (blockData && blockData.data) {
          setFormData(prev => ({ ...prev, ...blockData.data }));
        }
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch About page data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityState = () => {
    return formData[`${activeTab}_isVisible`] !== false;
  };

  const handleVisibilityToggle = (e) => {
    const isVisible = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [`${activeTab}_isVisible`]: isVisible
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTiptapChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAwardChange = (index, field, value) => {
    const newList = [...formData.awards_list];
    newList[index][field] = value;
    setFormData(prev => ({ ...prev, awards_list: newList }));
  };
  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards_list: [...prev.awards_list, { title: 'NEW AWARD', subtitle: '', image: '' }]
    }));
  };
  const removeAward = (index) => {
    const newList = [...formData.awards_list];
    newList.splice(index, 1);
    setFormData(prev => ({ ...prev, awards_list: newList }));
  };

  const saveToServer = async (dataToSave) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      title: 'About Us',
      slug: 'about',
      status: 'PUBLISHED',
      template: 'about-page',
      includeInSitemap: true,
      content: {
        blocks: [{
          id: Date.now().toString(),
          type: 'aboutHorizontalScroll',
          data: dataToSave
        }]
      }
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
      console.error(err);
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
    content: [{ type: 'aboutHorizontalScroll', props: { ...formData, id: 'about-master-block' } }],
    root: { props: { title: "About Us" } },
    zones: {}
  };

  // Shared input/textarea styling — keeps every field visually consistent in both themes
  const fieldClass = "w-full mt-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 focus:border-blue-400 dark:focus:border-blue-500 transition-colors";
  const fieldClassSm = "w-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 transition-colors";
  const labelClass = "text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase";
  const subCardClass = "p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4 border border-zinc-200 dark:border-zinc-700";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900 dark:text-blue-400" />
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium">Loading About engine...</p>
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
          <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Puck Visual Editor: About Us</span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Click "Publish" to save changes</p>
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
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50"><Layout className="w-6 h-6 text-blue-600 dark:text-blue-400"/> About Us Customization</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage the Horizontal Scroll Panels & Images</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsPuckMode(true)} className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-xl flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Type className="w-4 h-4"/> Edit Visually
          </button>
          <button onClick={handleFormSubmit} disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} 
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {success && <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Changes saved successfully!</div>}
      {error && <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-2 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8">
            
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl mb-8">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Show {TABS.find(t => t.id === activeTab)?.label} Panel</h3>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={getVisibilityState()} onChange={handleVisibilityToggle} className="sr-only" />
                  <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${getVisibilityState() ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${getVisibilityState() ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>

            {/* HERO PANEL */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Hero & Panoramic Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Headline Line 1</label><input type="text" name="hero_headlineLine1" value={formData.hero_headlineLine1} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Headline Line 2</label><input type="text" name="hero_headlineLine2" value={formData.hero_headlineLine2} onChange={handleInputChange} className={fieldClass} /></div>
                </div>
                <CollapsibleTiptap label="Hero Subtext" value={formData.hero_subtext} onChange={v => handleTiptapChange('hero_subtext', v)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Years Experience</label><input type="text" name="hero_yearsExp" value={formData.hero_yearsExp} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Since Year</label><input type="text" name="hero_sinceYear" value={formData.hero_sinceYear} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Client Count</label><input type="text" name="hero_clientCount" value={formData.hero_clientCount} onChange={handleInputChange} className={fieldClass} /></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Hero Background Decor (Optional)</label>
                    <ImageField value={formData.hero_image} onChange={(url) => handleTiptapChange('hero_image', url)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2 block">Global Panoramic Tank Image</label>
                    <ImageField value={formData.panoramic_image} onChange={(url) => handleTiptapChange('panoramic_image', url)} />
                  </div>
                </div>
              </div>
            )}

            {/* JOURNEY PANEL */}
            {activeTab === 'journey' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Journey Panel</h2>
                <div><label className={labelClass}>Main Heading</label><textarea rows="2" name="journey_heading" value={formData.journey_heading} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                <CollapsibleTiptap label="Paragraph 1" value={formData.journey_paragraph1} onChange={v => handleTiptapChange('journey_paragraph1', v)} />
                <CollapsibleTiptap label="Paragraph 2" value={formData.journey_paragraph2} onChange={v => handleTiptapChange('journey_paragraph2', v)} />
                <div className="mt-4">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Journey Leaf Background Image</label>
                  <ImageField value={formData.journey_image} onChange={(url) => handleTiptapChange('journey_image', url)} />
                </div>
              </div>
            )}

            {/* AWARDS PANEL */}
            {activeTab === 'awards' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Awards Panel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Heading Line 1</label><input type="text" name="awards_headingLine1" value={formData.awards_headingLine1} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Heading Line 2</label><input type="text" name="awards_headingLine2" value={formData.awards_headingLine2} onChange={handleInputChange} className={fieldClass} /></div>
                </div>
                <CollapsibleTiptap label="Subtext" value={formData.awards_subtext} onChange={v => handleTiptapChange('awards_subtext', v)} />
                
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Awards List</h3>
                    <button type="button" onClick={addAward} className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"><Plus className="w-3 h-3"/> Add Award</button>
                  </div>
                  {formData.awards_list.map((award, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl mb-3 relative bg-zinc-50 dark:bg-zinc-800/50">
                      <button type="button" onClick={() => removeAward(i)} className="absolute right-2 top-2 p-1 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-md transition-colors"><Trash2 className="w-4 h-4"/></button>
                      <div className="flex-1 space-y-3">
                        <input type="text" placeholder="Award Title" value={award.title} onChange={e => handleAwardChange(i, 'title', e.target.value)} className={fieldClassSm} />
                        <input type="text" placeholder="Subtitle / Year" value={award.subtitle} onChange={e => handleAwardChange(i, 'subtitle', e.target.value)} className={fieldClassSm} />
                        <div className="mt-2">
                          <ImageField value={award.image} onChange={(url) => handleAwardChange(i, 'image', url)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HISTORY PANEL */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">History Panel</h2>
                <div><label className={labelClass}>Title</label><input type="text" name="history_title" value={formData.history_title} onChange={handleInputChange} className={fieldClass} /></div>
                <div><label className={labelClass}>Small Muted Text</label><textarea rows="3" name="history_smallText" value={formData.history_smallText} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                <div><label className={labelClass}>Bold Emphasized Text</label><textarea rows="3" name="history_boldText" value={formData.history_boldText} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                
                <div className="mt-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Seminar Image 1 (Tank)</label>
                    <ImageField value={formData.seminars_image1} onChange={(url) => handleTiptapChange('seminars_image1', url)} />
                  </div>
              </div>
            )}

            {/* SEMINARS PANEL */}
            {activeTab === 'seminars' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Seminars Panel</h2>
                
                <div className={subCardClass}>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Top Block (2011)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Year Title</label><input type="text" name="seminars_year2011Title" value={formData.seminars_year2011Title} onChange={handleInputChange} className={fieldClass} /></div>
                    <div><label className={labelClass}>Heading</label><input type="text" name="seminars_seminarHeading" value={formData.seminars_seminarHeading} onChange={handleInputChange} className={fieldClass} /></div>
                  </div>
                  <div><label className={labelClass}>Description Text</label><textarea rows="2" name="seminars_seminarText" value={formData.seminars_seminarText} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                  <div>
                    <label className={labelClass}>Seminar Image 1 (Tank)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="text" name="seminars_image1" value={formData.seminars_image1 || ''} onChange={handleInputChange} className={`flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-emerald-400/40 transition-colors`} placeholder="Image URL" />
                      <button type="button" onClick={() => { setMediaTarget({ field: 'seminars_image1' }); setIsMediaModalOpen(true); }} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"><ImageIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                </div>

                <div className={subCardClass}>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Right Block (2014)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Year Title</label><input type="text" name="seminars_year2014Title" value={formData.seminars_year2014Title} onChange={handleInputChange} className={fieldClass} /></div>
                    <div><label className={labelClass}>Heading</label><input type="text" name="seminars_cuttakHeading" value={formData.seminars_cuttakHeading} onChange={handleInputChange} className={fieldClass} /></div>
                  </div>
                  <div><label className={labelClass}>Description Text</label><textarea rows="2" name="seminars_cuttakText" value={formData.seminars_cuttakText} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                  <div className="mt-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Seminar Image 2 (Tank)</label>
                    <ImageField value={formData.seminars_image2} onChange={(url) => handleTiptapChange('seminars_image2', url)} />
                  </div>
                </div>
              </div>
            )}

            {/* RIPPLES PANEL */}
            {activeTab === 'ripples' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Ripples Panel</h2>
                
                <div className={subCardClass}>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Top Block (2015)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Year Title</label><input type="text" name="ripples_year2015Title" value={formData.ripples_year2015Title} onChange={handleInputChange} className={fieldClass} /></div>
                    <div><label className={labelClass}>Heading</label><input type="text" name="ripples_shopHeading" value={formData.ripples_shopHeading} onChange={handleInputChange} className={fieldClass} /></div>
                  </div>
                  <div><label className={labelClass}>Description Text</label><textarea rows="2" name="ripples_shopText" value={formData.ripples_shopText} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                  <div className="mt-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Books Image</label>
                    <ImageField value={formData.ripples_image1} onChange={(url) => handleTiptapChange('ripples_image1', url)} />
                  </div>
                </div>

                <div className={subCardClass}>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Bottom Block (2016)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Year Title</label><input type="text" name="ripples_year2016Title" value={formData.ripples_year2016Title} onChange={handleInputChange} className={fieldClass} /></div>
                    <div><label className={labelClass}>Heading</label><input type="text" name="ripples_journalHeading" value={formData.ripples_journalHeading} onChange={handleInputChange} className={fieldClass} /></div>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Ripples Logo Image</label>
                    <ImageField value={formData.ripples_image2} onChange={(url) => handleTiptapChange('ripples_image2', url)} />
                  </div>
                </div>
              </div>
            )}

            {/* BRANDS PANEL */}
            {activeTab === 'brands' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Brands & Main Showcase Image</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4 border border-zinc-200 dark:border-zinc-700">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2017 Block</h3>
                    <div><label className={labelClass}>Title</label><input type="text" name="brands_year2017Title" value={formData.brands_year2017Title} onChange={handleInputChange} className={fieldClassSm} /></div>
                    <div><label className={labelClass}>Heading</label><input type="text" name="brands_terrariumHeading" value={formData.brands_terrariumHeading} onChange={handleInputChange} className={fieldClassSm} /></div>
                    <div><label className={labelClass}>Text</label><textarea rows="2" name="brands_terrariumText" value={formData.brands_terrariumText} onChange={handleInputChange} className={fieldClassSm} /></div>
                    <div className="mt-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">2HR Aquarist Logo</label>
                      <ImageField value={formData.brands_image1} onChange={(url) => handleTiptapChange('brands_image1', url)} />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4 border border-zinc-200 dark:border-zinc-700">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2020 Block</h3>
                    <div><label className={labelClass}>Title</label><input type="text" name="brands_year2020Title" value={formData.brands_year2020Title} onChange={handleInputChange} className={fieldClassSm} /></div>
                    <div><label className={labelClass}>Line 1</label><input type="text" name="brands_bringsLine1" value={formData.brands_bringsLine1} onChange={handleInputChange} className={fieldClassSm} /></div>
                    <div><label className={labelClass}>Line 2</label><input type="text" name="brands_bringsLine2" value={formData.brands_bringsLine2} onChange={handleInputChange} className={fieldClassSm} /></div>
                    <div className="mt-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Gulmo Logo</label>
                      <ImageField value={formData.brands_image2} onChange={(url) => handleTiptapChange('brands_image2', url)} />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-4 border border-zinc-200 dark:border-zinc-700 md:col-span-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">2025 Block</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>Title</label><input type="text" name="brands_year2025Title" value={formData.brands_year2025Title} onChange={handleInputChange} className={fieldClassSm} /></div>
                      <div><label className={labelClass}>Heading</label><input type="text" name="brands_centreHeading" value={formData.brands_centreHeading} onChange={handleInputChange} className={fieldClassSm} /></div>
                    </div>
                    <div className="mt-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Oase Logo</label>
                      <ImageField value={formData.brands_image3} onChange={(url) => handleTiptapChange('brands_image3', url)} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 block">Full Width Showcase Image (Panel 8)</label>
                  <ImageField value={formData.main_image} onChange={(url) => handleTiptapChange('main_image', url)} />
                </div>
              </div>
            )}

            {/* TEAM PANEL */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 text-zinc-900 dark:text-zinc-100">Mentor & Team Base</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Section Title</label><input type="text" name="team_title" value={formData.team_title} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Mentor Name</label><input type="text" name="team_name" value={formData.team_name} onChange={handleInputChange} className={fieldClass} /></div>
                  <div><label className={labelClass}>Mentor Role</label><input type="text" name="team_role" value={formData.team_role} onChange={handleInputChange} className={fieldClass} /></div>
                </div>
                <div><label className={labelClass}>Bold Intro Statement</label><textarea rows="3" name="team_statement" value={formData.team_statement} onChange={handleInputChange} className={`${fieldClass} resize-none`} /></div>
                <CollapsibleTiptap label="Detailed Biography (Paragraphs)" value={formData.team_description} onChange={v => handleTiptapChange('team_description', v)} />
                <div className="mt-4">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Mentor Image</label>
                  <ImageField value={formData.team_image} onChange={(url) => handleTiptapChange('team_image', url)} />
                </div>
                
                <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4 mt-8 text-zinc-900 dark:text-zinc-100">Core Members</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-3">
                    <label className={labelClass}>Member 1</label>
                    <input type="text" placeholder="Name" name="members_leader1Name" value={formData.members_leader1Name} onChange={handleInputChange} className={fieldClassSm} />
                    <textarea rows="4" placeholder="Bio" name="members_leader1Bio" value={formData.members_leader1Bio} onChange={handleInputChange} className={`${fieldClassSm} resize-none`} />
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Image 1</label>
                      <div className="flex items-center gap-1 mt-1">
                        <input type="text" name="members_leader1Image" value={formData.members_leader1Image || ''} onChange={handleInputChange} className="flex-1 px-2 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:focus:ring-emerald-400/40 transition-colors" />
                        <button type="button" onClick={() => { setMediaTarget({ field: 'members_leader1Image' }); setIsMediaModalOpen(true); }} className="px-2 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg text-xs font-bold transition-colors"><ImageIcon className="w-3 h-3"/></button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-3">
                    <label className={labelClass}>Member 2</label>
                    <input type="text" placeholder="Name" name="members_leader2Name" value={formData.members_leader2Name} onChange={handleInputChange} className={fieldClassSm} />
                    <textarea rows="4" placeholder="Bio" name="members_leader2Bio" value={formData.members_leader2Bio} onChange={handleInputChange} className={`${fieldClassSm} resize-none`} />
                    <div className="mt-2">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Image 2</label>
                      <ImageField value={formData.members_leader2Image} onChange={(url) => handleTiptapChange('members_leader2Image', url)} />
                    </div>
                  </div>
                  <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-3">
                    <label className={labelClass}>Member 3</label>
                    <input type="text" placeholder="Name" name="members_leader3Name" value={formData.members_leader3Name} onChange={handleInputChange} className={fieldClassSm} />
                    <textarea rows="4" placeholder="Bio" name="members_leader3Bio" value={formData.members_leader3Bio} onChange={handleInputChange} className={`${fieldClassSm} resize-none`} />
                    <div className="mt-2">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2 block">Image 3</label>
                      <ImageField value={formData.members_leader3Image} onChange={(url) => handleTiptapChange('members_leader3Image', url)} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Team Group Photo (Wide Cut-out)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="text" name="members_groupImage" value={formData.members_groupImage || ''} onChange={handleInputChange} className="flex-1 px-4 py-2 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 transition-colors" placeholder="Image URL" />
                    <button type="button" onClick={() => { setMediaTarget({ field: 'members_groupImage' }); setIsMediaModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"><ImageIcon className="w-4 h-4"/> Browse</button>
                  </div>
                  {formData.members_groupImage && <img src={resolveAssetUrl(formData.members_groupImage)} className="mt-3 h-32 w-auto object-contain rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm" alt="Preview"/>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      </div>
  );
};

export default AboutCustomization;