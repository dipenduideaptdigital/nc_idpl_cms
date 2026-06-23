import React, { useState } from 'react';
import { 
  Eye, Inbox, FileText, BookOpen, DownloadCloud, 
  ArrowUpRight, Minus, MoreHorizontal, PlusCircle, 
  PenTool, UserPlus, Settings, Activity, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [chartRange, setChartRange] = useState('30D');

  const stats = [
    { label: 'Total Views', value: '45.2K', trend: '+12%', trendUp: true, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Leads', value: '128', trend: '+5%', trendUp: true, icon: Inbox, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Published Pages', value: '24', trend: '0%', trendUp: null, icon: FileText, color: 'text-zinc-600', bg: 'bg-zinc-100' },
    { label: 'Published Blogs', value: '18', trend: '+2%', trendUp: true, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentLeads = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', status: 'NEW', time: '2h ago' },
    { id: 2, name: 'Priya Das', email: 'priya.design@gmail.com', status: 'IN_PROGRESS', time: '5h ago' },
    { id: 3, name: 'Amit Enterprise', email: 'contact@amitent.in', status: 'NEW', time: '1d ago' },
    { id: 4, name: 'Neha Gupta', email: 'neha99@yahoo.com', status: 'RESOLVED', time: '2d ago' },
  ];

  const activities = [
    { id: 1, text: 'Admin published "Modern Interiors" blog', time: '10 mins ago', icon: BookOpen, iconColor: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 2, text: 'Super Admin updated Role permissions', time: '1 hour ago', icon: Shield, iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 3, text: 'New contact form submission received', time: '2 hours ago', icon: Inbox, iconColor: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 4, text: 'System settings modified', time: '1 day ago', icon: Settings, iconColor: 'text-zinc-500', bg: 'bg-zinc-100' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium tracking-wide">
            {currentDate}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-800 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
          <DownloadCloud className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* 2. Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
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

      {/* 3. Middle Section (Analytics & Leads) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 z-10">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Website Traffic</h2>
              <p className="text-xs text-zinc-500 font-medium mt-1">Unique visitors over time</p>
            </div>
            <div className="flex items-center bg-zinc-100/80 p-1 rounded-lg border border-zinc-200/50">
              {['7D', '30D', '1Y'].map(range => (
                <button 
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    chartRange === range ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dummy Elegant SVG Chart */}
          <div className="flex-1 min-h-[220px] w-full relative mt-auto z-10 flex items-end">
            <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M0,100 L0,50 C50,40 100,80 150,60 C200,40 250,20 300,30 C350,40 400,10 400,10 L400,100 Z" fill="url(#chartGradient)"/>
              <path d="M0,50 C50,40 100,80 150,60 C200,40 250,20 300,30 C350,40 400,10 400,10" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>
        </div>

        {/* Right: Recent Leads */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-bold text-zinc-900">Recent Inquiries</h2>
            <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-5 flex-1">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-600 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate">{lead.name}</p>
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
                  <span className="text-[10px] text-zinc-400 font-medium">{lead.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Section (Activity & Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Activity Timeline */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
            <Activity className="w-5 h-5 text-zinc-700" />
            <h2 className="text-lg font-bold text-zinc-900">Recent Activity</h2>
          </div>
          
          <div className="relative pl-3 space-y-6">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-200"></div>
            {activities.map((act) => (
              <div key={act.id} className="relative flex gap-4 items-start">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${act.bg}`}>
                  <act.icon className={`w-3.5 h-3.5 ${act.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800 leading-snug">{act.text}</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            
            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
              <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-blue-200 group-hover:text-blue-600 transition-all shadow-sm">
                <PlusCircle className="w-5 h-5 text-zinc-600 group-hover:text-blue-600" />
              </div>
              <span className="text-sm font-bold text-zinc-800">Create Page</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
              <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-purple-200 group-hover:text-purple-600 transition-all shadow-sm">
                <PenTool className="w-5 h-5 text-zinc-600 group-hover:text-purple-600" />
              </div>
              <span className="text-sm font-bold text-zinc-800">Write Blog</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
              <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all shadow-sm">
                <UserPlus className="w-5 h-5 text-zinc-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-zinc-800">Add User</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-200 hover:shadow-sm rounded-2xl transition-all group">
              <div className="w-10 h-10 bg-white border border-zinc-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-amber-200 group-hover:text-amber-600 transition-all shadow-sm">
                <Settings className="w-5 h-5 text-zinc-600 group-hover:text-amber-600" />
              </div>
              <span className="text-sm font-bold text-zinc-800">Settings</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;