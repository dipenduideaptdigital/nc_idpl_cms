import React from 'react';
import { FileText, Upload } from 'lucide-react';

const OurProjectsCustomization = ({
  ourProjectsData,
  onChange,
  onProjectItemChange,
  onProjectImageUpload,
  previewProjects, // Array of preview URLs for the projects
  previewBottom,   // Preview URL for the bottom graphic image
  bottomImageRef,
  projectImageRefs, // Array of refs for each project's file input
  onImageUpload
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <FileText className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Our Projects Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={ourProjectsData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight in primary color)</label>
            <input 
              type="text" 
              name="title"
              value={ourProjectsData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <textarea 
              name="description"
              value={ourProjectsData.description || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Media Graphic Asset */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Bottom Illustration Graphic</h3>
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800">Interior Foreground Image</h4>
                <p className="text-xs text-zinc-500">Wide silhouette/illustrative image placed above background typography</p>
              </div>
              <button 
                type="button"
                onClick={() => bottomImageRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input 
                type="file" 
                ref={bottomImageRef} 
                onChange={(e) => onImageUpload(e, 'projectsBottom')}
                className="hidden" 
                accept="image/*"
              />
            </div>
            {previewBottom ? (
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                <img src={previewBottom} alt="Projects Bottom Graphic Preview" className="w-full h-full object-contain bg-zinc-100/50" />
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                <span className="text-zinc-400 text-sm">No image uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Projects Cards (5 Items) */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Carousel Projects (5 Items)</h3>
          <div className="space-y-6">
            {(ourProjectsData.projects || []).map((project, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
                
                {/* Project Image Column */}
                <div className="space-y-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold">
                    Project {index + 1}
                  </span>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => projectImageRefs.current[index]?.click()}
                      className="w-full flex items-center justify-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-2 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Upload Image
                    </button>
                    <input 
                      type="file" 
                      ref={el => projectImageRefs.current[index] = el}
                      onChange={(e) => onProjectImageUpload(e, index)}
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>

                  {previewProjects[index] ? (
                    <div className="w-full h-44 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                      <img src={previewProjects[index]} alt={`Project ${index + 1} Preview`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                      <span className="text-zinc-400 text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Project Content Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Category (e.g. LANDSCAPE)</label>
                    <input 
                      type="text" 
                      value={project.category || ''}
                      onChange={(e) => onProjectItemChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Project Title</label>
                    <input 
                      type="text" 
                      value={project.title || ''}
                      onChange={(e) => onProjectItemChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Project Description</label>
                    <textarea 
                      value={project.description || ''}
                      onChange={(e) => onProjectItemChange(index, 'description', e.target.value)}
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

export default OurProjectsCustomization;
