import React, { useState, useEffect, useRef } from 'react';
import { Save, Image as ImageIcon, Loader2, CheckCircle, List, User } from 'lucide-react';
import HeroCustomization from '../../components/admin/HeroCustomization';
import ServicesCustomization from '../../components/admin/ServicesCustomization';
import AboutCustomization from '../../components/admin/AboutCustomization';
import apiClient from '../../api/client'; 

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const HomeCustomization = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Hero Section State
  const [heroData, setHeroData] = useState({
    titleLine1: 'End-To-End',
    titleLine2: 'Office Interiors',
    subtitle: 'We specialize in transforming visions into reality.',
    buttonText: 'BOOK A FREE CONSULTATION',
    badgeText: 'Fast and Reliable',
    glassCardNumber: '250+',
    glassCardText1: 'My Design of art',
    glassCardText2: 'There Is No One Who Loves Pain Itself',
    backgroundImage: '',
    frontImage: ''
  });

  const [servicesData, setServicesData] = useState({
    badgeText: 'WHO WE ARE',
    title: 'Experience [The Art Of Interior] Design',
    description: 'We offer professional design services.',
    services: [
      { title: 'Architectural\nDesign', description: 'Brief description here' },
      { title: 'Interior Design\n& Planning', description: 'Brief description here' },
      { title: 'Consulting\nServices', description: 'Brief description here' },
      { title: 'Project\nManagement', description: 'Brief description here' }
    ]
  });

  // About Section State
  const [aboutData, setAboutData] = useState({
    badgeText: 'STARTED IN 1991',
    title: 'Where Spaces Inspire, And [Design Comes Alive]',
    description: 'Dedicated to bringing your vision to life.',
    buttonText: 'More About Us',
    image: '',
    highlights: [
      'Latest Technologies',
      'High-Quality Designs',
      '10 Years Warranty',
      'Residential Design'
    ]
  });

  const [previewBack, setPreviewBack] = useState('');
  const [previewFront, setPreviewFront] = useState('');
  const [previewAbout, setPreviewAbout] = useState('');

  const backImageRef = useRef(null);
  const frontImageRef = useRef(null);
  const aboutImageRef = useRef(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const [heroRes, servicesRes, aboutRes] = await Promise.allSettled([
        apiClient.get('/cms/section/homepage_hero'),
        apiClient.get('/cms/section/homepage_services'),
        apiClient.get('/cms/section/homepage_about')
      ]);

      // Handle Hero Data
      if (heroRes.status === 'fulfilled' && heroRes.value.data?.data?.content) {
        const content = heroRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setHeroData(content);
          if (content.backgroundImage) setPreviewBack(getAssetUrl(content.backgroundImage));
          if (content.frontImage) setPreviewFront(getAssetUrl(content.frontImage));
        }
      }

      // Handle Services Data
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data?.data?.content) {
        const content = servicesRes.value.data.data.content;
        if (Object.keys(content).length > 0) setServicesData(content);
      }

      // Handle About Data
      if (aboutRes.status === 'fulfilled' && aboutRes.value.data?.data?.content) {
        const content = aboutRes.value.data.data.content;
        if (Object.keys(content).length > 0) {
          setAboutData(content);
          if (content.image) setPreviewAbout(getAssetUrl(content.image));
        }
      }
    } catch (error) {
      console.error('Failed to fetch homepage data:', error);
      setErrorMsg('Failed to load initial data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleHeroInputChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value }));
  };

  const handleServicesInputChange = (e) => {
    const { name, value } = e.target;
    setServicesData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceItemChange = (index, field, value) => {
    setServicesData(prev => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      return { ...prev, services: updatedServices };
    });
  };

  const handleAboutInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({ ...prev, [name]: value }));
  };

  const handleHighlightChange = (index, value) => {
    setAboutData(prev => {
      const updatedHighlights = [...prev.highlights];
      updatedHighlights[index] = value;
      return { ...prev, highlights: updatedHighlights };
    });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'background') setPreviewBack(event.target.result);
      if (type === 'front') setPreviewFront(event.target.result);
      if (type === 'about') setPreviewAbout(event.target.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file); 

    try {
      setErrorMsg('');
      
      const res = await apiClient.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      
      const { data } = res;
      if (data.success && data.data.url) {
        const uploadedUrl = data.data.url;
        if (type === 'background') setHeroData(prev => ({ ...prev, backgroundImage: uploadedUrl }));
        else if (type === 'front') setHeroData(prev => ({ ...prev, frontImage: uploadedUrl }));
        else if (type === 'about') setAboutData(prev => ({ ...prev, image: uploadedUrl }));
      }
    } catch (error) {
      console.error(`Failed to upload ${type} image:`, error);
      
      const errorDetail = error.response?.data?.message || 'File must be an image (Max 5MB)';
      setErrorMsg(`Upload Failed: ${errorDetail}`); 
      
      // Revert preview if upload fails
      if (type === 'background') setPreviewBack(heroData.backgroundImage ? getAssetUrl(heroData.backgroundImage) : '');
      if (type === 'front') setPreviewFront(heroData.frontImage ? getAssetUrl(heroData.frontImage) : '');
      if (type === 'about') setPreviewAbout(aboutData.image ? getAssetUrl(aboutData.image) : '');
    } finally {
      e.target.value = ''; 
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg('');
      
      let url = `/cms/section/homepage_${activeTab}`;
      let payload = null;

      if (activeTab === 'hero') payload = { content: heroData };
      else if (activeTab === 'services') payload = { content: servicesData };
      else if (activeTab === 'about') payload = { content: aboutData };

      const res = await apiClient.put(url, payload);
      
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(`Failed to save ${activeTab} settings:`, error);
      setErrorMsg(error.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animation-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Home Page Customization</h1>
          <p className="text-zinc-500 mt-1">Manage the content and images for your main landing page.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl font-medium tracking-wide flex items-center gap-2 transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-down">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Changes saved successfully! The homepage has been updated.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-down">
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 gap-6">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-4 px-2 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'hero' 
              ? 'border-zinc-950 text-zinc-950 font-semibold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Hero Section
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-4 px-2 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'services' 
              ? 'border-zinc-950 text-zinc-950 font-semibold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <List className="w-4 h-4" /> Services Section
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-4 px-2 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'about' 
              ? 'border-zinc-950 text-zinc-950 font-semibold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <User className="w-4 h-4" /> About Section
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'hero' && (
        <HeroCustomization
          heroData={heroData}
          onChange={handleHeroInputChange}
          previewBack={previewBack}
          previewFront={previewFront}
          backImageRef={backImageRef}
          frontImageRef={frontImageRef}
          onImageUpload={handleImageUpload}
        />
      )}

      {activeTab === 'services' && (
        <ServicesCustomization
          servicesData={servicesData}
          onChange={handleServicesInputChange}
          onServiceItemChange={handleServiceItemChange}
        />
      )}

      {activeTab === 'about' && (
        <AboutCustomization
          aboutData={aboutData}
          onChange={handleAboutInputChange}
          onHighlightChange={handleHighlightChange}
          previewAbout={previewAbout}
          aboutImageRef={aboutImageRef}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

export default HomeCustomization;