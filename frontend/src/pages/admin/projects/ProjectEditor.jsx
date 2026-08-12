import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectsApi } from '../../../api/projects';
import ImageField from '../../../components/admin/ImageField';
import TipTapEditor from '../../../components/admin/TipTapEditor'; 
import { Save, ArrowLeft, Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import Can from '../../../components/shared/Can';

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
      {label && <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-zinc-100">{label}</label>}
      <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 dark:text-emerald-400 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
              {isOpen ? 'Close Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
        </button>
        {isOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectEditor = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', category: 'AQUASCAPE ARCHITECTURE', year: '', location: '', 
    subtitle: '', specifications: '', details: '', status: 'PUBLISHED', 
    featuredImageId: '', heroImageId: '', galleryImages: ['']
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      projectsApi.getProjectById(id).then(res => {
        const data = res.data;
        
        if (!data.galleryImages || !Array.isArray(data.galleryImages) || data.galleryImages.length === 0) {
            data.galleryImages = [''];
        }
        
        data.featuredImageId = data.featuredImage?.url || data.featuredImageId || '';
        data.heroImageId = data.heroImage?.url || data.heroImageId || '';
        
        setFormData(data);
      }).catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Gallery Array Handlers
  const handleGalleryChange = (index, value) => {
    const newGallery = [...formData.galleryImages];
    newGallery[index] = value;
    setFormData({ ...formData, galleryImages: newGallery });
  };
  const addGalleryImage = () => setFormData({ ...formData, galleryImages: [...formData.galleryImages, ''] });
  const removeGalleryImage = (index) => setFormData({ ...formData, galleryImages: formData.galleryImages.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      
      payload.galleryImages = payload.galleryImages.filter(img => img && img.trim() !== '');

      if (!payload.featuredImageId || payload.featuredImageId.trim() === '') payload.featuredImageId = null;
      if (!payload.heroImageId || payload.heroImageId.trim() === '') payload.heroImageId = null;

      delete payload.id; delete payload.createdAt; delete payload.updatedAt;
      delete payload.featuredImage; delete payload.heroImage;

      if (isEditMode) await projectsApi.updateProject(id, payload);
      else await projectsApi.createProject(payload);
      
      navigate('/admin/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-900 dark:text-zinc-100"><ArrowLeft className="w-5 h-5"/></Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isEditMode ? 'Edit Project' : 'Add New Project'}</h1>
        </div>
        <Can permission={isEditMode ? 'project.edit' : 'project.create'}>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-500 transition-colors text-white rounded-xl flex items-center gap-2 disabled:opacity-70">
            <Save className="w-4 h-4" /> Save
          </button>
        </Can>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm space-y-4 border border-zinc-100 dark:border-zinc-800">
            <h2 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4 text-zinc-900 dark:text-zinc-100">Project Information</h2>
            
            <div><label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Title *</label><input required name="title" value={formData.title} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 outline-none transition-colors" /></div>
            <div><label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Tagline / Subtitle</label><input name="subtitle" value={formData.subtitle || ''} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 outline-none transition-colors" placeholder="LIVING ART UNDER WATER" /></div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Category</label>
                <input name="category" value={formData.category} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 transition-colors" placeholder="e.g. AQUASCAPE ARCHITECTURE" />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors">
                  <option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Year</label><input name="year" value={formData.year} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 transition-colors" /></div>
              <div><label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Location</label><input name="location" value={formData.location} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 transition-colors" /></div>
              <div><label className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Dimensions / Specifications</label><input name="specifications" value={formData.specifications || ''} onChange={handleChange} className="w-full mt-1.5 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-400/40 transition-colors" placeholder="e.g. 60X90X60" /></div>
            </div>
            
            <div className="pt-4">
              <CollapsibleTiptap label="Project Overview Description" value={formData.details} onChange={(val) => setFormData({ ...formData, details: val })} />
            </div>
          </div>

          {/* Stack Frames Gallery */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Stack Frames Gallery</h2>
              <button type="button" onClick={addGalleryImage} className="text-sm font-bold text-blue-600 dark:text-emerald-400 flex items-center gap-1 bg-blue-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"><Plus className="w-4 h-4"/> Add Image</button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">These images will appear in the stacked shifting animation at the bottom of the project page.</p>
            
            <div className="space-y-4">
                {formData.galleryImages.map((img, index) => (
                <div key={index} className="flex gap-4 p-5 border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 rounded-xl relative">
                    <button type="button" onClick={() => removeGalleryImage(index)} className="absolute right-3 top-3 p-1.5 text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-950/40 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                    <div className="w-full pr-8">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">Image {index + 1}</label>
                    <ImageField value={img} onChange={(val) => handleGalleryChange(index, val)} />
                    </div>
                </div>
                ))}
            </div>
          </div>

        </div>

        {/* Sidebar Image Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h2 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4 text-zinc-900 dark:text-zinc-100">Main Hero Background</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Appears at the very top of the project detail page.</p>
            <ImageField value={formData.heroImageId} onChange={(val) => setFormData({...formData, heroImageId: val})} />
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h2 className="font-semibold text-lg border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4 text-zinc-900 dark:text-zinc-100">Featured Thumbnail</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Appears on the main projects listing grid.</p>
            <ImageField value={formData.featuredImageId} onChange={(val) => setFormData({...formData, featuredImageId: val})} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-start mt-8 pt-4">
        <Can permission={isEditMode ? 'project.edit' : 'project.create'}>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-500 text-white rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-70">
            <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </Can>
      </div>
    </form>
  );
};

export default ProjectEditor;