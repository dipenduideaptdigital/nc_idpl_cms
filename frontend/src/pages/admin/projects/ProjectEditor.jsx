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
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors outline-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-zinc-500 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 truncate">
              {isOpen ? 'Close Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
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
    title: '', category: 'Residential', year: '', location: '', client: '', area: '', 
    description: '', details: '', status: 'PUBLISHED', featuredImageId: '',
    bulletPoints: [''], 
    spaces: [{ size: '', label: '' }] 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      projectsApi.getProjectById(id).then(res => {
        const data = res.data;
        
        if (!data.bulletPoints || data.bulletPoints.length === 0) data.bulletPoints = [''];
        if (!data.spaces || data.spaces.length === 0) data.spaces = [{ size: '', label: '' }];
        
        data.featuredImageId = data.featuredImage?.url || data.featuredImageId || '';
        
        setFormData(data);
      }).catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBulletChange = (index, value) => {
    const newBullets = [...formData.bulletPoints];
    newBullets[index] = value;
    setFormData({ ...formData, bulletPoints: newBullets });
  };
  const addBullet = () => setFormData({ ...formData, bulletPoints: [...formData.bulletPoints, ''] });
  const removeBullet = (index) => setFormData({ ...formData, bulletPoints: formData.bulletPoints.filter((_, i) => i !== index) });

  const handleSpaceChange = (index, field, value) => {
    const newSpaces = [...formData.spaces];
    newSpaces[index][field] = value;
    setFormData({ ...formData, spaces: newSpaces });
  };
  const addSpace = () => setFormData({ ...formData, spaces: [...formData.spaces, { size: '', label: '' }] });
  const removeSpace = (index) => setFormData({ ...formData, spaces: formData.spaces.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      
      payload.bulletPoints = payload.bulletPoints.filter(b => b.trim() !== '');
      payload.spaces = payload.spaces.filter(s => s.size.trim() !== '' && s.label.trim() !== '');

      if (!payload.featuredImageId || payload.featuredImageId.trim() === '') {
        payload.featuredImageId = null; 
      }

      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.featuredImage;

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
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="p-2 hover:bg-zinc-100 rounded-full"><ArrowLeft className="w-5 h-5"/></Link>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Project' : 'Add New Project'}</h1>
        </div>
        <Can permission={isEditMode ? 'project.edit' : 'project.create'}>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl flex items-center gap-2">
            <Save className="w-4 h-4" /> Save
          </button>
        </Can>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Basic Details</h2>
            <div><label className="text-sm font-medium">Title *</label><input required name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl" /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl">
                  <option>Residential</option><option>Commercial</option><option>Landscape</option><option>Interior</option>
                </select>
              </div>
              <div><label className="text-sm font-medium">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl">
                  <option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Year</label><input name="year" value={formData.year} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl" /></div>
              <div><label className="text-sm font-medium">Location</label><input name="location" value={formData.location} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl" /></div>
              <div><label className="text-sm font-medium">Client</label><input name="client" value={formData.client} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl" /></div>
              <div><label className="text-sm font-medium">Area (sq.ft)</label><input name="area" value={formData.area} onChange={handleChange} className="w-full mt-1 p-2 border rounded-xl" /></div>
            </div>
            <CollapsibleTiptap
              label="Short Description (List View)"
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
            />

            <CollapsibleTiptap
              label="Full Details (Project Page)"
              value={formData.details}
              onChange={(val) => setFormData({ ...formData, details: val })}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="font-semibold text-lg">Highlight Bullet Points</h2>
                <button type="button" onClick={addBullet} className="text-sm text-blue-600 flex items-center gap-1"><Plus className="w-4 h-4"/> Add Point</button>
              </div>
              {formData.bulletPoints.map((bullet, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input value={bullet} onChange={(e) => handleBulletChange(index, e.target.value)} placeholder="e.g., Experienced engineers..." className="w-full p-2 border rounded-xl" />
                  <button type="button" onClick={() => removeBullet(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="font-semibold text-lg">Spaces Breakdown</h2>
                <button type="button" onClick={addSpace} className="text-sm text-blue-600 flex items-center gap-1"><Plus className="w-4 h-4"/> Add Space</button>
              </div>
              {formData.spaces.map((space, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input value={space.size} onChange={(e) => handleSpaceChange(index, 'size', e.target.value)} placeholder="e.g., (30M2)" className="w-1/3 p-2 border rounded-xl" />
                  <input value={space.label} onChange={(e) => handleSpaceChange(index, 'label', e.target.value)} placeholder="e.g., Bedroom" className="w-full p-2 border rounded-xl" />
                  <button type="button" onClick={() => removeSpace(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="font-semibold text-lg border-b pb-2 mb-4">Featured Image</h2>
            <ImageField value={formData.featuredImageId} onChange={(val) => setFormData({...formData, featuredImageId: val})} />
          </div>
        </div>
      </div>
      <div className="flex justify-start mt-8 pt-4">
        <Can permission={isEditMode ? 'project.edit' : 'project.create'}>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-zinc-900/20 disabled:opacity-70 text-sm"
          >
            <Save className="w-5 h-5" /> 
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </Can>
      </div>
    </form>
  );
};

export default ProjectEditor;