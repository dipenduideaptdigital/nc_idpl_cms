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
    <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto text-[#2B2A28]">

      {/* Settings Navigation Sidebar */}
      <div className="lg:w-60 flex-shrink-0">
        <div className="sticky top-6 border-r border-[#DDD6C7] lg:pr-6">
          <div className="border-b-4 border-double border-[#2B2A28] pb-3 mb-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#3F5C73] font-bold mb-1">Workspace</p>
            <h2 className="font-serif text-xl font-bold text-[#2B2A28] flex items-center gap-2">
              <Settings className="w-4.5 h-4.5 text-[#3F5C73]" />
              Settings
            </h2>
          </div>

          <nav className="space-y-0.5">
            {visibleTabs.map((tab, idx) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 transition-colors text-sm font-mono uppercase tracking-wide border-l-2 ${
                    isActive
                      ? 'border-[#B5563A] text-[#2B2A28] bg-[#F3EFE4]/50'
                      : 'border-transparent text-[#8A8378] hover:text-[#2B2A28] hover:border-[#DDD6C7]'
                  }`
                }
              >
                <span className="text-[10px] text-[#B5563A] tabular-nums w-4 flex-shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.name}</span>
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