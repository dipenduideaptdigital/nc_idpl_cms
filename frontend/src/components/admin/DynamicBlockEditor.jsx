import React, { useRef, useState, useEffect } from 'react';
import apiClient from '../../api/client';
import HeroCustomization from './HeroCustomization';
import ServicesCustomization from './ServicesCustomization';
import AboutCustomization from './AboutCustomization';
import OurServicesCustomization from './OurServicesCustomization';
import HowWeWorkCustomization from './HowWeWorkCustomization';
import OurProjectsCustomization from './OurProjectsCustomization';
import PanoramasCustomization from './PanoramasCustomization';
import TeamCustomization from './TeamCustomization';
import TestimonialsCustomization from './TestimonialsCustomization';
import VideoBannerCustomization from './VideoBannerCustomization';
import BlogSectionCustomization from './BlogSectionCustomization';
import GalleryCustomization from './GalleryCustomization';
import CtaCustomization from './CtaCustomization';
import { Type } from 'lucide-react';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${path}`;
};

const DynamicBlockEditor = ({ block, index, updateBlockData }) => {
  const { type, data } = block;

  const [availableForms, setAvailableForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(false);

  useEffect(() => {
    if (type === 'contactForm') {
      const fetchForms = async () => {
        try {
          setLoadingForms(true);
          const res = await apiClient.get('/admin/contact-forms');
          if (res.data?.success && res.data?.data) {
            setAvailableForms(res.data.data);
          }
        } catch (err) {
          console.error('Failed to fetch contact forms:', err);
        } finally {
          setLoadingForms(false);
        }
      };
      fetchForms();
    }
  }, [type]);
  // Generic change handler for simple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBlockData(index, name, value);
  };

  // Image Upload Handler
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.data.url) {
        updateBlockData(index, fieldName, res.data.data.url);
      }
    } catch (err) {
      console.error(`Failed to upload image for ${fieldName}:`, err);
      alert('Image upload failed. Max 5MB.');
    } finally {
      e.target.value = '';
    }
  };

  // Array Item Change Handlers
  const handleArrayItemChange = (arrayField, itemIndex, itemField, value) => {
    const newArray = [...(data[arrayField] || [])];
    newArray[itemIndex] = { ...newArray[itemIndex], [itemField]: value };
    updateBlockData(index, arrayField, newArray);
  };

  const handleArrayStringChange = (arrayField, itemIndex, value) => {
    const newArray = [...(data[arrayField] || [])];
    newArray[itemIndex] = value;
    updateBlockData(index, arrayField, newArray);
  };

  // Refs for file inputs
  const refs = {
    backImage: useRef(null),
    frontImage: useRef(null),
    aboutImage: useRef(null),
    serviceMain: useRef(null),
    serviceBottom: useRef(null),
    projectsBottom: useRef(null),
    panorama: useRef(null),
    team: useRef(null),
    testimonialsMain: useRef(null),
    testimonialsAuthor: useRef(null),
    videoBanner: useRef(null),
  };

  switch (type) {
    case 'hero':
      return (
        <HeroCustomization
          heroData={data}
          onChange={handleChange}
          previewBack={getAssetUrl(data.backgroundImage)}
          previewFront={getAssetUrl(data.frontImage)}
          backImageRef={refs.backImage}
          frontImageRef={refs.frontImage}
          onImageUpload={(e, type) => handleImageUpload(e, type === 'background' ? 'backgroundImage' : 'frontImage')}
        />
      );
    case 'services':
      return (
        <ServicesCustomization
          servicesData={data}
          onChange={handleChange}
          onServiceItemChange={(idx, f, v) => handleArrayItemChange('services', idx, f, v)}
        />
      );
    case 'about':
      return (
        <AboutCustomization
          aboutData={data}
          onChange={handleChange}
          previewAbout={getAssetUrl(data.image)}
          aboutImageRef={refs.aboutImage}
          onImageUpload={(e) => handleImageUpload(e, 'image')}
          onHighlightChange={(idx, v) => handleArrayStringChange('highlights', idx, v)}
        />
      );
    case 'our_services':
      return (
        <OurServicesCustomization
          ourServicesData={data}
          onChange={handleChange}
          previewOurServicesMain={getAssetUrl(data.image)}
          previewOurServicesBottom={getAssetUrl(data.bottomImage)}
          ourServicesMainRef={refs.serviceMain}
          ourServicesBottomRef={refs.serviceBottom}
          onImageUpload={(e, type) => handleImageUpload(e, type === 'serviceMain' ? 'image' : 'bottomImage')}
          onServiceItemChange={(idx, f, v) => handleArrayItemChange('services', idx, f, v)}
          onStatChange={(idx, f, v) => handleArrayItemChange('stats', idx, f, v)}
        />
      );
    case 'how_we_work':
      return (
        <HowWeWorkCustomization
          howWeWorkData={data}
          onChange={handleChange}
          onStepChange={(idx, f, v) => handleArrayItemChange('steps', idx, f, v)}
        />
      );
    case 'our_projects':
      return (
        <OurProjectsCustomization
          ourProjectsData={data}
          onChange={handleChange}
          previewOurProjectsBottom={getAssetUrl(data.bottomImage)}
          previewOurProjectsList={(data.projects || []).map(p => getAssetUrl(p.image))}
          ourProjectsBottomRef={refs.projectsBottom}
          onImageUpload={(e) => handleImageUpload(e, 'bottomImage')}
          onProjectImageUpload={async (e, idx) => {
            const file = e.target.files[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('image', file);
            try {
              const res = await apiClient.post('/uploads/image', fd);
              if (res.data.success) {
                handleArrayItemChange('projects', idx, 'image', res.data.data.url);
              }
            } catch (err) { console.error(err); }
          }}
          onProjectItemChange={(idx, f, v) => handleArrayItemChange('projects', idx, f, v)}
        />
      );
    case 'panoramas':
      return (
        <PanoramasCustomization
          panoramasData={data}
          onChange={handleChange}
          previewPanoramasView={getAssetUrl(data.image)}
          panoramasViewRef={refs.panorama}
          onImageUpload={(e) => handleImageUpload(e, 'image')}
        />
      );
    case 'team':
      return (
        <TeamCustomization
          teamData={data}
          onChange={handleChange}
          previewTeamImage={getAssetUrl(data.image)}
          teamImageRef={refs.team}
          onImageUpload={(e) => handleImageUpload(e, 'image')}
          onMemberChange={(idx, f, v) => handleArrayItemChange('members', idx, f, v)}
        />
      );
    case 'testimonials':
      return (
        <TestimonialsCustomization
          testimonialsData={data}
          onChange={handleChange}
          previewTestimonialsMain={getAssetUrl(data.image)}
          previewTestimonialsAuthor={getAssetUrl(data.authorImage)}
          testimonialsMainRef={refs.testimonialsMain}
          testimonialsAuthorRef={refs.testimonialsAuthor}
          onImageUpload={(e, type) => handleImageUpload(e, type === 'testimonialsMain' ? 'image' : 'authorImage')}
          onLogoChange={(idx, v) => handleArrayStringChange('logos', idx, v)}
        />
      );
    case 'video_banner':
      return (
        <VideoBannerCustomization
          videoBannerData={data}
          onChange={handleChange}
          previewVideoBannerCover={getAssetUrl(data.image)}
          videoBannerRef={refs.videoBanner}
          onImageUpload={(e) => handleImageUpload(e, 'image')}
        />
      );
    case 'blog_section':
      return (
        <BlogSectionCustomization
          blogSectionData={data}
          onChange={handleChange}
          previewBlogPosts={(data.posts || []).map(p => getAssetUrl(p.image))}
          onPostImageUpload={async (e, idx) => {
            const file = e.target.files[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('image', file);
            try {
              const res = await apiClient.post('/uploads/image', fd);
              if (res.data.success) {
                handleArrayItemChange('posts', idx, 'image', res.data.data.url);
              }
            } catch (err) { console.error(err); }
          }}
          onPostItemChange={(idx, f, v) => handleArrayItemChange('posts', idx, f, v)}
        />
      );
    case 'gallery':
      return (
        <GalleryCustomization
          galleryData={data}
          onChange={handleChange}
          previewGalleryImages={(data.images || []).map(img => getAssetUrl(img))}
          onGalleryImageUpload={async (e, idx) => {
            const file = e.target.files[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('image', file);
            try {
              const res = await apiClient.post('/uploads/image', fd);
              if (res.data.success) {
                handleArrayStringChange('images', idx, res.data.data.url);
              }
            } catch (err) { console.error(err); }
          }}
        />
      );
    case 'cta':
      return (
        <CtaCustomization
          ctaData={data}
          onChange={handleChange}
        />
      );
    case 'richText':
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-8 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
            <Type className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-semibold text-zinc-800">Rich Text Editor</h2>
          </div>
          <div className="p-8">
            <textarea
              rows="8"
              value={data.content || ''}
              onChange={(e) => updateBlockData(index, 'content', e.target.value)}
              placeholder="Enter your HTML or text content here..."
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors font-mono text-sm bg-zinc-50/50"
            ></textarea>
          </div>
        </div>
      );

    case 'contactForm':
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-8 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
            <Type className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-semibold text-zinc-800">Contact Form Module</h2>
          </div>
          <div className="p-8 space-y-6">
            
            {/* DYNAMIC DROPDOWN API DRIVEN */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Target Form *</label>
              {loadingForms ? (
                <div className="w-full px-4 py-3 border border-zinc-200 rounded-xl bg-zinc-50 text-sm text-zinc-500 animate-pulse">
                  Loading available forms from database...
                </div>
              ) : (
                <select
                  value={data.formId || ''}
                  onChange={(e) => updateBlockData(index, 'formId', e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm cursor-pointer"
                >
                  <option value="" disabled>-- Select a Contact Form --</option>
                  {availableForms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.name} ({form.slug}) - {form.isActive ? 'Active' : 'Inactive'}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-zinc-400 mt-1.5">
                Select the form you want to display. You can create new forms from the Contact Forms module.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Form Override Title</label>
                <input 
                  type="text" 
                  value={data.formTitle || ''} 
                  onChange={(e) => updateBlockData(index, 'formTitle', e.target.value)}
                  placeholder="e.g. Reach Out Today"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Submit Button Text</label>
                <input 
                  type="text" 
                  value={data.submitButtonText || ''} 
                  onChange={(e) => updateBlockData(index, 'submitButtonText', e.target.value)}
                  placeholder="e.g. Send Application"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Optional Success Redirect Path</label>
              <input 
                type="text" 
                value={data.redirectPath || ''} 
                onChange={(e) => updateBlockData(index, 'redirectPath', e.target.value)}
                placeholder="e.g. /thank-you"
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors bg-zinc-50/50 text-sm"
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                Leave blank to stay on the same page. Must start with a forward slash (/).
              </p>
            </div>

          </div>
        </div>
      );
    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
          Unknown block type: {type}
        </div>
      );
  }
};

export default DynamicBlockEditor;