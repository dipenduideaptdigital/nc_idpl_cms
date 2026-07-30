import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, Image as ImageIcon, Loader2, CheckCircle, List, Settings, ChevronDown, Trash2, Plus } from 'lucide-react';
import apiClient from '../../api/client';
import HeroCustomization from '../../components/admin/NcHome/HeroCustomization';
import MandalasCustomization from '../../components/admin/NcHome/MandalasCustomization';
import LivingArtCustomization from '../../components/admin/NcHome/LivingArtCustomization';
import ShowcaseCustomization from '../../components/admin/NcHome/ShowcaseCustomization';
import PlantDisplayCustomization from '../../components/admin/NcHome/PlantDisplayCustomization';
import ServicesCustomization from '../../components/admin/NcHome/ServicesCustomization';
import PartnersCustomization from '../../components/admin/NcHome/PartnersCustomization';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const TABS = [
  { key: 'nc_hero', label: 'Nature Hero', icon: ImageIcon },
  { key: 'nc_mandalas', label: 'Living Mandalas', icon: Settings },
  { key: 'nc_living_art', label: 'Living Art', icon: List },
  { key: 'nc_showcase', label: 'Showcase Grid', icon: List },
  { key: 'nc_plant_display', label: 'Plant Banner', icon: ImageIcon },
  { key: 'nc_services', label: 'Our Services', icon: List },
  { key: 'nc_partners', label: 'Our Partners', icon: List }
];

