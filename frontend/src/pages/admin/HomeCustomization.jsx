import React, { useState, useEffect, useRef } from 'react';
import { Save, Image as ImageIcon, Loader2, CheckCircle, List, User } from 'lucide-react';
import HeroCustomization from '../../components/admin/HeroCustomization';
import ServicesCustomization from '../../components/admin/ServicesCustomization';
import AboutCustomization from '../../components/admin/AboutCustomization';

const HomeCustomization = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Hero Section State
  const [heroData, setHeroData] = useState({
    titleLine1: 'End-To-End',
    titleLine2: 'Office Interiors',
    subtitle: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.',
    buttonText: 'BOOK A FREE CONSULTATION',
    badgeText: 'Fast and Reliable',
    glassCardNumber: '250+',
    glassCardText1: 'My Design of art',
    glassCardText2: 'There Is No One Who Loves Pain Itself',
    backgroundImage: '',
    frontImage: ''
  });

  // Services Section State
  const [servicesData, setServicesData] = useState({
    badgeText: 'WHO WE ARE',
    title: 'Experience [The Art Of Interior] Design',
    description: 'If you use this site regularly and would like consider donating a small sum to help pay for the hosting and bandwidth bill. There is no minimum donation, any sum is appreciated',
    services: [
      { title: 'Architectural\nDesign', description: 'A business house born out of passion for fish keeping and nature conservation' },
      { title: 'Interior Design\n& Planning', description: 'A business house born out of passion for fish keeping and nature conservation' },
      { title: 'Consulting\nServices', description: 'A business house born out of passion for fish keeping and nature conservation' },
      { title: 'Project\nManagement', description: 'A business house born out of passion for fish keeping and nature conservation' }
    ]
  });

  // About Section State
  const [aboutData, setAboutData] = useState({
    badgeText: 'STARTED IN 1991',
    title: 'Where Spaces Inspire, And [Design Comes Alive]',
    description: 'Whether it\'s your home, office, or a commercial project, we are always dedicated to bringing your vision to life. Our numbers speak better than words:',
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
      
      // Fetch Hero
      const heroRes = await fetch('http://localhost:5000/api/v1/cms/homepage/hero');
      const heroJson = await heroRes.json();
      if (heroJson.success && heroJson.data?.content) {
        setHeroData(heroJson.data.content);
        if (heroJson.data.content.backgroundImage) setPreviewBack(`http://localhost:5000${heroJson.data.content.backgroundImage}`);
        if (heroJson.data.content.frontImage) setPreviewFront(`http://localhost:5000${heroJson.data.content.frontImage}`);
      }

      // Fetch Services
      const servicesRes = await fetch('http://localhost:5000/api/v1/cms/homepage/services');
      const servicesJson = await servicesRes.json();
      if (servicesJson.success && servicesJson.data?.content) {
        setServicesData(servicesJson.data.content);
      }

      // Fetch About
      const aboutRes = await fetch('http://localhost:5000/api/v1/cms/homepage/about');
      const aboutJson = await aboutRes.json();
      if (aboutJson.success && aboutJson.data?.content) {
        setAboutData(aboutJson.data.content);
        if (aboutJson.data.content.image) setPreviewAbout(`http://localhost:5000${aboutJson.data.content.image}`);
      }
    } catch (error) {
      console.error('Failed to fetch homepage data:', error);
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

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'background') setPreviewBack(e.target.result);
      if (type === 'front') setPreviewFront(e.target.result);
      if (type === 'about') setPreviewAbout(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/api/v1/cms/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success && data.data.url) {
        if (type === 'background') {
          setHeroData(prev => ({ ...prev, backgroundImage: data.data.url }));
        } else if (type === 'front') {
          setHeroData(prev => ({ ...prev, frontImage: data.data.url }));
        } else if (type === 'about') {
          setAboutData(prev => ({ ...prev, image: data.data.url }));
        }
      }
    } catch (error) {
      console.error(`Failed to upload ${type} image:`, error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let url = '';
      let payload = null;

      if (activeTab === 'hero') {
        url = 'http://localhost:5000/api/v1/cms/homepage/hero';
        payload = { content: heroData };
      } else if (activeTab === 'services') {
        url = 'http://localhost:5000/api/v1/cms/homepage/services';
        payload = { content: servicesData };
      } else if (activeTab === 'about') {
        url = 'http://localhost:5000/api/v1/cms/homepage/about';
        payload = { content: aboutData };
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(`Failed to save ${activeTab} settings:`, error);
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