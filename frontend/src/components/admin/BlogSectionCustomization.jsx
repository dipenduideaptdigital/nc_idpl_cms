import React from 'react';
import { FileText, Upload } from 'lucide-react';

const BlogSectionCustomization = ({
  blogSectionData,
  onChange,
  onPostChange,
  onPostImageUpload,
  previewPosts,
  postImageRefs
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <FileText className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Blog & Articles Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={blogSectionData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight, `\n` for newline)</label>
            <input 
              type="text" 
              name="title"
              value={blogSectionData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Blog Cards (3 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Blog Articles (3 Items)</h3>
          <div className="space-y-6">
            {(blogSectionData.posts || []).map((post, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
                
                {/* Project Image Column */}
                <div className="space-y-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold">
                    Article {index + 1}
                  </span>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => postImageRefs.current[index]?.click()}
                      className="w-full flex items-center justify-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-2 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Upload Cover
                    </button>
                    <input 
                      type="file" 
                      ref={el => postImageRefs.current[index] = el}
                      onChange={(e) => onPostImageUpload(e, index)}
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>

                  {previewPosts[index] ? (
                    <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                      <img src={previewPosts[index]} alt={`Article ${index + 1} Preview`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                      <span className="text-zinc-400 text-xs">No cover image</span>
                    </div>
                  )}
                </div>

                {/* Content Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Author (e.g. Admin)</label>
                    <input 
                      type="text" 
                      value={post.author || ''}
                      onChange={(e) => onPostChange(index, 'author', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={post.title || ''}
                      onChange={(e) => onPostChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Excerpt / Intro Summary</label>
                    <textarea 
                      value={post.excerpt || ''}
                      onChange={(e) => onPostChange(index, 'excerpt', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm resize-none"
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogSectionCustomization;