const NcHomeCustomization = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'nc_hero');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ---  NC Hero State ---
  const [ncHeroData, setNcHeroData] = useState({
    titleLine1: 'NATURE HAS',
    titleLine2: 'ALWAYS BEEN CALLING.',
    subHeadline: 'WE SIMPLY HELP YOU',
    italicWord: 'answer',
    backgroundImage: ''
  });

  // --- NC Mandalas State ---
  const [ncMandalasData, setNcMandalasData] = useState({
    tagline: 'what we believe',
    mainTitle: 'LIVING MANDALAS',
    headingLine1: 'A quest to',
    headingLine2: 'expose the principles of',
    italicWord: 'mandala',
    descLine1: "LIQUID LANDSCAPES MIRRORED IN MINDFUL ART,",
    descLine2: "A LIVING MANDALA'S HEART.",
    buttonText: 'explore the mandala',
    mandalaImage: ''
  });

  // --- NC Living Art State ---
  const [ncLivingArtData, setNcLivingArtData] = useState({
    tagline: 'what we do',
    mainTitle: 'LIVING',
    italicTitle: 'art',
    subHeadline: 'It is a long established fact that a reader will be distracted.',
    paragraph: 'It is a long established fact that a reader will be distracted.',
    videoUrl: 'https://www.youtube.com/embed/...',
    tabs: [
      { id: '01', title: 'Paludariums', desc1: 'Desc 1...', desc2: 'Desc 2...', image: '' }
    ],
    footerTagline: 'what we do',
    footerQuote: 'Nature showed it to us twice...'
  });

  const [ncShowcaseData, setNcShowcaseData] = useState({
    row1Logo: '', row1Desc: '', galleryImages: ['', '', ''],
    row2Logo: '', row2Desc: '', row2BtnText: 'explore', row2FloatingImg: '',
    row3Logo: '', row3Desc: '', row3BtnText: 'explore', row3FloatingImg: ''
  });

  const [ncPlantDisplayData, setNcPlantDisplayData] = useState({
    plantImage: ''
  });

  const [ncServicesData, setNcServicesData] = useState({
    tagline: 'our services',
    headline: '',
    subtext: '',
    services: [
      { number: '01', title: 'DESIGN CONSULTATION', description: '', image: '' }
    ]
  });

  const [ncPartnersData, setNcPartnersData] = useState({
    mainTitle1: 'OUR', italicTitle: 'partners', headline: '', paragraph: '', 
    buttonText: 'STORE', buttonLink: '#store', partnerLogos: []
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const [heroRes, mandalasRes, livingArtRes, showcaseRes, plantRes, servicesRes] = await Promise.allSettled([
        apiClient.get('/cms/section/nc_homepage_hero'),
        apiClient.get('/cms/section/nc_homepage_mandalas'),
        apiClient.get('/cms/section/nc_homepage_living_art'),
        apiClient.get('/cms/section/nc_homepage_showcase'),
        apiClient.get('/cms/section/nc_homepage_plant_display'),
        apiClient.get('/cms/section/nc_homepage_services'),
        apiClient.get('/cms/section/nc_homepage_partners')
      ]);

      if (heroRes.status === 'fulfilled' && heroRes.value.data?.data?.content) {
        if (Object.keys(heroRes.value.data.data.content).length > 0) setNcHeroData(heroRes.value.data.data.content);
      }
      if (mandalasRes.status === 'fulfilled' && mandalasRes.value.data?.data?.content) {
        if (Object.keys(mandalasRes.value.data.data.content).length > 0) setNcMandalasData(mandalasRes.value.data.data.content);
      }
      if (livingArtRes.status === 'fulfilled' && livingArtRes.value.data?.data?.content) {
        if (Object.keys(livingArtRes.value.data.data.content).length > 0) setNcLivingArtData(livingArtRes.value.data.data.content);
      }
      if (showcaseRes.status === 'fulfilled' && showcaseRes.value.data?.data?.content) {
        if (Object.keys(showcaseRes.value.data.data.content).length > 0) setNcShowcaseData(showcaseRes.value.data.data.content);
      }
      if (plantRes.status === 'fulfilled' && plantRes.value.data?.data?.content) {
        if (Object.keys(plantRes.value.data.data.content).length > 0) setNcPlantDisplayData(plantRes.value.data.data.content);
      }
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data?.data?.content) {
        if (Object.keys(servicesRes.value.data.data.content).length > 0) setNcServicesData(servicesRes.value.data.data.content);
      }
      if (partnersRes.status === 'fulfilled' && partnersRes.value.data?.data?.content) {
        if (Object.keys(partnersRes.value.data.data.content).length > 0) setNcPartnersData(partnersRes.value.data.data.content);
      }
    } catch (error) {
      console.error('Failed to fetch NC homepage data:', error);
      setErrorMsg('Failed to load initial data. Please refresh.');
    } finally {
        setLoading(false);
      }
    };

  const handleNcHeroChange = (field, value) => {
    setNcHeroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNcMandalasChange = (field, value) => {
  setNcMandalasData(prev => ({
    ...prev,
    [field]: value
  }));
};

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg('');
      
      let url = '';
      let payload = null;

      if (activeTab === 'nc_hero') {
        url = '/cms/section/nc_homepage_hero';
        payload = { content: ncHeroData };
      } else if (activeTab === 'nc_mandalas') {
        url = '/cms/section/nc_homepage_mandalas';
        payload = { content: ncMandalasData };
      } else if (activeTab === 'nc_living_art') {
        url = '/cms/section/nc_homepage_living_art';
        payload = { content: ncLivingArtData };
      } else if (activeTab === 'nc_showcase') {
        url = '/cms/section/nc_homepage_showcase';
        payload = { content: ncShowcaseData };
      } else if (activeTab === 'nc_plant_display') {
        url = '/cms/section/nc_homepage_plant_display';
        payload = { content: ncPlantDisplayData };
      } else if (activeTab === 'nc_services') {
        url = '/cms/section/nc_homepage_services';
        payload = { content: ncServicesData };
      } else if (activeTab === 'nc_partners') {
        url = '/cms/section/nc_homepage_partners';
        payload = { content: ncPartnersData };
      }
      const res = await apiClient.put(url, payload);
      
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(`Failed to save ${activeTab} settings:`, error);
      setErrorMsg(error.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section, tabIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file); 

    try {
      setErrorMsg('');
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (res.data.success && res.data.data.url) {
        const url = res.data.data.url;
        
        if (section === 'nc_hero') {
          setNcHeroData(prev => ({ ...prev, backgroundImage: url }));
        } else if (section === 'nc_mandalas') {
          setNcMandalasData(prev => ({ ...prev, mandalaImage: url }));
        } else if (section === 'nc_living_art_tab') {
          setNcLivingArtData(prev => {
            const newTabs = [...prev.tabs];
            newTabs[tabIndex].image = url;
            return { ...prev, tabs: newTabs };
          });
        } else if (section === 'nc_showcase_row1Logo') {
          setNcShowcaseData(prev => ({ ...prev, row1Logo: url }));
        } else if (section === 'nc_showcase_row2Logo') {
          setNcShowcaseData(prev => ({ ...prev, row2Logo: url }));
        } else if (section === 'nc_showcase_row2FloatingImg') {
          setNcShowcaseData(prev => ({ ...prev, row2FloatingImg: url }));
        } else if (section === 'nc_showcase_row3Logo') {
          setNcShowcaseData(prev => ({ ...prev, row3Logo: url }));
        } else if (section === 'nc_showcase_row3FloatingImg') {
          setNcShowcaseData(prev => ({ ...prev, row3FloatingImg: url }));
        } else if (section === 'nc_showcase_gallery') {
          setNcShowcaseData(prev => {
            const newGal = [...(prev.galleryImages || ['', '', ''])];
            newGal[tabIndex] = url;
            return { ...prev, galleryImages: newGal };
          });
        } else if (section === 'nc_plant_display') {
          setNcPlantDisplayData(prev => ({ ...prev, plantImage: url }));
        } else if (section === 'nc_services_image') {
          setNcServicesData(prev => {
            const newSvcs = [...(prev.services || [])];
            newSvcs[tabIndex].image = url;
            return { ...prev, services: newSvcs };
          });
        }else if (section === 'nc_partners_logo') {
          setNcPartnersData(prev => {
            const newLogos = [...(prev.partnerLogos || [])];
            newLogos[tabIndex] = url;
            return { ...prev, partnerLogos: newLogos };
          });
        }
      }
    } catch (error) {
      setErrorMsg(`Upload Failed: ${error.response?.data?.message || 'File must be an image (Max 5MB)'}`); 
    } finally {
      e.target.value = ''; 
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-900" /></div>;
  }

  return (
    <div className="space-y-8 pb-10 animation-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">NatureCube Home Settings</h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage dynamic content for the new NatureCube homepage.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg text-sm w-full sm:w-auto">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" /> <span className="font-medium">Changes saved successfully!</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Tab Selector */}
      <div className="relative mb-6 z-40" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full sm:max-w-md flex items-center justify-between bg-white border border-zinc-200 px-4 py-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-900">{TABS.find(t => t.key === activeTab)?.label}</span>
          </div>
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-full sm:max-w-md bg-white border border-zinc-200 rounded-xl shadow-xl z-50">
            <div className="p-2 grid gap-1">
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setDropdownOpen(false); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left ${activeTab === tab.key ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100 text-zinc-700'}`}>
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
        
        {/* 1. HERO FORM */}
        {activeTab === 'nc_hero' && (
          <HeroCustomization 
            data={ncHeroData} 
            onChange={handleNcHeroChange} 
            onImageUpload={handleImageUpload} 
          />
        )}

        {/* MANDALAS FORM */}
        {activeTab === 'nc_mandalas' && (
          <MandalasCustomization 
            data={ncMandalasData} 
            onChange={handleNcMandalasChange} 
            onImageUpload={handleImageUpload} 
          />
        )}

        {/* LIVING ART FORM */}
        {activeTab === 'nc_living_art' && (
          <LivingArtCustomization 
            data={ncLivingArtData} 
            setData={setNcLivingArtData} 
            onImageUpload={handleImageUpload} 
          />
        )}

        {/* SHOWCASE FORM */}
        {activeTab === 'nc_showcase' && (
          <ShowcaseCustomization 
            data={ncShowcaseData} 
            setData={setNcShowcaseData} 
            onImageUpload={handleImageUpload} 
          />
        )}

        {/* PLANT DISPLAY FORM */}
        {activeTab === 'nc_plant_display' && (
          <PlantDisplayCustomization 
            data={ncPlantDisplayData} 
            onImageUpload={handleImageUpload} 
          />
        )}

        {/* SERVICES FORM */}
        {activeTab === 'nc_services' && (
          <ServicesCustomization 
            data={ncServicesData} 
            setData={setNcServicesData} 
            onImageUpload={handleImageUpload} 
          />
        )}

        {/* PARTNERS FORM */}
        {activeTab === 'nc_partners' && (
          <PartnersCustomization 
            data={ncPartnersData} 
            setData={setNcPartnersData} 
            onImageUpload={handleImageUpload} 
          />
        )}
      </div>
    </div>
  );
};

export default NcHomeCustomization;