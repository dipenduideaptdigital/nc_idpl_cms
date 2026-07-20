import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, PenTool, Inbox, Briefcase } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6">
      <h2 className="text-lg font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        
        <Link to="/admin/projects/create" className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
          <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-blue-200 group-hover:text-blue-600 transition-all shadow-sm">
            <Briefcase className="w-5 h-5 text-zinc-600 group-hover:text-blue-600" />
          </div>
          <span className="text-sm font-bold text-zinc-800">Add Project</span>
        </Link>

        <Link to="/admin/pages/create" className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
          <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-zinc-300 group-hover:text-zinc-900 transition-all shadow-sm">
            <PlusCircle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-900" />
          </div>
          <span className="text-sm font-bold text-zinc-800">Create Page</span>
        </Link>

        <Link to="/admin/blogs/create" className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
          <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-purple-200 group-hover:text-purple-600 transition-all shadow-sm">
            <PenTool className="w-5 h-5 text-zinc-600 group-hover:text-purple-600" />
          </div>
          <span className="text-sm font-bold text-zinc-800">Write Blog</span>
        </Link>

        <Link to="/admin/contacts/inbox" className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
          <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-amber-200 group-hover:text-amber-600 transition-all shadow-sm">
            <Inbox className="w-5 h-5 text-zinc-600 group-hover:text-amber-600" />
          </div>
          <span className="text-sm font-bold text-zinc-800">View Inbox</span>
        </Link>

      </div>
    </div>
  );
};

export default QuickActions;