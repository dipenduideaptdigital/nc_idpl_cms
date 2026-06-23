import React from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Settings, Users, Shield, SlidersHorizontal } from 'lucide-react';
import { usePermission } from '../../hooks/usePermission';

const SettingsLayout = () => {
  const { hasPermission } = usePermission();
  const location = useLocation();

  const tabs = [
    { name: 'General', path: '/admin/settings/general', icon: SlidersHorizontal, permission: 'settings.manage' },
    { name: 'Team & Users', path: '/admin/settings/users', icon: Users, permission: 'user.view' },
    { name: 'Access Roles', path: '/admin/settings/roles', icon: Shield, permission: 'role.view' },
  ];

  const visibleTabs = tabs.filter(tab => hasPermission(tab.permission));
  if (visibleTabs.length === 0) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (location.pathname === '/admin/settings' || location.pathname === '/admin/settings/') {
    return <Navigate to={visibleTabs[0].path} replace />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 font-sans">
      
      {/* Settings Navigation Sidebar */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 sticky top-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 leading-tight">Settings</h2>
              <p className="text-xs text-zinc-500 font-medium">Manage workspace</p>
            </div>
          </div>

          <nav className="space-y-1">
            {visibleTabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`
                }
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>

    </div>
  );
};

export default SettingsLayout;