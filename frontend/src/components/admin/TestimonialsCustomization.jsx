import React, { useState } from 'react';
import { User, Upload, MessageSquare } from 'lucide-react';

const TestimonialsCustomization = ({
  testimonialsData,
  onChange,
  onItemChange,
  previewMain,
  previewAuthor,
  mainImageRef,
  authorImageRef,
  onImageUpload,
  onLogoUpload,
  previewLogos,
  logoRefs
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const defaultItems = [
    {
      ratingValue: testimonialsData.ratingValue || "4.80",
      reviewCount: testimonialsData.reviewCount || "2,688 Reviews",
      conceptText: testimonialsData.conceptText || "From Concept To Reality, The Team Turned My Vision Into A Stunning, Livable Space. I Couldn't Be Happier With This!",
      mainQuote: testimonialsData.mainQuote || "I absolutely love my new modern living room! The clean lines, neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!",
      authorName: testimonialsData.authorName || "Morgan Dufresne",
      authorRole: testimonialsData.authorRole || "Homeowner",
      image: testimonialsData.image || "",
      authorImage: testimonialsData.authorImage || ""
    },
    {
      ratingValue: "4.90",
      reviewCount: "1,420 Reviews",
      conceptText: "Design. Build. Deliver. Everything our office needed—handled end to end.",
      mainQuote: "It is a pleasure to work with subhAAkritee. Together we created our office interior decoration. The interior designing, planning and decoration is just GREAT! All members are cooperative.",
      authorName: "Tanmoy",
      authorRole: "Company owner",
      image: "",
      authorImage: ""
    },
    {
      ratingValue: "4.95",
      reviewCount: "850 Reviews",
      conceptText: "From dream homes to dynamic business spaces, they create architecture that reflects your vision.",
      mainQuote: "They delivered outstanding architectural planning. The space layout and structural designs are perfect. Exceeded our expectations at every level of the project.",
      authorName: "Rajesh Kumar",
      authorRole: "Property Developer",
      image: "",
      authorImage: ""
    }
  ];

  const items = (testimonialsData.items && testimonialsData.items.length >= 3)
    ? testimonialsData.items
    : defaultItems;

  const currentItem = items[activeTab] || defaultItems[activeTab];

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (onItemChange) {
      onItemChange(activeTab, name, value);
    } else if (onChange) {
      onChange(e);
    }
  };

  const getPreviewImage = (type) => {
    if (type === 'main') {
      if (Array.isArray(previewMain) && previewMain[activeTab]) return previewMain[activeTab];
      if (activeTab === 0 && typeof previewMain === 'string' && previewMain) return previewMain;
      return currentItem.image ? currentItem.image : '';
    }
    if (type === 'author') {
      if (Array.isArray(previewAuthor) && previewAuthor[activeTab]) return previewAuthor[activeTab];
      if (activeTab === 0 && typeof previewAuthor === 'string' && previewAuthor) return previewAuthor;
      return currentItem.authorImage ? currentItem.authorImage : '';
    }
    return '';
  };

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
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title (Use `[text]` to highlight, `\n` for newline)</label>
            <input 
              type="text" 
              name="title"
              value={testimonialsData.title || ''}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <textarea 
              name="description"
              value={testimonialsData.description || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none text-sm"
            />
          </div>
        </div>

        {/* Horizontal Tabs to select Testimonial 1, 2, or 3 */}
        <div className="pt-6 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">Testimonials Slider Items</h3>
              <p className="text-xs text-zinc-500 mt-1">Select a testimonial tab below to customize its quote, author details, review score, and images.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5 bg-zinc-100 rounded-2xl w-fit mb-8">
            {['Testimonial 1', 'Testimonial 2', 'Testimonial 3'].map((tabLabel, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === idx
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {tabLabel}
              </button>
            ))}
          </div>

          {/* Active Testimonial Item Form */}
          <div className="bg-zinc-50/60 border border-zinc-200/80 rounded-2xl p-6 md:p-8 space-y-8">
            
            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-zinc-800">Testimonial {activeTab + 1} Image</h4>
                    <p className="text-xs text-zinc-500">Wide showcase / room render image</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => mainImageRef.current?.click()}
                    className="flex items-center gap-2 text-sm bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input 
                    type="file" 
                    ref={mainImageRef} 
                    onChange={(e) => onImageUpload(e, 'testimonialsMain', activeTab)}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                {getPreviewImage('main') ? (
                  <div className="w-full h-40 rounded-xl overflow-hidden shadow-inner border border-zinc-200">
                    <img src={getPreviewImage('main')} alt={`Testimonial ${activeTab + 1} Preview`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50">
                    <span className="text-zinc-400 text-sm">No image uploaded</span>
                  </div>
                )}
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-zinc-800">Author Profile Image</h4>
                    <p className="text-xs text-zinc-500">Square avatar photo</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => authorImageRef.current?.click()}
                    className="flex items-center gap-2 text-sm bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-zinc-900 hover:text-zinc-900 transition-colors shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <input 
                    type="file" 
                    ref={authorImageRef} 
                    onChange={(e) => onImageUpload(e, 'testimonialsAuthor', activeTab)}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                {getPreviewImage('author') ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-inner border border-zinc-200 mx-auto">
                    <img src={getPreviewImage('author')} alt="Author Avatar Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50 mx-auto">
                    <span className="text-zinc-400 text-xs">No avatar</span>
                  </div>
                )}
              </div>
            </div>

            {/* Review & Quote Settings */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Rating Value (e.g. 4.80)</label>
                  <input 
                    type="text" 
                    name="ratingValue"
                    value={currentItem.ratingValue || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Review Count (e.g. 2,688 Reviews)</label>
                  <input 
                    type="text" 
                    name="reviewCount"
                    value={currentItem.reviewCount || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Concept Summary Text</label>
                  <input 
                    type="text" 
                    name="conceptText"
                    value={currentItem.conceptText || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Author Name</label>
                  <input 
                    type="text" 
                    name="authorName"
                    value={currentItem.authorName || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Author Role</label>
                  <input 
                    type="text" 
                    name="authorRole"
                    value={currentItem.authorRole || ''}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Main Quote Content (Testimonial {activeTab + 1})</label>
                <textarea 
                  name="mainQuote"
                  value={currentItem.mainQuote || ''}
                  onChange={handleFieldChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all resize-none text-sm leading-relaxed"
                />
              </div>
            </div>

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
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
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