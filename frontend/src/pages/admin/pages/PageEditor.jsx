import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
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
import { ncPuckConfig } from '../../../config/ncPuck.config';
import Can from '../../../components/shared/Can';

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  const isSitePagesMode = location.pathname.includes('/admin/site-pages');
  const isServicesMode = location.pathname.includes('/admin/services');
  const backPath = isServicesMode ? '/admin/services' : (isSitePagesMode ? '/admin/site-pages' : '/admin/pages');

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
    { type: 'richText', label: 'Rich Text Box' },
    { type: 'contactForm', label: 'Contact Form (Dynamic Engine)' },
    { type: 'ripplesHero', label: 'Ripples: Hero Section' },
    { type: 'ripplesIntro', label: 'Ripples: Intro & Quote' },
    { type: 'ripplesNatureAquarium', label: 'Ripples: Nature Aquarium Projects' },
    { type: 'ripplesLetsBegin', label: 'Ripples: Let\'s Begin Steps' },
    { type: 'ripplesAquascape', label: 'Ripples: Aquascape Categories' },
    { type: 'getStartedCta', label: 'Ripples: Get Started CTA' },
    { type: 'gulmoHero', label: 'Gulmo: Hero Section' },
    { type: 'gulmoTerrarium', label: 'Gulmo: Terrarium Showcase' },
    { type: 'gulmoQuote', label: 'Gulmo: Quote Section' },
    { type: 'gulmoForestOrganism', label: 'Gulmo: Forest Organism Diagram' },
    { type: 'gulmoOurProjects', label: 'Gulmo: Our Projects' },
    { type: 'gulmoLetsBegin', label: 'Gulmo: Lets Begin Store' },
    { type: 'gulmoConcept', label: 'Gulmo: Concept Gardening' },
    { type: 'prakritiHero', label: 'Prakriti: Hero Section' },
    { type: 'prakritiIntro', label: 'Prakriti: Intro Section' },
    { type: 'prakritiEducation', label: 'Prakriti: Education Field Trips' },
    { type: 'prakritiUpcomingWorkshops', label: 'Prakriti: Upcoming Workshops' },
    { type: 'prakritiLabExperience', label: 'Prakriti: Lab Experience & Carousel' },
    { type: 'prakritiLabShowcase', label: 'Prakriti: Showcase Portfolio' },
    { type: 'prakritiGetInTouch', label: 'Prakriti: Get In Touch Form' },
    { type: 'prakritiLetsBegin', label: 'Prakriti: Lets Begin Store' },
    { type: 'workshopHero', label: 'Workshop: Hero Section' },
    { type: 'workshopDetails', label: 'Workshop: Details & Pricing' },
    { type: 'workshopGallery', label: 'Workshop: Photo Gallery' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    status: 'DRAFT',
    template: isServicesMode && !isEditMode ? 'service-page' : 'default', 
    content: { blocks: [] },
    metaTitle: '', metaDescription: '', metaKeywords: '',
    includeInSitemap: true, noIndex: false, noFollow: false,
    canonicalUrl: '', ogTitle: '', ogDescription: '', ogImageId: null
  });

  useEffect(() => {
    // Scroll the admin layout container to top when entering this page
    const adminScrollContainer = document.querySelector('main > div.overflow-auto');
    if (adminScrollContainer) {
      adminScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (isEditMode) {
      fetchPage();
    } else if (isServicesMode && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        content: {
          blocks: [
            { id: Date.now().toString() + "1", type: 'richText', data: { content: '<h2>New Service Page</h2><p>Start writing your service details here...</p>' } }
          ]
        }
      }));
    }
  }, [id, isServicesMode, isEditMode]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getPageById(id);

      // Extract raw slug if the page path is like /services/residential
      let displaySlug = data.data.slug || '';
      if (isServicesMode && data.data.fullPath?.startsWith('/services/')) {
        displaySlug = data.data.fullPath.replace('/services/', '');
      }

      setFormData({
        title: data.data.title || '',
        slug: displaySlug,
        excerpt: data.data.excerpt || '',
        status: data.data.status || 'DRAFT',
        template: data.data.template || 'default',
        content: data.data.content || { blocks: [] },
        metaTitle: data.data.metaTitle || '',
        metaDescription: data.data.metaDescription || '',
        metaKeywords: data.data.metaKeywords || '',
        includeInSitemap: data.data.includeInSitemap ?? true,
        noIndex: data.data.noIndex ?? false,
        noFollow: data.data.noFollow ?? false,
        canonicalUrl: data.data.canonicalUrl || '',
        ogTitle: data.data.ogTitle || '',
        ogDescription: data.data.ogDescription || '',
        ogImageId: data.data.ogImageId || null
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

    switch (type) {
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
      id: Date.now().toString(),
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
    
    if (isServicesMode) {
      if (payload.slug && !payload.slug.startsWith('services/')) {
        // We prepend 'services/' so the backend builds fullPath as '/services/slug'
        payload.slug = `services/${payload.slug}`;
      } else if (!payload.slug && payload.title) {
         payload.slug = `services/${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      }
      payload.template = 'service-page';
    }

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

      navigate(backPath);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300">Loading editor...</p>
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

      if (isServicesMode) {
        if (payload.slug && !payload.slug.startsWith('services/')) {
          payload.slug = `services/${payload.slug}`;
        } else if (!payload.slug && payload.title) {
           payload.slug = `services/${payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        }
        payload.template = 'service-page';
      }

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
          navigate(`${backPath}/edit/${res.data.id}`);
        }
      } catch (err) {
        console.error('Failed to save page:', err);
        setError(err.response?.data?.message || 'Failed to auto-save. Please try saving manually.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPuckMode(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Standard Editor
            </button>
            <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Puck Visual Editor</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">Click "Publish" in Puck to apply changes to the form</p>
        </div>
        <div className="flex-1 overflow-y-auto h-full min-h-[calc(100vh-70px)]">
          <Puck config={ncPuckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link
            to={backPath}
            className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
              {isEditMode ? 'Edit Page' : (isServicesMode ? 'Create New Service' : 'Create New Page')}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 transition-colors duration-300">
              {isEditMode ? `Editing: ${formData.title}` : 'Draft a new page for your website.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Can permission="page.preview">
            <PreviewManager id={isEditMode ? id : null} entityType="page" />
          </Can>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 cursor-pointer transition-colors"
          >
            <option value="DRAFT">Draft</option>
            
            <Can 
              permission="page.publish" 
              fallback={<option value="PUBLISHED" disabled>Published (Requires Permission)</option>}
            >
              <option value="PUBLISHED">Published</option>
            </Can>

            {isEditMode && <option value="ARCHIVED">Archived</option>}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm transition-colors duration-300">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 transition-colors duration-300">
              <Layout className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              General Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 transition-colors duration-300">Page Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. About Us"
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 transition-colors duration-300">
                  URL Slug
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2 font-normal">(Leave blank to auto-generate)</span>
                </label>
                <div className="flex rounded-xl shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 sm:text-sm font-mono transition-colors duration-300">
                    {isServicesMode ? '/services/' : '/'}
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="about-us"
                    className="flex-1 min-w-0 block w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors font-mono text-sm bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 transition-colors duration-300">Excerpt (Short Description)</label>
                <textarea
                  name="excerpt"
                  rows="2"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A brief summary of this page..."
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Page Builder / Content Blocks */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 transition-colors duration-300">
                  <Type className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                  Content Blocks
                </h2>
                <button
                  type="button"
                  onClick={() => setIsPuckMode(true)}
                  className="px-3 py-1.5 bg-blue-900 dark:bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                >
                  <Layout className="w-4 h-4" /> Edit visually with Puck
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowBlockMenu(!showBlockMenu)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Block <ChevronDown className="w-4 h-4" />
                </button>
                
                {showBlockMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-black/50 rounded-xl py-2 z-20 max-h-[300px] overflow-y-auto transition-colors duration-300">
                    <div className="px-3 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider transition-colors duration-300">Available Blocks</div>
                    {AVAILABLE_BLOCKS.map(b => (
                      <button
                        key={b.type}
                        type="button"
                        onClick={() => addBlock(b.type)}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
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
                <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 transition-colors duration-300">
                  <Type className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors duration-300">No content blocks yet.</p>
                  <button
                    type="button"
                    onClick={() => addBlock('richText')}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Add a Text Block
                  </button>
                </div>
              ) : (
                formData.content.blocks.map((block, index) => (
                  <div key={block.id || index} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-1.5 rounded-full shadow-sm hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                        title="Remove Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center transition-colors duration-300">
                      <span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 w-5 h-5 rounded flex items-center justify-center mr-2 transition-colors duration-300">{index + 1}</span>
                      {AVAILABLE_BLOCKS.find(b => b.type === block.type)?.label || block.type}
                    </div>
                    <div className="p-0 border-t border-zinc-200 dark:border-zinc-800 relative transition-colors duration-300">
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
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6 transition-colors duration-300">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2 transition-colors duration-300">
              <Settings className="w-5 h-5 text-zinc-400 dark:text-zinc-500" /> Advanced SEO
            </h2>

            {/* Standard SEO */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Meta Title</label>
                <input type="text" value={formData.metaTitle || ''} onChange={e => setFormData(p => ({ ...p, metaTitle: e.target.value }))} placeholder="Keep empty to use page title" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Meta Description</label>
                <textarea rows="3" value={formData.metaDescription || ''} onChange={e => setFormData(p => ({ ...p, metaDescription: e.target.value }))} className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm resize-y transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Meta Keywords</label>
                <input type="text" value={formData.metaKeywords || ''} onChange={e => setFormData(p => ({ ...p, metaKeywords: e.target.value }))} placeholder="interior, design, architecture" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors" />
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 transition-colors duration-300">Comma separated</p>
              </div>
            </div>

            {/* Crawler Rules */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors duration-300">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-colors duration-300">Crawler Instructions</h3>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.includeInSitemap} onChange={e => setFormData(p => ({ ...p, includeInSitemap: e.target.checked }))} className="w-4 h-4 text-[#3B82F6] rounded border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 focus:ring-[#3B82F6]" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium transition-colors duration-300">Include in Sitemap.xml</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noIndex} onChange={e => setFormData(p => ({ ...p, noIndex: e.target.checked }))} className="w-4 h-4 text-red-500 rounded border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 focus:ring-red-500" />
                  <div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium block transition-colors duration-300">noIndex (Hide from Google)</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">Search engines will drop this page from results.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noFollow} onChange={e => setFormData(p => ({ ...p, noFollow: e.target.checked }))} className="w-4 h-4 text-amber-500 rounded border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 focus:ring-amber-500" />
                  <div>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium block transition-colors duration-300">noFollow (Ignore Links)</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">Crawlers won't follow any links on this page.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Social Graph */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 transition-colors duration-300">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-colors duration-300">Social Graph & Advanced</h3>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Canonical URL</label>
                <input type="url" value={formData.canonicalUrl || ''} onChange={e => setFormData(p => ({ ...p, canonicalUrl: e.target.value }))} placeholder="https://domain.com/original-source" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors" />
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 transition-colors duration-300">Use only if this content is copied from another URL.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Social Share Title (OG Title)</label>
                <input type="text" value={formData.ogTitle || ''} onChange={e => setFormData(p => ({ ...p, ogTitle: e.target.value }))} placeholder="Facebook/Twitter Title" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">Social Share Description (OG Desc)</label>
                <textarea rows="2" value={formData.ogDescription || ''} onChange={e => setFormData(p => ({ ...p, ogDescription: e.target.value }))} placeholder="Facebook/Twitter Description" className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 text-sm resize-y transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-start mt-8 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-none disabled:opacity-70 text-sm w-full sm:w-auto"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>
    </form>
  );
};

export default PageEditor;