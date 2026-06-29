import React, { useState, useEffect } from 'react';
import { Archive, Stamp, Plus, Trash2, AlertCircle } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#DDD6C7] border-t-[#B5563A] rounded-full animate-spin"></div>
        <p className="text-sm font-mono uppercase tracking-wider text-[#8A8378]">Retrieving records…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-[#2B2A28]">

      {/* Masthead */}
      <div className="border-b-4 border-double border-[#2B2A28] pb-4 mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#B5563A] font-bold mb-1.5">Taxonomy Register</p>
        <h1 className="text-3xl font-serif font-bold text-[#2B2A28]">Categories &amp; Tags</h1>
        <p className="text-sm text-[#8A8378] mt-1 font-serif italic">Manage blog classification taxonomies.</p>
      </div>

      {error && (
        <div className="border border-[#B5563A]/30 bg-[#B5563A]/5 text-[#8a3a26] px-4 py-3 mb-6 flex items-center gap-2 font-mono text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">

        {/* Categories Drawer */}
        <div>
          <div className="flex items-end justify-between border-b-2 border-[#2B2A28] pb-2 mb-5">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#B5563A]" />
              <h2 className="font-serif text-lg font-bold tracking-tight">Categories</h2>
            </div>
            <span className="font-mono text-[11px] text-[#8A8378] tabular-nums">
              {String(categories.length).padStart(2, '0')} entries
            </span>
          </div>

          <Can permission="taxonomy.create">
            <form onSubmit={handleAddCategory} className="flex gap-0 mb-6 border border-[#DDD6C7] focus-within:border-[#B5563A] transition-colors">
              <input
                type="text"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Name a new category…"
                className="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm font-serif placeholder:text-[#8A8378]/70"
              />
              <button
                type="submit"
                className="bg-[#2B2A28] text-[#FAF7F0] px-4 text-sm font-mono uppercase tracking-wide flex items-center gap-1.5 hover:bg-[#B5563A] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> File
              </button>
            </form>
          </Can>

          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {categories.length === 0 && (
              <p className="text-sm font-serif italic text-[#8A8378] py-4">No categories filed yet.</p>
            )}
            {categories.map((c, idx) => (
              <div
                key={c.id}
                className="flex justify-between items-center py-3 border-b border-dotted border-[#DDD6C7] group"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-[11px] text-[#B5563A] tabular-nums flex-shrink-0">
                    No.{String(idx + 1).padStart(3, '0')}
                  </span>
                  <div className="min-w-0">
                    <span className="font-serif font-semibold text-[15px] block truncate">{c.name}</span>
                    <span className="text-[11px] text-[#8A8378] font-mono">/{c.slug}</span>
                  </div>
                </div>
                <Can permission="taxonomy.delete">
                  <button
                    onClick={() => handleDelete(c.id, 'category')}
                    className="text-[#DDD6C7] hover:text-[#B5563A] p-1.5 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Can>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Drawer */}
        <div>
          <div className="flex items-end justify-between border-b-2 border-[#2B2A28] pb-2 mb-5">
            <div className="flex items-center gap-2">
              <Stamp className="w-4 h-4 text-[#5B6B4F]" />
              <h2 className="font-serif text-lg font-bold tracking-tight">Tags</h2>
            </div>
            <span className="font-mono text-[11px] text-[#8A8378] tabular-nums">
              {String(tags.length).padStart(2, '0')} entries
            </span>
          </div>

          <form onSubmit={handleAddTag} className="flex gap-0 mb-6 border border-[#DDD6C7] focus-within:border-[#5B6B4F] transition-colors">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Name a new tag…"
              className="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm font-serif placeholder:text-[#8A8378]/70"
            />
            <button
              type="submit"
              className="bg-[#2B2A28] text-[#FAF7F0] px-4 text-sm font-mono uppercase tracking-wide flex items-center gap-1.5 hover:bg-[#5B6B4F] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Stamp
            </button>
          </form>

          <div className="flex flex-wrap gap-2.5 max-h-[400px] overflow-y-auto content-start">
            {tags.length === 0 && (
              <p className="text-sm font-serif italic text-[#8A8378] py-4 w-full">No tags stamped yet.</p>
            )}
            {tags.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 border border-dashed border-[#5B6B4F]/40 bg-[#5B6B4F]/[0.04] text-[#3F4A38] text-[13px] font-mono"
              >
                {t.name}
                <Can permission="taxonomy.delete">
                  <button
                    onClick={() => handleDelete(t.id, 'tag')}
                    className="text-[#5B6B4F]/50 hover:text-[#B5563A] p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Can>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaxonomyManager;