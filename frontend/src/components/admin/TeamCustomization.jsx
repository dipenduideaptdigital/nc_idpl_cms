import React, { useState } from 'react';
import { User, Image as ImageIcon } from 'lucide-react';
import { resolveAssetUrl } from '../../utils/assetResolver';
import MediaPickerModal from './MediaPickerModal';

const TeamCustomization = ({
  teamData,
  onChange,
  onMemberChange
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-zinc-100 flex items-center gap-3 bg-zinc-50/50">
        <User className="w-6 h-6 text-zinc-700" />
        <h2 className="text-xl font-semibold text-zinc-800">Team Section</h2>
      </div>

      <div className="p-8">
        <div className="space-y-6 max-w-3xl mb-10">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Text Content</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Badge Text</label>
              <input 
                type="text" 
                name="badgeText"
                value={teamData.badgeText || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Section Title</label>
              <input 
                type="text" 
                name="title"
                value={teamData.title || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
            <textarea 
              name="description"
              value={teamData.description || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Team Members List */}
        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-6">Team Members & Photos (5 Items)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(teamData.members || []).map((member, index) => (
              <div key={index} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4 shadow-sm hover:border-zinc-300 transition-colors">
                
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950 text-white text-xs font-bold">
                    {member.id || `0${index + 1}`}
                  </span>
                </div>

                {/* Member Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={member.name || ''}
                      onChange={(e) => onMemberChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Role</label>
                    <input 
                      type="text" 
                      value={member.role || ''}
                      onChange={(e) => onMemberChange(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200/60 mt-3">
                   <label className="block text-xs font-medium text-zinc-500 mb-2">Member Photo</label>
                   <div className="flex items-center gap-4">
                     {member.image ? (
                        <img src={resolveAssetUrl(member.image)} alt="Member Preview" className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shadow-sm" />
                     ) : (
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100">
                          <User className="w-6 h-6 text-zinc-300" />
                        </div>
                     )}
                     
                     <button 
                       type="button" 
                       onClick={() => setActiveMediaIndex(index)} 
                       className="text-xs bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm font-medium flex items-center gap-2"
                     >
                       <ImageIcon className="w-4 h-4"/> Browse Media
                     </button>
                     
                   </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal 
        isOpen={activeMediaIndex !== null}
        onClose={() => setActiveMediaIndex(null)}
        onSelect={(url) => {
          onMemberChange(activeMediaIndex, 'image', url);
        }}
      />
    </div>
  );
};

export default TeamCustomization;