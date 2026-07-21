import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, PenTool, LayoutTemplate } from 'lucide-react';
import Can from '../../shared/Can';

const QuickActions = () => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 flex flex-col h-full">
      <div className="mb-6 border-b border-zinc-100 pb-4">
        <h2 className="text-lg font-bold text-zinc-900">Quick Actions</h2>
        <p className="text-xs text-zinc-500 font-medium mt-1">Shortcuts to common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Can permission="blog.create">
          <Link to="/admin/blogs/create" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors group">
            <PenTool className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Write Blog</span>
          </Link>
        </Can>

        <Can permission="project.create">
          <Link to="/admin/projects/create" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors group">
            <LayoutTemplate className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Add Project</span>
          </Link>
        </Can>

        <Can permission="page.create">
          <Link to="/admin/pages/create" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors group">
            <FileText className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Create Page</span>
          </Link>
        </Can>
        
        <Can permission="user.view">
          <Link to="/admin/settings/users" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors group">
            <PlusCircle className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Manage Users</span>
          </Link>
        </Can>
      </div>
    </div>
  );
};

export default QuickActions;