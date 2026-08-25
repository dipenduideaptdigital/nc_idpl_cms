import React from 'react';
import { Settings, Plus, Trash2, GripVertical, Link as LinkIcon, Share2, MapPin, Phone, Mail } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableLinkItem = ({ item, index, arrayName, onLinkChange, onDeleteLink }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition,
    zIndex: transform ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group flex gap-2 items-center p-2 pr-3 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 mb-2.5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <button 
        type="button"
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative w-full min-w-0">
          <input
            type="text"
            placeholder="Display Label (e.g. FACEBOOK or Home)"
            value={item.label || ''}
            onChange={(e) => onLinkChange(arrayName, index, 'label', e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-all"
          />
        </div>
        <div className="relative w-full min-w-0">
          <input
            type="text"
            placeholder="URL (e.g. https://... or /contact)"
            value={item.url || ''}
            onChange={(e) => onLinkChange(arrayName, index, 'url', e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-all"
          />
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={() => onDeleteLink(arrayName, index)} 
        className="p-2.5 text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        title="Delete Item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const FooterCustomization = ({ footerData, onChange, onLinkChange, onAddLink, onDeleteLink, onDragEnd }) => {
  
  // Setup Drag Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Common Input Classes
  const inputClassName = "w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600";
  const labelClassName = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2";

  return (
    <div className="space-y-8 font-sans text-left transition-colors duration-300 max-w-7xl mx-auto">
      
      {/* Identity & Legal Section */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden transition-colors rounded-2xl shadow-sm">
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Identity &amp; Legal</h2>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <label className={labelClassName}>About / Description</label>
            <textarea
              name="description"
              value={footerData.description || ''}
              onChange={onChange}
              rows={3}
              className={`${inputClassName} resize-none rounded-xl`}
              placeholder="Enter general about text shown in the footer..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <label className={labelClassName}>Copyright Text</label>
              <input
                type="text"
                name="copyrightText"
                value={footerData.copyrightText || ''}
                onChange={onChange}
                placeholder="e.g. © 2024 Your Company. All rights reserved."
                className={`${inputClassName} rounded-xl`}
              />
            </div>
            <div>
              <label className={labelClassName}>Privacy Policy URL</label>
              <input 
                type="text" 
                name="privacyUrl" 
                value={footerData.privacyUrl || ''} 
                onChange={onChange} 
                placeholder="https://..."
                className={`${inputClassName} rounded-xl`} 
              />
            </div>
            <div>
              <label className={labelClassName}>Terms &amp; Conditions URL</label>
              <input 
                type="text" 
                name="termsUrl" 
                value={footerData.termsUrl || ''} 
                onChange={onChange}
                placeholder="https://..." 
                className={`${inputClassName} rounded-xl`} 
              />
            </div>
            <div>
              <label className={labelClassName}>Sitemap URL</label>
              <input 
                type="text" 
                name="sitemapUrl" 
                value={footerData.sitemapUrl || ''} 
                onChange={onChange} 
                placeholder="https://..."
                className={`${inputClassName} rounded-xl`} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address & Contacts Section (Merged from V2) */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden transition-colors rounded-2xl shadow-sm">
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <MapPin className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Address &amp; Contacts</h2>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="md:col-span-2">
              <label className={labelClassName}>Address Info</label>
              <textarea
                name="address"
                value={footerData.address || ''}
                onChange={onChange}
                rows={2}
                className={`${inputClassName} resize-none rounded-xl`}
                placeholder="Enter physical address..."
              />
            </div>

            <div>
              <label className={`${labelClassName} flex items-center gap-1.5`}><Phone className="w-4 h-4 text-zinc-400" /> Main Phone</label>
              <input
                type="text"
                name="phone"
                value={footerData.phone || ''}
                onChange={onChange}
                placeholder="+91..."
                className={`${inputClassName} rounded-xl`}
              />
            </div>

            <div>
              <label className={`${labelClassName} flex items-center gap-1.5`}><Phone className="w-4 h-4 text-zinc-400" /> Secondary Phone</label>
              <input
                type="text"
                name="phone2"
                value={footerData.phone2 || ''}
                onChange={onChange}
                placeholder="+91..."
                className={`${inputClassName} rounded-xl`}
              />
            </div>

            <div>
              <label className={`${labelClassName} flex items-center gap-1.5`}><Mail className="w-4 h-4 text-zinc-400" /> Primary Email</label>
              <input
                type="email"
                name="email"
                value={footerData.email || ''}
                onChange={onChange}
                placeholder="hello@example.com"
                className={`${inputClassName} rounded-xl`}
              />
            </div>

            <div>
              <label className={`${labelClassName} flex items-center gap-1.5`}><Mail className="w-4 h-4 text-zinc-400" /> Secondary Email</label>
              <input
                type="email"
                name="email2"
                value={footerData.email2 || ''}
                onChange={onChange}
                placeholder="info@example.com"
                className={`${inputClassName} rounded-xl`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SOCIAL LINKS (Dnd-Kit Enabled) */}
      <div className="bg-zinc-50/50 dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden transition-colors rounded-2xl shadow-sm">
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm rounded-lg">
              <Share2 className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Social Media Links</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Drag to reorder your social icons</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => onAddLink('socialLinks')} 
            className="inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Social
          </button>
        </div>
        
        <div className="p-6 sm:p-8">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd('socialLinks', e)}>
            <SortableContext items={(footerData.socialLinks || []).map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {(footerData.socialLinks || []).map((link, idx) => (
                  <div key={link.id} className="rounded-xl overflow-hidden">
                    <SortableLinkItem 
                      item={link} 
                      index={idx} 
                      arrayName="socialLinks" 
                      onLinkChange={onLinkChange} 
                      onDeleteLink={onDeleteLink} 
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {(footerData.socialLinks || []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 bg-white dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 rounded-full">
                <Share2 className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">No social links added yet</p>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">Click the button above to add your first link.</p>
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC COLUMNS (Dnd-Kit Enabled) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Column 1 */}
        <div className="bg-zinc-50/50 dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden transition-colors flex flex-col rounded-2xl shadow-sm">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center bg-white dark:bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm rounded-lg">
                <LinkIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Links Column 1</h2>
            </div>
            <button 
              type="button" 
              onClick={() => onAddLink('links1')} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          
          <div className="p-4 sm:p-5 flex-1">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Column Header</label>
              <input 
                type="text" 
                name="linksTitle1" 
                value={footerData.linksTitle1 || ''} 
                onChange={onChange} 
                className={`${inputClassName} rounded-xl`} 
                placeholder="e.g. Resources" 
              />
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd('links1', e)}>
              <SortableContext items={(footerData.links1 || []).map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {(footerData.links1 || []).map((link, idx) => (
                    <div key={link.id} className="rounded-xl overflow-hidden">
                      <SortableLinkItem 
                        item={link} 
                        index={idx} 
                        arrayName="links1" 
                        onLinkChange={onLinkChange} 
                        onDeleteLink={onDeleteLink} 
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            
            {(footerData.links1 || []).length === 0 && (
              <div className="text-center py-5 bg-white dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-700 mt-2 rounded-xl">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">No links added.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="bg-zinc-50/50 dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden transition-colors flex flex-col rounded-2xl shadow-sm">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center bg-white dark:bg-transparent">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm rounded-lg">
                <LinkIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Links Column 2</h2>
            </div>
            <button 
              type="button" 
              onClick={() => onAddLink('links2')} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          
          <div className="p-4 sm:p-5 flex-1">
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Column Header</label>
              <input 
                type="text" 
                name="linksTitle2" 
                value={footerData.linksTitle2 || ''} 
                onChange={onChange} 
                className={`${inputClassName} rounded-xl`} 
                placeholder="e.g. Resources" 
              />
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => onDragEnd('links2', e)}>
              <SortableContext items={(footerData.links2 || []).map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {(footerData.links2 || []).map((link, idx) => (
                    <div key={link.id} className="rounded-xl overflow-hidden">
                      <SortableLinkItem 
                        item={link} 
                        index={idx} 
                        arrayName="links2" 
                        onLinkChange={onLinkChange} 
                        onDeleteLink={onDeleteLink} 
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            
            {(footerData.links2 || []).length === 0 && (
              <div className="text-center py-5 bg-white dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-700 mt-2 rounded-xl">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">No links added.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCustomization;