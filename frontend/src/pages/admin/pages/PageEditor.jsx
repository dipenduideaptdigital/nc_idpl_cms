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
    { type: 'getStartedCta', label: 'Ripples: Get Started CTA' }
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
          <Puck config={ncPuckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
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
            to={backPath}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {isEditMode ? 'Edit Page' : (isServicesMode ? 'Create New Service' : 'Create New Page')}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
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
            className="px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer"
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
                    {isServicesMode ? '/services/' : '/'}
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-6">
            <h2 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-400" /> Advanced SEO
            </h2>

            {/* Standard SEO */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700">Meta Title</label>
                <input type="text" value={formData.metaTitle || ''} onChange={e => setFormData(p => ({ ...p, metaTitle: e.target.value }))} placeholder="Keep empty to use page title" className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700">Meta Description</label>
                <textarea rows="3" value={formData.metaDescription || ''} onChange={e => setFormData(p => ({ ...p, metaDescription: e.target.value }))} className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm resize-y" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700">Meta Keywords</label>
                <input type="text" value={formData.metaKeywords || ''} onChange={e => setFormData(p => ({ ...p, metaKeywords: e.target.value }))} placeholder="interior, design, architecture" className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm" />
                <p className="text-[10px] text-zinc-400 mt-1">Comma separated</p>
              </div>
            </div>

            {/* Crawler Rules */}
            <div className="pt-4 border-t border-zinc-100 space-y-4">
              <h3 className="text-sm font-bold text-zinc-800">Crawler Instructions</h3>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.includeInSitemap} onChange={e => setFormData(p => ({ ...p, includeInSitemap: e.target.checked }))} className="w-4 h-4 text-[#3B82F6] rounded border-zinc-300 focus:ring-[#3B82F6]" />
                  <span className="text-sm text-zinc-700 font-medium">Include in Sitemap.xml</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noIndex} onChange={e => setFormData(p => ({ ...p, noIndex: e.target.checked }))} className="w-4 h-4 text-red-500 rounded border-zinc-300 focus:ring-red-500" />
                  <div>
                    <span className="text-sm text-zinc-700 font-medium block">noIndex (Hide from Google)</span>
                    <span className="text-xs text-zinc-500">Search engines will drop this page from results.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.noFollow} onChange={e => setFormData(p => ({ ...p, noFollow: e.target.checked }))} className="w-4 h-4 text-amber-500 rounded border-zinc-300 focus:ring-amber-500" />
                  <div>
                    <span className="text-sm text-zinc-700 font-medium block">noFollow (Ignore Links)</span>
                    <span className="text-xs text-zinc-500">Crawlers won't follow any links on this page.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Social Graph */}
            <div className="pt-4 border-t border-zinc-100 space-y-4">
              <h3 className="text-sm font-bold text-zinc-800">Social Graph & Advanced</h3>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700">Canonical URL</label>
                <input type="url" value={formData.canonicalUrl || ''} onChange={e => setFormData(p => ({ ...p, canonicalUrl: e.target.value }))} placeholder="https://domain.com/original-source" className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm" />
                <p className="text-[10px] text-zinc-400 mt-1">Use only if this content is copied from another URL.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700">Social Share Title (OG Title)</label>
                <input type="text" value={formData.ogTitle || ''} onChange={e => setFormData(p => ({ ...p, ogTitle: e.target.value }))} placeholder="Facebook/Twitter Title" className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-zinc-700">Social Share Description (OG Desc)</label>
                <textarea rows="2" value={formData.ogDescription || ''} onChange={e => setFormData(p => ({ ...p, ogDescription: e.target.value }))} placeholder="Facebook/Twitter Description" className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm resize-y" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-start mt-8 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-70 text-sm w-full sm:w-auto"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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