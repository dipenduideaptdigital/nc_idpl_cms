import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const RecentInquiries = ({ leads }) => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
        <h2 className="text-lg font-bold text-zinc-900">Recent Inquiries</h2>
        <Link to="/admin/contacts/inbox" className="text-zinc-400 hover:text-zinc-900 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </Link>
      </div>
      <div className="space-y-5 flex-1">
        {leads.length > 0 ? (
          leads.map(lead => (
            <Link to="/admin/contacts/inbox" key={lead.id} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-600 shrink-0 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-200 transition-colors uppercase">
                {lead.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate group-hover:text-amber-600 transition-colors">{lead.name}</p>
                <p className="text-xs text-zinc-500 truncate">{lead.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                  lead.status === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  lead.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {lead.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">{getTimeAgo(lead.createdAt)}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm italic">
            No recent inquiries.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentInquiries;