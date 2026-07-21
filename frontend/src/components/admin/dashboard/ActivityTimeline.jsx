import React from 'react';
import { Activity, Layout, Inbox, BookOpen } from 'lucide-react';

// Format Helper
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const getActivityUI = (type) => {
  switch (type) {
    case 'LEAD':
      return { icon: Inbox, color: 'text-amber-500', bg: 'bg-amber-50' };
    case 'BLOG':
      return { icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' };
    case 'PAGE':
      return { icon: Layout, color: 'text-blue-500', bg: 'bg-blue-50' };
    default:
      return { icon: Activity, color: 'text-zinc-500', bg: 'bg-zinc-100' };
  }
};

const ActivityTimeline = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
        <Activity className="w-5 h-5 text-zinc-700" />
        <h2 className="text-lg font-bold text-zinc-900">System Activity Stream</h2>
      </div>
      
      <div className="relative pl-3 space-y-6 flex-1 max-h-[380px] overflow-y-auto pr-2">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-200"></div>
        
        {activities.length > 0 ? (
          activities.map((act) => {
            const ui = getActivityUI(act.type);
            const Icon = ui.icon;

            return (
              <div key={act.id} className="relative flex gap-4 items-start group">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${ui.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-3.5 h-3.5 ${ui.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800 leading-snug">{act.text}</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{getTimeAgo(act.time)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm italic">
            No recent system activity recorded.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;