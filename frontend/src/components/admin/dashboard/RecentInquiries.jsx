import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Inbox, Clock } from 'lucide-react';

const getPrimaryIdentifiers = (payload) => {
  if (!payload) return { title: 'Empty Entry', subtitle: '' };
  const keys = Object.keys(payload);
  if (keys.length === 0) return { title: 'Empty Entry', subtitle: '' };
  
  const nameKey = keys.find(k => k.toLowerCase().includes('name')) || keys[0];
  const emailKey = keys.find(k => k.toLowerCase().includes('email')) || keys[1];

  return {
    title: payload[nameKey] || 'Unknown User',
    subtitle: emailKey ? payload[emailKey] : ''
  };
};

const RecentInquiries = ({ leads }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Inbox className="w-4 h-4 text-amber-500" /> Recent Entries
        </h3>
        <Link to="/admin/forms/entries" className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {leads && leads.length > 0 ? (
          <div className="space-y-1">
            {leads.map((lead) => {
              const { title, subtitle } = getPrimaryIdentifiers(lead.payload);
              return (
                <Link 
                  key={lead.id} 
                  to={`/admin/forms/${lead.formId}/submissions`}
                  className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate pr-2">
                      {title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1 shrink-0 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-zinc-500 truncate">{subtitle}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-800/30 truncate max-w-[100px]">
                      {lead.form?.title || 'Form'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <Inbox className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">No recent entries</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentInquiries;