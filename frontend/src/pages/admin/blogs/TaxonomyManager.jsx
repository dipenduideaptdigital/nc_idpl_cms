import React, { useState, useEffect } from 'react';
import { Tag, Folder, Plus, Trash2, AlertCircle } from 'lucide-react';
import { blogsApi } from '../../../api/blogs';
import { Can } from '../../../components/shared/Can';

const TaxonomyManager = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        blogsApi.getPublicCategories(),
        blogsApi.getPublicTags()
      ]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (err) {
      setError('Failed to fetch taxonomies.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await blogsApi.createCategory({ name: newCat });
      setNewCat('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    try {
      await blogsApi.createTag({ name: newTag });
      setNewTag('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding tag');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type}? It will fail if currently used by any blog.`)) return;
    try {
      if (type === 'category') await blogsApi.deleteCategory(id);
      else await blogsApi.deleteTag(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || `Cannot delete. It is actively linked to a blog post.`);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Categories & Tags</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage blog classification taxonomies.</p>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Categories Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50">
            <Folder className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold">Categories</h2>
          </div>
          <div className="p-6">
            <Can permission="taxonomy.create">
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input type="text" value={newCat} onChange={(e)=>setNewCat(e.target.value)} placeholder="New Category Name" className="flex-1 px-4 py-2 border rounded-xl bg-zinc-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-zinc-800"><Plus className="w-4 h-4"/> Add</button>
              </form>
            </Can>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {categories.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-zinc-50 transition-colors">
                  <div>
                    <span className="font-bold text-sm text-zinc-800 block">{c.name}</span>
                    <span className="text-xs text-zinc-400 font-mono">/{c.slug}</span>
                  </div>
                  <button onClick={() => handleDelete(c.id, 'category')} className="text-zinc-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Can permission="taxonomy.delete">
                      <Trash2 className="w-4 h-4"/>
                    </Can>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50">
            <Tag className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold">Tags</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddTag} className="flex gap-2 mb-6">
              <input type="text" value={newTag} onChange={(e)=>setNewTag(e.target.value)} placeholder="New Tag Name" className="flex-1 px-4 py-2 border rounded-xl bg-zinc-50 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"/>
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-zinc-800"><Plus className="w-4 h-4"/> Add</button>
            </form>
            <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
              {tags.map(t => (
                <div key={t.id} className="flex items-center gap-2 pl-3 pr-1 py-1 border border-zinc-200 bg-zinc-50 rounded-full text-sm font-medium">
                  #{t.name}
                  <Can permission="taxonomy.delete">
                    <button onClick={() => handleDelete(t.id, 'tag')} className="text-zinc-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm">
                      <Trash2 className="w-3 h-3"/>
                    </button>
                  </Can>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaxonomyManager;