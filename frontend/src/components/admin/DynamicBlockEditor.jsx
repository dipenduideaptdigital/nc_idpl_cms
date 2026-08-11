import React, { useState } from 'react';
import { Type, Trash, Plus, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import ImageField from './ImageField';

const CollapsibleTiptap = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text || 'No content added...';
  };

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50/50 hover:bg-zinc-100 transition-colors outline-none"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Edit2 className="w-4 h-4 text-zinc-500 shrink-0" />
          <span className="text-sm font-medium text-zinc-700 truncate">
            {isOpen ? 'Close Text Editor' : getPreviewText(value)}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-zinc-200 bg-white">
          <TipTapEditor value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
  
const DynamicBlockEditor = ({ block, index, updateBlockData }) => {
  const { type, data } = block;

  // Generic change handler for simple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBlockData(index, name, value);
  };

  // Tiptap Handler
  const handleTiptapChange = (name, value) => {
    updateBlockData(index, name, value);
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
            
            {field.type === 'tiptap' ? (
              <CollapsibleTiptap
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={(htmlValue) => handleTiptapChange(field.name, htmlValue)}
              />
            ) : field.type === 'textarea' ? (
              <textarea
                rows="4"
                name={field.name}
                value={data[field.name] !== undefined ? data[field.name] : (field.defaultValue || '')}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors text-sm bg-zinc-50/50"
              />
            ) : field.type === 'image' ? (
              <ImageField 
                value={data[field.name] || ''} 
                onChange={(url) => updateBlockData(index, field.name, url)} 
              />
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
                      className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors z-10"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <div className="space-y-3 mt-4">
                      {field.itemFields.map((subField, subIdx) => (
                        <div key={subIdx} className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-zinc-600 capitalize">
                            {subField.name.replace(/([A-Z])/g, ' $1').trim()}
                          </label>

                          {subField.type === 'tiptap' ? (
                            <CollapsibleTiptap
                              value={item[subField.name] || ''}
                              onChange={(htmlValue) => handleArrayItemChange(field.name, itemIdx, subField.name, htmlValue)}
                            />
                          ) : subField.type === 'textarea' ? (
                            <textarea
                              rows="2"
                              value={item[subField.name] || ''}
                              onChange={(e) => handleArrayItemChange(field.name, itemIdx, subField.name, e.target.value)}
                              placeholder={subField.placeholder || ''}
                              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm bg-zinc-50"
                            />
                          ) : subField.type === 'image' ? (
                            <div className="flex-1">
                              <ImageField 
                                value={item[subField.name] || ''} 
                                onChange={(url) => handleArrayItemChange(field.name, itemIdx, subField.name, url)} 
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
                        <ImageField 
                          value={itemStr || ''} 
                          onChange={(url) => handleArrayStringChange(field.name, itemIdx, url)} 
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
    case 'richText':
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-8 py-4 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
            <Type className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-semibold text-zinc-800">Rich Text Editor</h2>
          </div>
          <div className="p-8">
            <CollapsibleTiptap 
              value={data.content || ''} 
              onChange={(htmlValue) => updateBlockData(index, 'content', htmlValue)} 
            />
          </div>
        </div>
      );

    case 'heading':
      return renderGenericFields([
        { name: 'content', type: 'tiptap', placeholder: 'Enter your section heading here...' }
      ]);
      
    case 'paragraph':
      return renderGenericFields([
        { name: 'content', type: 'tiptap', placeholder: 'Write your paragraph content...' }
      ]);

    case 'quote':
      return renderGenericFields([
        { name: 'content', type: 'tiptap', placeholder: 'Enter the quote text...' }
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
        
    case 'serviceBanner':
      return renderGenericFields([
        { name: 'title', type: 'text', defaultValue: 'Residential Interior', placeholder: 'Title...' },
        { name: 'subTitle', type: 'text', defaultValue: 'Services', placeholder: 'Subtitle...' },
        { name: 'backgroundImage', type: 'image' }
      ]);

    case 'serviceDetails':
      return renderGenericFields([
        { name: 'aboutTitle', type: 'text', defaultValue: 'About The Service' },
        { name: 'aboutDescription', type: 'tiptap', defaultValue: 'Commercial interior design is constantly evolving...' },
        { name: 'typesTitle', type: 'text', defaultValue: 'Types Of Commercial Spaces' },
        { name: 'typesDescription', type: 'tiptap', defaultValue: 'In design, we bring characteristics...' },
        { name: 'elementsTitle', type: 'text', defaultValue: 'Key Elements Of Interior Design' },
        { name: 'elementsDescription', type: 'tiptap', defaultValue: 'Several key elements are essential...' },
        { name: 'footerDescription', type: 'tiptap', defaultValue: 'Commercial interior design is a dynamic...' },
        { name: 'sidebarImage', type: 'image' },
        { name: 'mainImage', type: 'image' },
        { name: 'midImage1', type: 'image' },
        { name: 'midImage2', type: 'image' },
        { 
          name: 'features', type: 'array', defaultItem: { title: '', description: '' },
          defaultArray: [{ title: "Space Optimization", description: "Through The Best Smart Space Optimisation." }],
          itemFields: [
            { name: 'title', type: 'text', placeholder: 'Feature Title' },
            { name: 'description', type: 'tiptap', placeholder: 'Feature Description' }
          ]
        },
        { 
          name: 'leftBullets', type: 'array', defaultItem: { text: '' },
          defaultArray: [{ text: "We provide high quality design services." }],
          itemFields: [{ name: 'text', type: 'text', placeholder: 'Bullet Text' }]
        },
        { 
          name: 'rightBullets', type: 'array', defaultItem: { text: '' },
          defaultArray: [{ text: "Flexible with any structure of the building" }],
          itemFields: [{ name: 'text', type: 'text', placeholder: 'Bullet Text' }]
        },
        { 
          name: 'faqs', type: 'array', defaultItem: { question: '' },
          defaultArray: [{ question: "What Interior Design Services Do You Offer?" }],
          itemFields: [{ name: 'question', type: 'text', placeholder: 'FAQ Question' }]
        }
      ]);

    case 'getStartedCta':
      return renderGenericFields([
        { name: 'titlePart1', type: 'text', defaultValue: 'LIVING', placeholder: 'First part of title' },
        { name: 'titlePart2', type: 'text', defaultValue: 'art', placeholder: 'Italicized part of title' },
        { name: 'headline', type: 'tiptap', defaultValue: 'It is a long established fact that a reader will be distracted.', placeholder: 'Main headline' },
        { name: 'subtext', type: 'textarea', defaultValue: 'It is a long established fact that a reader will be distracted.', placeholder: 'Subtext description' },
        { name: 'buttonText', type: 'text', defaultValue: "LET'S GET STARTED", placeholder: 'Button Label' },
        { name: 'buttonLink', type: 'text', defaultValue: '#contact', placeholder: 'Button Link URL' }
      ]);

    case 'projectsBanner':
      return renderGenericFields([
        { name: 'title', type: 'textarea', defaultValue: 'It is a long established fact that a reader\nwill be distracted.' }, // 🛡️ Changed to textarea
        { name: 'backgroundImage', type: 'image' }
      ]);

    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
          No visual editor configured for block type: <strong>{type}</strong>. 
          <br/>This block may be intended to be edited directly via the Puck Visual Editor instead.
        </div>
      );
  }
};

export default DynamicBlockEditor;