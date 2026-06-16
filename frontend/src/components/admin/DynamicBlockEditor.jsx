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
import { Type, Trash, Plus } from 'lucide-react';

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

  const renderGenericFields = (fieldsConfig) => (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <Type className="w-5 h-5 text-zinc-700" />
        <h2 className="text-lg font-semibold text-zinc-800">Customize Block</h2>
      </div>
      <div className="p-8 space-y-4">
        {fieldsConfig.map((field, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 capitalize">
              {field.name.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                rows="4"
                name={field.name}
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50"
              />
            ) : field.type === 'image' ? (
              <div>
                {data[field.name] && <img src={getAssetUrl(data[field.name])} alt="preview" className="h-32 object-cover rounded mb-2 border border-zinc-200" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, field.name)}
                  className="text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
              </div>
            ) : field.type === 'array' ? (
              <div className="space-y-4 border border-zinc-200 rounded-xl p-4 bg-zinc-50/50">
                {((data[field.name] === undefined ? field.defaultArray : data[field.name]) || []).map((item, itemIdx) => (
                  <div key={itemIdx} className="p-4 border border-zinc-200 rounded-lg bg-white relative">
                    <button 
                      type="button" 
                      onClick={() => {
                        const newArr = [...(data[field.name] || [])];
                        newArr.splice(itemIdx, 1);
                        updateBlockData(index, field.name, newArr);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 mt-4">
                      {field.itemFields.map((subField, subIdx) => (
                        <div key={subIdx} className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-zinc-600 capitalize">
                            {subField.name.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          {subField.type === 'textarea' ? (
                            <textarea
                              rows="2"
                              value={item[subField.name] || ''}
                              onChange={(e) => handleArrayItemChange(field.name, itemIdx, subField.name, e.target.value)}
                              placeholder={subField.placeholder || ''}
                              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm bg-zinc-50"
                            />
                          ) : subField.type === 'image' ? (
                            <div className="flex-1">
                              {item[subField.name] && <img src={getAssetUrl(item[subField.name])} alt="preview" className="h-24 object-cover rounded mb-2 border border-zinc-200" />}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append('image', file);
                                  try {
                                    const res = await apiClient.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                    if (res.data.success && res.data.data.url) {
                                      handleArrayItemChange(field.name, itemIdx, subField.name, res.data.data.url);
                                    }
                                  } catch (err) {}
                                  e.target.value = '';
                                }}
                                className="text-xs text-zinc-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-orange-50 file:text-orange-700"
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={item[subField.name] || ''}
                              onChange={(e) => handleArrayItemChange(field.name, itemIdx, subField.name, e.target.value)}
                              placeholder={subField.placeholder || ''}
                              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm bg-zinc-50"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newArr = [...(data[field.name] || []), field.defaultItem || {}];
                    updateBlockData(index, field.name, newArr);
                  }}
                  className="w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            ) : field.type === 'arrayString' ? (
              <div className="space-y-4 border border-zinc-200 rounded-xl p-4 bg-zinc-50/50">
                {((data[field.name] === undefined ? field.defaultArray : data[field.name]) || []).map((itemStr, itemIdx) => (
                  <div key={itemIdx} className="p-3 border border-zinc-200 rounded-lg bg-white relative flex gap-4 items-start">
                    {field.isImage ? (
                      <div className="flex-1">
                        {itemStr && <img src={getAssetUrl(itemStr)} alt="preview" className="h-24 object-cover rounded mb-2 border border-zinc-200" />}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            try {
                              const res = await apiClient.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                              if (res.data.success && res.data.data.url) {
                                handleArrayStringChange(field.name, itemIdx, res.data.data.url);
                              }
                            } catch (err) {}
                            e.target.value = '';
                          }}
                          className="text-xs text-zinc-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-orange-50 file:text-orange-700"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={itemStr || ''}
                        onChange={(e) => handleArrayStringChange(field.name, itemIdx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm bg-zinc-50"
                      />
                    )}
                    <button 
                      type="button" 
                      onClick={() => {
                        const newArr = [...(data[field.name] || [])];
                        newArr.splice(itemIdx, 1);
                        updateBlockData(index, field.name, newArr);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newArr = [...(data[field.name] || []), ''];
                    updateBlockData(index, field.name, newArr);
                  }}
                  className="w-full py-2.5 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            ) : (
              <input
                type="text"
                name={field.name}
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'heroSection':
      return renderGenericFields([
        { name: 'titleLine1', type: 'text', defaultValue: 'End-To-End', placeholder: 'End-To-End' },
        { name: 'titleLine2', type: 'text', defaultValue: 'Office Interiors', placeholder: 'Office Interiors' },
        { name: 'subtitle', type: 'text', defaultValue: 'For Every Test & Budget', placeholder: 'For Every Test & Budget' },
        { name: 'description', type: 'textarea', defaultValue: "Simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry's standard,", placeholder: "Simply dummy text..." },
        { name: 'buttonText', type: 'text', defaultValue: 'Book A Free Consultation', placeholder: 'Book A Free Consultation' },
        { name: 'backgroundImage', type: 'image' },
      ]);
    case 'whySubhaakritee':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'WHY subhAAkritee?', placeholder: 'WHY subhAAkritee?' },
        { name: 'description', type: 'textarea', defaultValue: 'For Over 26 Years, SubhAAkritee - The Design People Has Delivered Innovative, High-Quality Interior And Architectural Solutions Across Residential And Commercial Spaces. With A Strong Presence In Kolkata, Delhi, Siliguri, And Bhubaneswar, We Transform Spaces Into Functional Works Of Art', placeholder: 'For Over 26 Years...' },
        { name: 'buttonText', type: 'text', defaultValue: 'Get Free Estimated', placeholder: 'Get Free Estimated' },
        { 
          name: 'features', type: 'array', defaultItem: { icon: 'Award', textLine1: '', textLine2: '' },
          defaultArray: [
            { icon: 'Award', textLine1: '1,400+ design', textLine2: 'experts' },
            { icon: 'Home', textLine1: '20,000+ happy', textLine2: 'customers' },
            { icon: 'ShieldCheck', textLine1: 'Up to 10-years', textLine2: 'material warranty' },
            { icon: 'CalendarDays', textLine1: '45 days or we', textLine2: 'pay you rent', extraBadge: '45' }
          ],
          itemFields: [
            { name: 'icon', type: 'text', placeholder: 'Icon name (e.g., Award, Home)' },
            { name: 'textLine1', type: 'text', placeholder: 'Line 1' },
            { name: 'textLine2', type: 'text', placeholder: 'Line 2' },
            { name: 'extraBadge', type: 'text', placeholder: 'Extra Badge (optional)' }
          ]
        }
      ]);
    case 'modernWorkspace':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Modern Workspace Solutions', placeholder: 'Modern Workspace Solutions' },
        { name: 'subtitle', type: 'text', defaultValue: '', placeholder: 'Subtitle' },
        { 
          name: 'services', type: 'array', defaultItem: { icon: 'Hammer', title: '', desc: '' },
          defaultArray: [
            { icon: 'Home', title: 'Renovation & Upgrade', desc: 'Transforming existing offices into contemporary, high-performing spaces.' },
            { icon: 'Lightbulb', title: 'Lighting & Electrical', desc: 'Efficient lighting systems and seamless electrical planning for optimal performance.' },
            { icon: 'Archive', title: 'Custom Furniture', desc: 'Ergonomic, bespoke workstations, cabins, and storage solutions.' },
            { icon: 'Settings', title: 'Turnkey Execution', desc: 'Complete project management from concept and design to final handover.' },
            { icon: 'Monitor', title: 'Office Interiors', desc: 'Modern, brand-aligned workspace designs that balance aesthetics and functionality.' },
            { icon: 'Layout', title: 'Space Planning', desc: 'Smart layouts designed to maximize efficiency, workflow, and space utilization.' }
          ],
          itemFields: [
            { name: 'icon', type: 'text', placeholder: 'Icon name (e.g., Hammer)' },
            { name: 'title', type: 'text', placeholder: 'Service title' },
            { name: 'desc', type: 'textarea', placeholder: 'Service description' }
          ]
        }
      ]);
    case 'wayWeCreate':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'The Way We Create', placeholder: 'The Way We Create' },
        { name: 'subtitle', type: 'text', defaultValue: 'Structured Planning. Precise Execution. Exceptional Results.', placeholder: 'Subtitle...' },
        { name: 'buttonText', type: 'text', defaultValue: 'Get Free Estimated', placeholder: 'Get Free Estimated' },
        { 
          name: 'steps', type: 'array', defaultItem: { icon: 'PenTool', title: '', desc: '' },
          defaultArray: [
            { icon: 'PenTool', title: 'Discover & Design', desc: "Understanding your vision, space, and goals." },
            { icon: 'ClipboardList', title: 'Build & Manage', desc: "Seamless execution with expert supervision and quality control." },
            { icon: 'UserCheck', title: 'Deliver & Support', desc: "On-time handover with precision finishing and continued assistance." }
          ],
          itemFields: [
            { name: 'icon', type: 'text', placeholder: 'Icon name (e.g., PenTool, ClipboardList)' },
            { name: 'title', type: 'text', placeholder: 'Step title' },
            { name: 'desc', type: 'textarea', placeholder: 'Step description' }
          ]
        }
      ]);
    case 'trustedClients':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Trusted By Our Clients', placeholder: 'Trusted By Our Clients' },
        { name: 'subtitle', type: 'text', defaultValue: "Hear How We've Transformed Spaces And Exceeded Expectations.", placeholder: 'Subtitle...' },
        { 
          name: 'reviews', type: 'array', defaultItem: { text: '', author: '', role: '', rating: '5' },
          defaultArray: [
            { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Stephanie", role: "", rating: 5 },
            { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Stephanie", role: "", rating: 5 },
            { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Stephanie", role: "", rating: 5 },
            { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", author: "Stephanie", role: "", rating: 5 }
          ],
          itemFields: [
            { name: 'text', type: 'textarea', placeholder: 'Review content' },
            { name: 'author', type: 'text', placeholder: 'Author Name' },
            { name: 'role', type: 'text', placeholder: 'Role or Title' },
            { name: 'rating', type: 'text', placeholder: 'Rating (1-5)' }
          ]
        }
      ]);
    case 'spacesStories':
      return renderGenericFields([
        { name: 'titleLine1', type: 'text', defaultValue: 'Spaces. Stories.', placeholder: 'Spaces. Stories.' },
        { name: 'titleLine2', type: 'text', defaultValue: 'Experiences.', placeholder: 'Experiences.' },
        { name: 'description', type: 'textarea', defaultValue: '26 Years Of Crafting Environments Defined By Excellence.', placeholder: '26 Years Of...' },
        { 
          name: 'images', type: 'array', defaultItem: { url: '', label: '' },
          defaultArray: [
            { url: '/assets/homepage/gallery1.png', label: 'Workspace' },
            { url: '/assets/homepage/gallery2.png', label: 'Commercial' },
            { url: '/assets/homepage/gallery3.png', label: 'Residential' }
          ],
          itemFields: [
            { name: 'url', type: 'image' },
            { name: 'label', type: 'text', placeholder: 'e.g. Workspace' }
          ]
        }
      ]);
    case 'getInTouch':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Get In Touch', placeholder: 'Get In Touch' },
        { name: 'subtitle', type: 'text', defaultValue: 'Our friendly team would love to hear from you.', placeholder: 'Our friendly team would love to hear from you.' },
        { name: 'buttonText', type: 'text', defaultValue: 'Send Message', placeholder: 'Send Message' },
        { name: 'image', type: 'image' },
      ]);
    case 'metricsBarOne':
      return renderGenericFields([
        { 
          name: 'metrics', type: 'array', defaultItem: { value: 'ON-TIME', label: 'DELIVERY' },
          defaultArray: [
            { value: 'ON-TIME', label: 'DELIVERY' },
            { value: 'BEST', label: 'PRICE' },
            { value: 'SUPERIOR', label: 'QUALITY' },
            { value: 'SAFETY', label: 'ASSURED' }
          ],
          itemFields: [
            { name: 'value', type: 'text', placeholder: 'e.g. ON-TIME' },
            { name: 'label', type: 'text', placeholder: 'e.g. DELIVERY' }
          ]
        }
      ]);
    case 'metricsBarTwo':
      return renderGenericFields([
        { 
          name: 'metrics', type: 'array', defaultItem: { value: '0', label: 'METRIC' },
          defaultArray: [
            { value: '3,000+', label: 'INTERIOR DESIGNS' },
            { value: '1,500+', label: 'RENOVATIONS' },
            { value: '500+', label: 'COMMERCIAL PROJECTS' },
            { value: '25+', label: 'AWARDS WON' }
          ],
          itemFields: [
            { name: 'value', type: 'text', placeholder: 'e.g. 100+' },
            { name: 'label', type: 'text', placeholder: 'e.g. SATISFIED CUSTOMERS' }
          ]
        }
      ]);
    case 'gallerySection':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Gallery', placeholder: 'Gallery' },
        { name: 'subtitle', type: 'text', defaultValue: 'Showcasing Interiors That Inspire, Perform, And Endure', placeholder: 'Subtitle...' },
        { name: 'images', type: 'arrayString', isImage: true, defaultArray: ['/assets/homepage/gallery1.png', '/assets/homepage/gallery2.png', '/assets/homepage/gallery3.png', '/assets/homepage/gallery4.png', '/assets/homepage/gallery5.png', '/assets/homepage/gallery6.png'] }
      ]);
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
              <label className="block text-sm font-medium text-zinc-700 mb-2">Redirect Path *</label>
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