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
    case 'heroSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Find Your [Inspired]\n[Interior] Design', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'FAST AND RELIABLE', placeholder: 'FAST AND RELIABLE' },
        { name: 'description', type: 'textarea', defaultValue: 'Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.', placeholder: 'Description...' },
        { name: 'watermarkText', type: 'text', defaultValue: 'Interior', placeholder: 'Interior' },
        { name: 'backgroundImage', type: 'image' },
      ]);
    case 'aboutSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Architecture\n[And Interiors, Our Dual]\nExpertise', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'STARTED IN 1989', placeholder: 'STARTED IN 1989' },
        { name: 'paragraph1', type: 'textarea', defaultValue: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.', placeholder: 'Paragraph 1...' },
        { name: 'paragraph2', type: 'textarea', defaultValue: 'With a strong presence in Kolkata, Bhubaneswar, and Ranchi, our turnkey office interiors are thoughtfully crafted to enhance productivity, reflect your brand identity, and support the way your team works every day.', placeholder: 'Paragraph 2...' },
        { name: 'buttonText', type: 'text', defaultValue: "Let's Get Started", placeholder: "Let's Get Started" },
        { name: 'image1', type: 'image' },
        { name: 'image2', type: 'image' },
        { name: 'image3', type: 'image' }
      ]);
    case 'servicesSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Explore Our [Comprehensive]\n[Interior Design] Services', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'OUR SERVICES', placeholder: 'OUR SERVICES' },
        { 
          name: 'services', type: 'array', defaultItem: { title: '', description: '', image: '' },
          defaultArray: [
            { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
            { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
            { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Title' },
            { name: 'description', type: 'textarea', placeholder: 'Description' },
            { name: 'image', type: 'image' }
          ]
        }
      ]);
    case 'processSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Description [Architecture]\n[Process] For Exceptional Results.', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH', placeholder: 'GET IN TOUCH' },
        { name: 'description', type: 'textarea', defaultValue: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.', placeholder: 'Description...' },
        { name: 'image', type: 'image' },
        { 
          name: 'steps', type: 'array', defaultItem: { title: '', description: '' },
          defaultArray: [
            { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
            { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
            { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
            { title: 'Project Handover', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Step Title' },
            { name: 'description', type: 'textarea', placeholder: 'Step Description' }
          ]
        }
      ]);
    case 'projectSliderTwo':
      return renderGenericFields([
        { 
          name: 'projects', type: 'array', defaultItem: { title: '', year: '2024', location: '', image: '' },
          defaultArray: [
            { title: 'Industrial Elegance Condo', year: '2024', location: 'Kolkata', image: '' },
            { title: 'Residential Interior Design', year: '2024', location: 'Bhubaneswar', image: '' },
            { title: 'Serene Space Studio', year: '2024', location: 'Ranchi', image: '' },
            { title: 'Art Decor Revival', year: '2024', location: 'Kolkata', image: '' },
            { title: 'Modern Minimalist Oasis', year: '2024', location: 'Siliguri', image: '' },
            { title: 'Corporate Executive Suite', year: '2024', location: 'Delhi', image: '' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Project Title' },
            { name: 'year', type: 'text', placeholder: 'Year' },
            { name: 'location', type: 'text', placeholder: 'Location' },
            { name: 'image', type: 'image' }
          ]
        }
      ]);
    case 'trustedPartners':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'OUR [TRUSTED PARTNERS]', placeholder: 'OUR [TRUSTED PARTNERS]' },
        {
          name: 'partners', type: 'array', defaultItem: { name: '', logo: '', heightClass: 'h-11 md:h-[44px]' },
          defaultArray: [
            { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
            { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
          ],
          itemFields: [
            { name: 'name', type: 'text', placeholder: 'Brand name' },
            { name: 'logo', type: 'image' },
            { name: 'heightClass', type: 'text', placeholder: 'e.g. h-11 md:h-[44px]' }
          ]
        }
      ]);
    case 'statsSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Behind [Every Statistic]\n[Pulses] A Human Story', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'TRUSTED EXPERIENCE', placeholder: 'TRUSTED EXPERIENCE' },
        { name: 'buttonText', type: 'text', defaultValue: 'BOOK A FREE CONSULTATION', placeholder: 'BOOK A FREE CONSULTATION' },
        { name: 'backgroundImage', type: 'image' },
        { 
          name: 'stats', type: 'array', defaultItem: { value: '0', title: '', description: '' },
          defaultArray: [
            { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
            { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
            { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
            { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' }
          ],
          itemFields: [
            { name: 'value', type: 'text', placeholder: 'e.g. 26+' },
            { name: 'title', type: 'text', placeholder: 'Title' },
            { name: 'description', type: 'textarea', placeholder: 'Description' }
          ]
        }
      ]);
    case 'happySpaces':
      return renderGenericFields([
        { name: 'badgeText', type: 'text', defaultValue: 'STRAIGHT FROM THE NEWSROOM', placeholder: 'STRAIGHT FROM THE NEWSROOM' },
        { name: 'titleLine1', type: 'text', defaultValue: 'Happy Spaces by', placeholder: 'Happy Spaces by' },
        { name: 'titleLine2', type: 'text', defaultValue: 'subhAAkritee', placeholder: 'subhAAkritee' },
        { 
          name: 'items', type: 'array', defaultItem: { title: '', description: '', image: '', videoUrl: '' },
          defaultArray: [
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
            { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' }
          ],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Title' },
            { name: 'description', type: 'textarea', placeholder: 'Description' },
            { name: 'image', type: 'image' },
            { name: 'videoUrl', type: 'text', placeholder: 'YouTube Embed URL' }
          ]
        }
      ]);
    case 'happyCustomers':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'OUR [HAPPY CUSTOMERS]', placeholder: 'OUR [HAPPY CUSTOMERS]' },
        {
          name: 'partners', type: 'array', defaultItem: { name: '', logo: '', heightClass: 'h-11 md:h-[44px]' },
          defaultArray: [
            { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
            { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
            { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
            { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
          ],
          itemFields: [
            { name: 'name', type: 'text', placeholder: 'Brand name' },
            { name: 'logo', type: 'image' },
            { name: 'heightClass', type: 'text', placeholder: 'e.g. h-11 md:h-[44px]' }
          ]
        }
      ]);
    case 'testimonialsTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Here’s What [Warm Words]\n[Our Clients] Say', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'OUR CLIENTS SAY', placeholder: 'OUR CLIENTS SAY' },
        { name: 'description', type: 'textarea', defaultValue: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors', placeholder: 'Description...' },
        { name: 'mainQuote', type: 'textarea', defaultValue: 'I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!', placeholder: 'Main Quote...' },
        { name: 'authorName', type: 'text', defaultValue: 'Morgan Dufresne', placeholder: 'Author Name' },
        { name: 'authorRole', type: 'text', defaultValue: 'Company owner', placeholder: 'Author Role' },
        { name: 'image', type: 'image' },
        { name: 'authorImage', type: 'image' },
      ]);
    case 'ctaSectionTwo':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'Have A Project In [Mind?] Let’s\n[Make] It Happen', placeholder: 'Title...' },
        { name: 'badgeText', type: 'text', defaultValue: 'GET IN TOUCH', placeholder: 'GET IN TOUCH' },
        { name: 'buttonText', type: 'text', defaultValue: 'BOOK A FREE CONSULTATION', placeholder: 'BOOK A FREE CONSULTATION' }
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
      case 'heading':
      return renderGenericFields([
        { name: 'content', type: 'text', placeholder: 'Enter your section heading here...' }
      ]);
      
    case 'paragraph':
      return renderGenericFields([
        { name: 'content', type: 'textarea', placeholder: 'Write your paragraph content...' }
      ]);

    case 'quote':
      return renderGenericFields([
        { name: 'content', type: 'textarea', placeholder: 'Enter the quote text...' }
      ]);

    case 'image':
      return renderGenericFields([
        { name: 'url', type: 'image' },
        { name: 'caption', type: 'text', placeholder: 'Image caption (optional)' }
      ]);

    case 'video':
      return renderGenericFields([
        { name: 'platform', type: 'text', defaultValue: 'youtube', placeholder: 'youtube or vimeo' },
        { name: 'videoId', type: 'text', placeholder: 'e.g. ScMzIvxBSi4' }
      ]);

    case 'gallery':
      return renderGenericFields([
        { 
          name: 'images', 
          type: 'arrayString', 
          isImage: true, 
          defaultArray: [] 
        }
      ]);

    case 'divider':
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden p-6 text-center">
          <div className="w-full h-px bg-zinc-200 my-4"></div>
          <p className="text-sm text-zinc-500 font-medium">Line Divider (No settings required)</p>
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