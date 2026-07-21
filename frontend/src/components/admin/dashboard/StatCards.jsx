import React from 'react';
import { Inbox, Briefcase, FileText, BookOpen, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Can from '../../shared/Can';

const StatCards = ({ statsData }) => {
  const { inquiries, projects, pages, blogs } = statsData.stats;
  const stats = [
    { label: 'Total Inquiries', value: inquiries.value, trend: inquiries.trend, icon: Inbox, color: 'text-amber-600', bg: 'bg-amber-50', permission: 'contact.view' },
    { label: 'Published Projects', value: projects.value, trend: projects.trend, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', permission: 'project.view' },
    { label: 'Published Pages', value: pages.value, trend: pages.trend, icon: FileText, color: 'text-zinc-600', bg: 'bg-zinc-100', permission: 'page.view' },
    { label: 'Published Blogs', value: blogs.value, trend: blogs.trend, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', permission: 'blog.view' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => {
        const isUp = stat.trend > 0;
        const isDown = stat.trend < 0;
        const isNeutral = stat.trend === 0;

        return (
          <Can key={idx} permission={stat.permission}>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  isUp ? 'bg-emerald-50 text-emerald-700' : isDown ? 'bg-red-50 text-red-700' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : isDown ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {Math.abs(stat.trend)}%
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-zinc-900">{stat.value}</h3>
                <p className="text-sm font-medium text-zinc-500 mt-1">{stat.label}</p>
              </div>
            </div>
          </Can>
        );
      })}
    </div>
  );
};

export default StatCards;