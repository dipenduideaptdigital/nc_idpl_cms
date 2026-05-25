import React from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut, FileText, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutContext } = useAuth(); 
  const roleSlug = user?.systemRole?.slug?.toUpperCase();

  // Role & Auth Validation
  if (!isAuthenticated || !user || (roleSlug !== 'SUPER_ADMIN' && roleSlug !== 'ADMIN')) {
    return <Navigate to="/login?mode=admin" replace />;
  }

  const handleLogout = async () => {
    await logoutContext(); 
    navigate('/login?mode=admin');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Home Customization', icon: ImageIcon, path: '/admin/home-customization' },
    { name: 'Projects', icon: FileText, path: '/admin/projects' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-zinc-900 overflow-hidden font-sans">
      {/* Sidebar - Premium Dark Theme */}
      <aside className="w-72 bg-zinc-950 text-white flex flex-col transition-all duration-300 border-r border-zinc-800 shadow-2xl z-20">
        <div className="p-8 flex items-center justify-center border-b border-zinc-800/50">
          <div className="text-2xl font-bold tracking-widest uppercase flex flex-col items-center">
            <span className="text-white">IDPL CMS</span>
            <span className="text-[10px] text-zinc-500 tracking-[0.3em] mt-1">Interior Decor</span>
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="font-medium tracking-wide text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-800/50 space-y-2">
          <NavLink 
            to="/"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 group cursor-pointer"
          >
            <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="font-medium text-sm">Back to Site</span>
          </NavLink>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 group cursor-pointer"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
 
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f4f4f5]">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-10 z-10 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-800 tracking-tight">Admin Portal</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-zinc-800">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-zinc-500">{user?.systemRole?.name || 'Super Admin'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-200 flex items-center justify-center text-white font-bold shadow-md uppercase">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-10 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;