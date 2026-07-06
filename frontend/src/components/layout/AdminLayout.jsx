import React, { useState } from 'react';
import { Outlet, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Image as ImageIcon, Settings, LogOut, FileText, 
  Globe, Inbox, Menu, X, BookOpen, Tag, Layers 
} from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext'; 
import { usePermission } from '../../hooks/usePermission'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logoutContext } = useAuth(); 
  const { hasPermission } = usePermission(); 
  
  const roleSlug = user?.systemRole?.slug?.toUpperCase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated || !user || (roleSlug !== 'SUPER_ADMIN' && roleSlug !== 'ADMIN')) {
    return <Navigate to="/login?mode=admin" replace />;
  }

  const handleLogout = async () => {
    await logoutContext(); 
    navigate('/login?mode=admin');
  };

  const canViewSettings = hasPermission('settings.manage') || hasPermission('user.view') || hasPermission('role.view');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', superAdminOnly: true },
    { name: 'Landing pages', icon: FileText, path: '/admin/pages', permission: 'page.view' },
    { name: 'Home page', icon: ImageIcon, path: '/admin/home-customization', permission: 'page.edit' },
    { name: 'Pages', icon: Layers, path: '/admin/site-pages', permission: 'page.view' },
    { name: 'Blog Posts', icon: BookOpen, path: '/admin/blogs', permission: 'blog.view' },
    { name: 'Categories & Tags', icon: Tag, path: '/admin/blogs/taxonomies', permission: 'blog.view' },
    { name: 'Contact Forms', icon: Inbox, path: '/admin/contact-forms', permission: 'contact.view' },
    { name: 'Contact Inbox', icon: Inbox, path: '/admin/contacts/inbox', permission: 'contact.view' },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.superAdminOnly && roleSlug !== 'SUPER_ADMIN') return false;
    if (!item.permission && !item.superAdminOnly) return true;
    return hasPermission(item.permission);
  });

  const currentPath = location.pathname;

  if (
    currentPath === '/admin' || 
    currentPath === '/admin/' || 
    (currentPath === '/admin/dashboard' && roleSlug !== 'SUPER_ADMIN')
  ) {
    const firstAssignedPath = visibleNavItems.length > 0 ? visibleNavItems[0].path : null;
    
    if (!firstAssignedPath && canViewSettings) {
      return <Navigate to="/admin/settings" replace />;
    }

    if (firstAssignedPath) {
      return <Navigate to={firstAssignedPath} replace />;
    } 
    
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50 flex-col font-sans">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Restricted</h2>
          <p className="text-sm text-zinc-500 mb-6">Your staff account is active, but you have 0 functional permissions assigned. Please ask a Super Admin to assign you a role.</p>
          <button onClick={handleLogout} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-zinc-900 overflow-hidden font-sans relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-72 h-full bg-blue-900 text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-blue-800/50 shadow-2xl z-30 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between border-b border-blue-800/50">
          <div className="text-2xl font-bold tracking-widest uppercase flex flex-col items-center">
            <span className="text-white">IDPL CMS</span>
            <span className="text-[10px] text-blue-300 tracking-[0.3em] mt-1">Interior Decor</span>
          </div>
          <button className="md:hidden text-white hover:bg-blue-800 p-2 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-500/50' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="font-medium tracking-wide text-sm">{item.name}</span>
            </NavLink>
          ))}

          {canViewSettings && (
            <NavLink
              to="/admin/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={() =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  location.pathname.includes('/admin/settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-500/50' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" strokeWidth={1.5} />
              <span className="font-medium tracking-wide text-sm">Settings</span>
            </NavLink>
          )}
        </nav>

        <div className="p-6 border-t border-blue-800/50 space-y-2">
          <NavLink to="/" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-blue-100 hover:text-white hover:bg-blue-800 transition-all duration-300 group cursor-pointer">
            <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="font-medium text-sm">Back to Site</span>
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-blue-100 hover:text-white hover:bg-blue-800 transition-all duration-300 group cursor-pointer">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
 
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#f4f4f5] w-full">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 sm:px-10 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 rounded-xl text-zinc-600 hover:bg-zinc-100" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-800 tracking-tight">Admin Portal</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-zinc-800">{user?.name || 'Staff'}</p>
              <p className="text-xs text-zinc-500 uppercase">{user?.systemRole?.name || 'Admin'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md uppercase shrink-0">
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-10 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;