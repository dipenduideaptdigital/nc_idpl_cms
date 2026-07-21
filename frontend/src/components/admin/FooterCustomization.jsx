import React from 'react';
import { Settings, Plus, Trash2, Mail, Phone, MapPin, Globe } from 'lucide-react';

const FooterCustomization = ({
  footerData,
  onChange,
  onLinkChange,
  onAddLink,
  onDeleteLink
}) => {
  return (
    <div className="space-y-8 font-sans text-left">
      {/* General Settings Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <Settings className="w-6 h-6 text-zinc-700" />
          <h2 className="text-xl font-semibold text-zinc-800">Footer Identity & Socials</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-2">About / Description</label>
              <textarea
                name="description"
                value={footerData.description || ''}
                onChange={onChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
                placeholder="Enter general about text shown in the footer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Copyright Text</label>
              <input
                type="text"
                name="copyrightText"
                value={footerData.copyrightText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Instagram Link</label>
              <input
                type="text"
                name="instagram"
                value={footerData.instagram || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Twitter Link</label>
              <input
                type="text"
                name="twitter"
                value={footerData.twitter || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Facebook Link</label>
              <input
                type="text"
                name="facebook"
                value={footerData.facebook || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">LinkedIn Link</label>
              <input
                type="text"
                name="linkedin"
                value={footerData.linkedin || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address & Contacts */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
          <MapPin className="w-6 h-6 text-zinc-700" />
          <h2 className="text-xl font-semibold text-zinc-800">Address &amp; Contacts</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Address Info</label>
              <textarea
                name="address"
                value={footerData.address || ''}
                onChange={onChange}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-1.5"><Phone className="w-4 h-4 text-zinc-400" /> Main Phone</label>
              <input
                type="text"
                name="phone"
                value={footerData.phone || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-1.5"><Phone className="w-4 h-4 text-zinc-400" /> Mobile / Secondary Phone</label>
              <input
                type="text"
                name="phone2"
                value={footerData.phone2 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-1.5"><Mail className="w-4 h-4 text-zinc-400" /> Primary Email</label>
              <input
                type="email"
                name="email"
                value={footerData.email || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-1.5"><Mail className="w-4 h-4 text-zinc-400" /> Secondary Email</label>
              <input
                type="email"
                name="email2"
                value={footerData.email2 || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Link Columns Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1 Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-zinc-700" />
              <h2 className="text-lg font-semibold text-zinc-800">Links Column 1</h2>
            </div>
            <button
              type="button"
              onClick={() => onAddLink('links1')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Column Title</label>
              <input
                type="text"
                name="linksTitle1"
                value={footerData.linksTitle1 || ''}
                onChange={onChange}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {(footerData.links1 || []).map((link, idx) => (
                <div key={idx} className="flex gap-3 items-center p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label || ''}
                      onChange={(e) => onLinkChange('links1', idx, 'label', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-xs font-medium"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url || ''}
                      onChange={(e) => onLinkChange('links1', idx, 'url', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLink('links1', idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(footerData.links1 || []).length === 0 && (
                <p className="text-zinc-400 text-xs italic text-center py-4">No links added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2 Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-zinc-700" />
              <h2 className="text-lg font-semibold text-zinc-800">Links Column 2</h2>
            </div>
            <button
              type="button"
              onClick={() => onAddLink('links2')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Column Title</label>
              <input
                type="text"
                name="linksTitle2"
                value={footerData.linksTitle2 || ''}
                onChange={onChange}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {(footerData.links2 || []).map((link, idx) => (
                <div key={idx} className="flex gap-3 items-center p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label || ''}
                      onChange={(e) => onLinkChange('links2', idx, 'label', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-xs font-medium"
                    />
                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url || ''}
                      onChange={(e) => onLinkChange('links2', idx, 'url', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLink('links2', idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(footerData.links2 || []).length === 0 && (
                <p className="text-zinc-400 text-xs italic text-center py-4">No links added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCustomization;