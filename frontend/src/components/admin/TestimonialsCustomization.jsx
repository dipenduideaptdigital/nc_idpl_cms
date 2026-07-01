import React from 'react';
import { User, Upload } from 'lucide-react';

const TestimonialsCustomization = ({
  testimonialsData,
  onChange,
  previewMain,
  previewAuthor,
  mainImageRef,
  authorImageRef,
  onImageUpload,
  onLogoUpload,
  previewLogos,
  logoRefs
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <User className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Testimonials Section</h2>
      </div>

      <div className="p-8 space-y-10">
        {/* Header Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
            <input 
              type="text" 
              name="badgeText"
              value={testimonialsData.badgeText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight, `\n` for newline)</label>
            <input 
              type="text" 
              name="title"
              value={testimonialsData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <textarea 
              name="description"
              value={testimonialsData.description || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Media Block Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800">Testimonial Left Image</h4>
                <p className="text-xs text-zinc-500">Wide office / room render image</p>
              </div>
              <button 
                type="button"
                onClick={() => mainImageRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input 
                type="file" 
                ref={mainImageRef} 
                onChange={(e) => onImageUpload(e, 'testimonialsMain')}
                className="hidden" 
                accept="image/*"
              />
            </div>
            {previewMain ? (
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                <img src={previewMain} alt="Testimonials Main Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                <span className="text-zinc-400 text-sm">No image uploaded</span>
              </div>
            )}
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-zinc-800">Author Profile Image</h4>
                <p className="text-xs text-zinc-500">Square avatar photo</p>
              </div>
              <button 
                type="button"
                onClick={() => authorImageRef.current?.click()}
                className="flex items-center gap-2 text-sm bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input 
                type="file" 
                ref={authorImageRef} 
                onChange={(e) => onImageUpload(e, 'testimonialsAuthor')}
                className="hidden" 
                accept="image/*"
              />
            </div>
            {previewAuthor ? (
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-inner border border-zinc-200 mx-auto">
                <img src={previewAuthor} alt="Author Avatar Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100 mx-auto">
                <span className="text-zinc-400 text-xs">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating and Quote Settings */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Review & Quote Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Rating Value (e.g. 4.80)</label>
              <input 
                type="text" 
                name="ratingValue"
                value={testimonialsData.ratingValue || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Review Count (e.g. 2,688 Reviews)</label>
              <input 
                type="text" 
                name="reviewCount"
                value={testimonialsData.reviewCount || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Concept Summary Text</label>
              <input 
                type="text" 
                name="conceptText"
                value={testimonialsData.conceptText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Author Name</label>
              <input 
                type="text" 
                name="authorName"
                value={testimonialsData.authorName || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Author Role</label>
              <input 
                type="text" 
                name="authorRole"
                value={testimonialsData.authorRole || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Main Quote Content</label>
            <textarea 
              name="mainQuote"
              value={testimonialsData.mainQuote || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Client Brands/Logos settings */}
        <div className="pt-6 border-t border-zinc-100 space-y-6">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">Customer Logos & Badges</h3>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">VIP Customer Headline (Use `[text]` to highlight)</label>
            <input 
              type="text" 
              name="bottomText"
              value={testimonialsData.bottomText || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(testimonialsData.logos || []).map((logo, index) => (
              <div key={index} className="flex flex-col items-center">
                <label className="block text-xs font-medium text-zinc-500 mb-2">Client Logo {index + 1}</label>
                <div 
                  onClick={() => logoRefs.current[index]?.click()}
                  className="w-full h-24 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors overflow-hidden relative"
                >
                  {previewLogos && previewLogos[index] ? (
                    <img src={previewLogos[index]} alt={`Logo ${index + 1}`} className="w-full h-full object-contain p-3" />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-400">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">Upload</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file"
                  ref={el => logoRefs.current[index] = el}
                  onChange={(e) => onLogoUpload(e, index)}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestimonialsCustomization;