import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { pagesApi } from '../../../api/pages';
import { 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Layout,
  Type,
  Plus,
  Trash2,
  Settings,
  ChevronDown
} from 'lucide-react';
import DynamicBlockEditor from '../../../components/admin/DynamicBlockEditor';
import PreviewManager from '../../../components/admin/PreviewManager';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '../../../config/puck.config';

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [isPuckMode, setIsPuckMode] = useState(false);

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

  const AVAILABLE_BLOCKS = [
    { type: 'heroSection', label: 'Hero Section' },
    { type: 'whySubhaakritee', label: 'Why SubhAAkritee?' },
    { type: 'metricsBarOne', label: 'Metrics Bar 1' },
    { type: 'modernWorkspace', label: 'Modern Workspace Solutions' },
    { type: 'metricsBarTwo', label: 'Metrics Bar 2' },
    { type: 'spacesStories', label: 'Spaces. Stories. Experiences.' },
    { type: 'wayWeCreate', label: 'The Way We Create' },
    { type: 'gallerySection', label: 'Gallery Section' },
    { type: 'trustedClients', label: 'Trusted Clients' },
    { type: 'getInTouch', label: 'Get In Touch' },
    { type: 'richText', label: 'Rich Text Box' },
    { type: 'contactForm', label: 'Contact Form (Dynamic Engine)' } 
  ];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    status: 'DRAFT',
    content: { blocks: [] },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  useEffect(() => {
    // Scroll the admin layout container to top when entering this page
    const adminScrollContainer = document.querySelector('main > div.overflow-auto');
    if (adminScrollContainer) {
      adminScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (isEditMode) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getPageById(id);
      
      // Merge with default form data to ensure all fields exist
      setFormData({
        title: data.data.title || '',
        slug: data.data.slug || '',
        excerpt: data.data.excerpt || '',
        status: data.data.status || 'DRAFT',
        content: data.data.content || { blocks: [] },
        metaTitle: data.data.metaTitle || '',
        metaDescription: data.data.metaDescription || '',
        metaKeywords: data.data.metaKeywords || ''
      });
    } catch (err) {
      console.error('Failed to fetch page:', err);
      setError('Failed to load page. It may have been deleted or you lack permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Block Management
  const addBlock = (type) => {
    let defaultData = {};
    
    switch(type) {
      case 'heroSection':
        defaultData = { titleLine1: 'End-To-End', titleLine2: 'Office Interiors', subtitle: 'For Every Test & Budget', description: "Simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry's standard,", buttonText: 'Book A Free Consultation', backgroundImage: '' }; break;
      case 'whySubhaakritee':
        defaultData = { 
          title: 'WHY subhAAkritee?', 
          description: 'For Over 26 Years, SubhAAkritee - The Design People Has Delivered Innovative, High-Quality Interior And Architectural Solutions Across Residential And Commercial Spaces. With A Strong Presence In Kolkata, Delhi, Siliguri, And Bhubaneswar, We Transform Spaces Into Functional Works Of Art', 
          buttonText: 'Get Free Estimated',
          features: [
            { icon: 'Award', textLine1: '1,400+ design', textLine2: 'experts' },
            { icon: 'Home', textLine1: '20,000+ happy', textLine2: 'customers' },
            { icon: 'ShieldCheck', textLine1: 'Up to 10-years', textLine2: 'material warranty' },
            { icon: 'CalendarDays', textLine1: '45 days or we', textLine2: 'pay you rent', extraBadge: '45' }
          ]
        }; break;
      case 'modernWorkspace':
        defaultData = { 
          title: 'Modern Workspace Solutions', 
          subtitle: 'SubhAAkritee',
          services: [
            { icon: 'Hammer', title: 'Modular Kitchen' },
            { icon: 'Lightbulb', title: 'Lighting / Ceilings' },
            { icon: 'Archive', title: 'Wardrobes' },
            { icon: 'Settings', title: 'Smart Homes' },
            { icon: 'Monitor', title: 'Furniture / Wood Work' },
            { icon: 'Layout', title: 'Space Saving Furniture' }
          ]
        }; break;
      case 'spacesStories':
        defaultData = { 
          badgeText: 'ARCHITECTURE AND INTERIOR DESIGN', 
          titleLine1: 'Spaces. Stories.', 
          titleLine2: 'Experiences.', 
          description: '26 Years Of Crafting Environments Defined By Excellence.', 
          buttonText: 'Discover More',
          images: [
            '/assets/homepage/gallery1.png', 
            '/assets/homepage/gallery2.png', 
            '/assets/homepage/gallery3.png'
          ]
        }; break;
      case 'wayWeCreate':
        defaultData = { 
          title: 'The Way We Create', 
          subtitle: 'Bringing your vision to life in three simple steps.',
          steps: [
            { icon: 'PenTool', title: 'Consult', desc: "We'll explore ideas and options together." },
            { icon: 'ClipboardList', title: 'Plan', desc: "We'll build a detailed design plan." },
            { icon: 'UserCheck', title: 'Execute', desc: "We'll deliver the project flawlessly." }
          ]
        }; break;
      case 'trustedClients':
        defaultData = { 
          title: 'Trusted By Thousands', 
          subtitle: 'See what our clients say about us',
          reviews: [
            {
              text: "SubhAAkritee transformed our office space into a vibrant, functional environment. The team's attention to detail and commitment to our vision was exceptional.",
              author: "Rajesh Kumar",
              role: "CEO, TechCorp",
              rating: 5
            },
            {
              text: "We wanted a modern yet cozy home, and they delivered exactly that. Their material quality and design ideas are top-notch. Highly recommended!",
              author: "Sneha Patel",
              role: "Homeowner",
              rating: 5
            },
            {
              text: "Professional, timely, and incredibly creative. They managed our entire restaurant renovation without a hitch. The 45-day guarantee is real!",
              author: "Amit Singh",
              role: "Restaurant Owner",
              rating: 5
            }
          ]
        }; break;
      case 'getInTouch':
        defaultData = { title: 'Get In Touch', subtitle: 'Our friendly team would love to hear from you.', buttonText: 'Send Message', image: '' }; break;
      case 'metricsBarOne':
        defaultData = {
          metrics: [
            { value: '26+', label: 'YEARS EXPERIENCE' },
            { value: '100+', label: 'PROJECTS DONE' },
            { value: '100+', label: 'SATISFIED CUSTOMER' },
            { value: '4+', label: 'LOCATION' }
          ]
        }; break;
      case 'metricsBarTwo':
        defaultData = {
          metrics: [
            { value: '3,000+', label: 'INTERIOR DESIGNS' },
            { value: '1,500+', label: 'RENOVATIONS' },
            { value: '500+', label: 'COMMERCIAL PROJECTS' },
            { value: '25+', label: 'AWARDS WON' }
          ]
        }; break;
      case 'gallerySection':
        defaultData = {
          images: [
            '/assets/homepage/gallery1.png', 
            '/assets/homepage/gallery2.png', 
            '/assets/homepage/gallery3.png',
            '/assets/homepage/gallery4.png'
          ]
        }; break;
      case 'richText':
        defaultData = { content: '' }; break;
      
      case 'contactForm':
        defaultData = { 
          formId: '', 
          formTitle: 'Get in Touch',
          submitButtonText: 'Submit Inquiry',
          redirectPath: '' 
        }; break;
        
      default:
        defaultData = {};
    }

    const newBlock = {
      id: Date.now().toString(), // local temporary ID
      type: type,
      data: defaultData
    };
    
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        blocks: [...(prev.content.blocks || []), newBlock]
      }
    }));
    setShowBlockMenu(false);
  };

  const removeBlock = (index) => {
    setFormData(prev => {
      const newBlocks = [...(prev.content.blocks || [])];
      newBlocks.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, blocks: newBlocks }
      };
    });
  };

  const updateBlockData = (index, field, value) => {
    setFormData(prev => {
      const newBlocks = [...(prev.content.blocks || [])];
      newBlocks[index] = {
        ...newBlocks[index],
        data: {
          ...newBlocks[index].data,
          [field]: value
        }
      };
      return {
        ...prev,
        content: { ...prev.content, blocks: newBlocks }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = { ...formData };
    if (payload.content && payload.content.blocks) {
      payload.content.blocks = payload.content.blocks.map(({ id, ...block }) => block);
    }
    if (!payload.slug || payload.slug.trim() === '') {
      delete payload.slug;
    }

    try {
      setSaving(true);
      setError(null);
      
      if (isEditMode) {
        await pagesApi.updatePage(id, payload);
      } else {
        await pagesApi.createPage(payload);
      }
      
      navigate('/admin/pages');
    } catch (err) {
      console.error('Failed to save page:', err);
      setError(err.response?.data?.message || 'Failed to save page. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-500 font-medium">Loading editor...</p>
      </div>
    );
  }

  if (isPuckMode) {
    const puckData = {
      content: (formData.content?.blocks || []).map(b => ({ 
        type: b.type, 
        props: { ...(b.data || {}), id: b.id || b.data?.id || `puck-id-${Math.random().toString(36).slice(2)}` }
      })),
      root: { props: { title: formData.title || "" } },
      zones: {}
    };

    const handlePuckPublish = async (data) => {
      const blocks = (data.content || []).map(item => {
        const { id, ...cleanProps } = item.props || {};
        return {
          type: item.type,
          data: cleanProps,
          id: Date.now().toString() + Math.random().toString()
        };
      });
      
      const updatedContent = { ...formData.content, blocks };
      
      // Update local UI immediately and exit Puck mode
      setFormData(prev => ({ ...prev, content: updatedContent }));
      setIsPuckMode(false);

      // Auto-Save to backend
      const payload = { ...formData, content: updatedContent };
      if (payload.content && payload.content.blocks) {
        payload.content.blocks = payload.content.blocks.map(({ id, ...block }) => block);
      }
      if (!payload.slug || payload.slug.trim() === '') {
        delete payload.slug;
      }

      try {
        setSaving(true);
        setError(null);
        if (isEditMode) {
          await pagesApi.updatePage(id, payload);
        } else {
          const res = await pagesApi.createPage(payload);
          navigate(`/admin/pages/edit/${res.data.id}`);
        }
      } catch (err) {
        console.error('Failed to save page:', err);
        setError(err.response?.data?.message || 'Failed to auto-save. Please try saving manually.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPuckMode(false)} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Standard Editor
            </button>
            <span className="font-bold text-lg text-zinc-900">Puck Visual Editor</span>
          </div>
          <p className="text-sm text-zinc-500">Click "Publish" in Puck to apply changes to the form</p>
        </div>
        <div className="flex-1 overflow-y-auto h-full min-h-[calc(100vh-70px)]">
          <Puck config={puckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/pages"
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {isEditMode ? 'Edit Page' : 'Create New Page'}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {isEditMode ? `Editing: ${formData.title}` : 'Draft a new page for your website.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PreviewManager id={isEditMode ? id : null} entityType="page" />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            {isEditMode && <option value="ARCHIVED">Archived</option>}
          </select>
          <button 
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Layout className="w-5 h-5 text-zinc-400" />
              General Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. About Us"
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  URL Slug
                  <span className="text-xs text-zinc-400 ml-2 font-normal">(Leave blank to auto-generate)</span>
                </label>
                <div className="flex rounded-xl shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-500 sm:text-sm font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="about-us"
                    className="flex-1 min-w-0 block w-full px-4 py-2 border border-zinc-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors font-mono text-sm bg-zinc-50/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Excerpt (Short Description)</label>
                <textarea
                  name="excerpt"
                  rows="2"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A brief summary of this page..."
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Page Builder / Content Blocks */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Type className="w-5 h-5 text-zinc-400" />
                  Content Blocks
                </h2>
                <button 
                  type="button" 
                  onClick={() => setIsPuckMode(true)}
                  className="px-3 py-1.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <Layout className="w-4 h-4" /> Edit visually with Puck
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowBlockMenu(!showBlockMenu)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Block <ChevronDown className="w-4 h-4" />
                </button>
                
                {showBlockMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl rounded-xl py-2 z-20 max-h-[300px] overflow-y-auto">
                    <div className="px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Available Blocks</div>
                    {AVAILABLE_BLOCKS.map(b => (
                      <button
                        key={b.type}
                        type="button"
                        onClick={() => addBlock(b.type)}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {(!formData.content?.blocks || formData.content.blocks.length === 0) ? (
                <div className="text-center py-10 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  <Type className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-500">No content blocks yet.</p>
                  <button
                    type="button"
                    onClick={() => addBlock('richText')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add a Text Block
                  </button>
                </div>
              ) : (
                formData.content.blocks.map((block, index) => (
                  <div key={block.id || index} className="group relative bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-300 transition-colors">
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-200"
                        title="Remove Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 rounded-t-xl text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center">
                      <span className="bg-zinc-200 text-zinc-700 w-5 h-5 rounded flex items-center justify-center mr-2">{index + 1}</span>
                      {AVAILABLE_BLOCKS.find(b => b.type === block.type)?.label || block.type}
                    </div>
                    <div className="p-0 border-t border-zinc-200 relative">
                      <DynamicBlockEditor 
                        block={block} 
                        index={index} 
                        updateBlockData={updateBlockData} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-5">
            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Settings className="w-5 h-5 text-zinc-400" />
              SEO Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO Title"
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm"
                />
                <p className="text-xs text-zinc-400 mt-1">Recommended: 50-60 characters</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  rows="3"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Brief description for search engines..."
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm resize-y"
                ></textarea>
                <p className="text-xs text-zinc-400 mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleInputChange}
                  placeholder="interior, design, decor"
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm"
                />
                <p className="text-xs text-zinc-400 mt-1">Comma separated keywords</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PageEditor;