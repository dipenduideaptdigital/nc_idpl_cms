import React from 'react';
import { Inbox, Briefcase, FileText, BookOpen, ArrowUpRight, Minus } from 'lucide-react';

const StatCards = ({ statsData }) => {
  const stats = [
    { 
      label: 'Unread Inquiries', 
      value: statsData.unreadInquiries, 
      trend: `+${statsData.newInquiriesToday} Today`, 
      trendUp: statsData.newInquiriesToday > 0 ? true : null, 
      icon: Inbox, color: 'text-amber-600', bg: 'bg-amber-50' 
    },
    { label: 'Published Projects', value: statsData.publishedProjects, trend: 'Live', trendUp: true, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Published Pages', value: statsData.publishedPages, trend: 'Live', trendUp: null, icon: FileText, color: 'text-zinc-600', bg: 'bg-zinc-100' },
    { label: 'Published Blogs', value: statsData.publishedBlogs, trend: 'Live', trendUp: true, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
              <stat.icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              stat.trendUp === true ? 'bg-emerald-50 text-emerald-700' : 
              stat.trendUp === false ? 'bg-red-50 text-red-700' : 'bg-zinc-100 text-zinc-600'
            }`}>
              {stat.trendUp === true ? <ArrowUpRight className="w-3 h-3" /> : stat.trendUp === null ? <Minus className="w-3 h-3" /> : null}
              {stat.trend}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{stat.value}</h3>
            <p className="text-sm font-medium text-zinc-500 mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;