import React, { useState, useEffect } from 'react';
import { usersApi } from '../../../api/users';
import { rolesApi } from '../../../api/roles';
import { 
  Users, Search, Shield, UserPlus, CheckCircle, PowerOff, 
  Trash2, Mail, X, Loader2, AlertTriangle, Eye, Clock, Key, Activity 
} from 'lucide-react';
import { Can } from '../../../components/shared/Can';
import { useAuth } from '../../../context/AuthContext';

const TABS = [
  { id: 'team', label: 'Staff & Team', filter: { systemRole: 'ADMIN' } },
  { id: 'super', label: 'Super Admins', filter: { systemRole: 'SUPER_ADMIN' } },
  { id: 'pending', label: 'Pending Invites', filter: { status: 'PENDING' } }
];

const UsersList = () => {
  const { user: currentUser } = useAuth();
  
  // Data States
  const [users, setUsers] = useState([]);
  const [functionalRoles, setFunctionalRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  
  // UI States
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals & User Selections
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [detailsModalUser, setDetailsModalUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 

  // Invite Form State
  const [inviteData, setInviteData] = useState({ name: '', email: '', systemRoleSlug: 'ADMIN', functionalRoleIds: [] });
  const [inviting, setInviting] = useState(false);

  // Edit Role Form State
  const [editRoleData, setEditRoleData] = useState({ systemRoleSlug: '', functionalRoleIds: [] });
  const [updatingRoles, setUpdatingRoles] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRolesForDropdown();
  }, [currentPage, searchTerm, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const currentTabFilter = TABS.find(t => t.id === activeTab)?.filter || {};
      const res = await usersApi.getAllUsers({ 
        page: currentPage, 
        limit: 10, 
        search: searchTerm,
        ...currentTabFilter
      });
      setUsers(res.data || []);
      setMeta({ totalPages: res.totalPages, page: res.currentPage });
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesForDropdown = async () => {
    try {
      const res = await rolesApi.getAllRoles();
      setFunctionalRoles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch functional roles", err);
    }
  };

  // --- Handlers for User Actions ---

  const handleOpenDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setDetailsModalUser({ id: userId, isLoading: true }); 
      const res = await usersApi.getUserDetails(userId);
      setDetailsModalUser({ ...res.data, isLoading: false });
    } catch (err) {
      alert("Failed to load user details.");
      setDetailsModalUser(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRevokeSessions = async (userId) => {
    if (!window.confirm("This will forcefully log the user out from all devices immediately. Continue?")) return;
    try {
      await usersApi.revokeSessions(userId);
      alert("All sessions revoked successfully.");
      setDetailsModalUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to revoke sessions.");
    }
  };

  const handleCancelInvite = async (email) => {
    if (!window.confirm("Are you sure you want to cancel this invitation?")) return;
    try {
      await usersApi.cancelInvite(email);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel invite.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const isActivating = currentStatus !== 'ACTIVE';
    const action = isActivating ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;
    try {
      await usersApi.updateUserStatus(userId, isActivating ? 'ACTIVE' : 'SUSPENDED');
      fetchUsers();
      if (detailsModalUser?.id === userId) setDetailsModalUser(null); 
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  // --- Handlers for Forms & Roles ---

  const toggleFunctionalRoleArray = (stateObj, setter, roleId) => {
    const arr = stateObj.functionalRoleIds;
    setter(prev => ({
      ...prev,
      functionalRoleIds: arr.includes(roleId) ? arr.filter(id => id !== roleId) : [...arr, roleId]
    }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email) return;

    try {
      setInviting(true);
      await usersApi.inviteAdmin(inviteData);
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', systemRoleSlug: 'ADMIN', functionalRoleIds: [] });
      if (activeTab === 'pending') fetchUsers();
      else setActiveTab('pending');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setInviting(false);
    }
  };

  const openEditRolesModal = async (u) => {
    setEditingUser(u);
    try {
      const res = await usersApi.getUserFunctionalRoles(u.id);
      const assignedIds = res.data.map(r => r.id);
      setEditRoleData({
        systemRoleSlug: u.systemRole.slug,
        functionalRoleIds: assignedIds
      });
    } catch (err) {
      alert('Failed to fetch user roles.');
    }
  };

  const handleUpdateUserRoles = async (e) => {
    e.preventDefault();
    try {
      setUpdatingRoles(true);
      
      if (editRoleData.systemRoleSlug !== editingUser.systemRole.slug) {
        await usersApi.updateSystemRole(editingUser.id, editRoleData.systemRoleSlug);
      }

      await usersApi.assignFunctionalRoles(editingUser.id, editRoleData.functionalRoleIds);
      
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update roles.');
    } finally {
      setUpdatingRoles(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-[#2B2A28]">

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-double border-[#2B2A28] pb-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#3F5C73] font-bold mb-1.5">Personnel Register</p>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-2.5 text-[#2B2A28]">
            <Users className="w-6 h-6 text-[#3F5C73]" />
            Team &amp; Users
          </h1>
          <p className="text-sm text-[#8A8378] mt-1 font-serif italic">Manage staff accounts, invites, and system access.</p>
        </div>

        <Can permission="user.create">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2B2A28] text-[#FAF7F0] font-mono text-sm uppercase tracking-wide hover:bg-[#3F5C73] transition-colors flex-shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Invite Staff
          </button>
        </Can>
      </div>

      {/* Main Content Area */}
      <div className="border border-[#DDD6C7]">

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-[#DDD6C7] px-2 gap-1 bg-[#F3EFE4]/50 overflow-x-auto">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`px-4 py-3 text-[12px] font-mono uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-[#B5563A] text-[#2B2A28] bg-[#FAF7F0]' : 'border-transparent text-[#8A8378] hover:text-[#2B2A28]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Toolbar */}
        <div className="p-4 flex items-center justify-between border-b border-dotted border-[#DDD6C7]">
          <div className="relative w-full max-w-sm border border-[#DDD6C7] focus-within:border-[#3F5C73] transition-colors">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8378] w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 outline-none text-sm font-serif bg-transparent placeholder:text-[#8A8378]/70"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#F3EFE4]/60 border-b border-[#DDD6C7]">
              <tr>
                <th className="px-6 py-3 font-mono text-[#8A8378] text-[11px] uppercase tracking-wider">Entry</th>
                {activeTab !== 'pending' && <th className="px-6 py-3 font-mono text-[#8A8378] text-[11px] uppercase tracking-wider">Roles</th>}
                <th className="px-6 py-3 font-mono text-[#8A8378] text-[11px] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 font-mono text-[#8A8378] text-[11px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dotted divide-[#DDD6C7]">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#8A8378]" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-[#8A8378] font-serif italic">No users found in this category.</td></tr>
              ) : (
                users.map((u, idx) => {
                  const isSelf = u.id === currentUser.id;
                  const isSuperAdmin = u.systemRole.slug === 'SUPER_ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-[#F3EFE4]/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-[#B5563A] tabular-nums w-8 flex-shrink-0">
                            {String((currentPage - 1) * 10 + idx + 1).padStart(3, '0')}
                          </span>
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 border-2 ${u.status === 'SUSPENDED' ? 'border-[#B5563A] text-[#B5563A]' : 'border-[#3F5C73] text-[#3F5C73]'} bg-[#FAF7F0]`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-serif font-bold text-[15px] text-[#2B2A28] flex items-center gap-2">
                              {u.name}
                              {isSelf && <span className="bg-[#3F5C73] text-[#FAF7F0] text-[9px] px-1.5 py-0.5 font-mono uppercase tracking-wide">You</span>}
                            </div>
                            <div className="text-xs text-[#8A8378] mt-0.5 font-mono truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {activeTab !== 'pending' && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider border ${isSuperAdmin ? 'border-[#7A4F8C] text-[#7A4F8C] bg-[#7A4F8C]/5' : 'border-[#DDD6C7] text-[#8A8378] bg-transparent'}`}>
                              {u.systemRole.name.toUpperCase()}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {u.functionalRoles?.map(fr => (
                                <span key={fr.functionalRole.slug} className="text-[10px] font-mono text-[#5B6B4F] border border-dashed border-[#5B6B4F]/40 px-1.5 py-0.5">
                                  {fr.functionalRole.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-4">
                        {u.status === 'ACTIVE' && <span className="text-[11px] font-mono font-bold uppercase tracking-wide text-[#5B6B4F] border border-[#5B6B4F]/40 px-2.5 py-1 flex items-center gap-1.5 w-max"><CheckCircle className="w-3.5 h-3.5" /> Active</span>}
                        {u.status === 'PENDING' && <span className="text-[11px] font-mono font-bold uppercase tracking-wide text-[#A67C2E] border border-[#A67C2E]/40 px-2.5 py-1 flex items-center gap-1.5 w-max"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                        {u.status === 'SUSPENDED' && <span className="text-[11px] font-mono font-bold uppercase tracking-wide text-[#B5563A] border border-[#B5563A]/40 px-2.5 py-1 flex items-center gap-1.5 w-max"><PowerOff className="w-3.5 h-3.5" /> Suspended</span>}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* Cancel Invite Button (Only for Pending) */}
                          {activeTab === 'pending' && (
                            <Can permission="user.delete">
                              <button onClick={() => handleCancelInvite(u.email)} className="p-2 text-[#B5563A] hover:bg-[#B5563A]/10 transition-colors" title="Cancel Invite">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Can>
                          )}

                          {/* View Profile / Settings (For Active/Suspended) */}
                          {activeTab !== 'pending' && (
                            <Can permission="user.view">
                              <button onClick={() => handleOpenDetails(u.id)} className="p-2 text-[#3F5C73] hover:bg-[#3F5C73]/10 transition-colors" title="View Profile">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Can>
                          )}

                          {/* Edit Roles (Manage Access) */}
                          {!isSelf && (!isSuperAdmin || currentUser.systemRole === 'SUPER_ADMIN') && activeTab !== 'pending' && (
                            <Can permission="user.edit">
                              <button onClick={() => openEditRolesModal(u)} className="p-2 text-[#7A4F8C] hover:bg-[#7A4F8C]/10 transition-colors" title="Manage Access">
                                <Shield className="w-4 h-4" />
                              </button>
                            </Can>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Pagination */}
      {meta?.totalPages > 1 && (
        <div className="pt-6 flex justify-center items-center gap-4 font-mono text-sm">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-[#DDD6C7] uppercase text-[11px] tracking-wide hover:border-[#2B2A28] disabled:opacity-40 disabled:hover:border-[#DDD6C7] transition-colors">Prev</button>
          <span className="text-[#8A8378] tabular-nums">{String(currentPage).padStart(2, '0')} / {String(meta.totalPages).padStart(2, '0')}</span>
          <button onClick={() => setCurrentPage(p => Math.min(meta.totalPages, p + 1))} disabled={currentPage === meta.totalPages} className="px-3 py-1 border border-[#DDD6C7] uppercase text-[11px] tracking-wide hover:border-[#2B2A28] disabled:opacity-40 disabled:hover:border-[#DDD6C7] transition-colors">Next</button>
        </div>
      )}

      {/*DETAILS MODAL*/}
      {detailsModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2A28]/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF7F0] border border-[#DDD6C7] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {detailsModalUser.isLoading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#3F5C73]" /></div>
            ) : (
              <>
                <div className="p-6 border-b-4 border-double border-[#2B2A28] flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-[#3F5C73] bg-[#FAF7F0] text-[#3F5C73] flex items-center justify-center text-2xl font-mono font-bold flex-shrink-0">
                      {detailsModalUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-[#2B2A28]">{detailsModalUser.name}</h2>
                      <p className="text-sm text-[#8A8378] font-mono">{detailsModalUser.email}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-0.5 border border-[#3F5C73]/40 text-[#3F5C73] text-[10px] font-mono font-bold uppercase tracking-wide">{detailsModalUser.systemRole?.name}</span>
                        {detailsModalUser.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 border border-[#5B6B4F]/40 text-[#5B6B4F] text-[10px] font-mono font-bold uppercase tracking-wide">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 border border-[#B5563A]/40 text-[#B5563A] text-[10px] font-mono font-bold uppercase tracking-wide">Suspended</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setDetailsModalUser(null)} className="p-2 text-[#8A8378] hover:text-[#2B2A28] transition-colors flex-shrink-0"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-[12px] font-mono font-bold uppercase tracking-wider text-[#2B2A28] mb-3 flex items-center gap-2 border-b border-dotted border-[#DDD6C7] pb-2"><Key className="w-4 h-4 text-[#8A8378]" /> Granted Permissions</h3>
                    {detailsModalUser.permissionsList?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {detailsModalUser.permissionsList.map(perm => (
                          <span key={perm} className="px-2.5 py-1 border border-dashed border-[#DDD6C7] text-[#5B6B4F] text-xs font-mono font-medium">
                            {perm}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#8A8378] font-serif italic">No specific functional permissions granted.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-[12px] font-mono font-bold uppercase tracking-wider text-[#2B2A28] mb-3 flex items-center gap-2 border-b border-dotted border-[#DDD6C7] pb-2">
                      <Activity className="w-4 h-4 text-[#8A8378]" /> Recent Activity
                    </h3>
                    {detailsModalUser.recentActivity?.length > 0 ? (
                      <div className="space-y-4 pt-1">
                        {detailsModalUser.recentActivity.map((activity, idx) => (
                          <div key={activity.id || idx} className="flex flex-col gap-1 border-l-2 border-[#3F5C73]/40 pl-3 py-0.5">
                            <span className="text-[14px] text-[#2B2A28] font-serif font-medium">
                              Updated blog: <span className="italic text-[#3F5C73]">{activity.blog?.title}</span>
                            </span>
                            <span className="text-[10px] font-mono text-[#8A8378] tracking-wide">
                              {new Date(activity.createdAt).toLocaleString(undefined, { 
                                year: 'numeric', month: 'short', day: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#8A8378] font-serif italic">No recent system activity logged for this user.</p>
                    )}
                  </div>

                  {currentUser.id !== detailsModalUser.id && (
                    <div>
                      <h3 className="text-[12px] font-mono font-bold uppercase tracking-wider text-[#B5563A] mb-3 flex items-center gap-2 border-b border-dotted border-[#B5563A]/30 pb-2"><Shield className="w-4 h-4" /> Security Controls</h3>
                      <div className="flex gap-3 flex-wrap">
                        <Can permission="user.suspend">
                          <button onClick={() => handleToggleStatus(detailsModalUser.id, detailsModalUser.status)} className={`px-4 py-2 text-sm font-mono uppercase tracking-wide border transition-colors ${detailsModalUser.status === 'ACTIVE' ? 'border-[#A67C2E] text-[#A67C2E] hover:bg-[#A67C2E]/10' : 'border-[#5B6B4F] text-[#5B6B4F] hover:bg-[#5B6B4F]/10'}`}>
                            {detailsModalUser.status === 'ACTIVE' ? 'Suspend Account' : 'Re-activate Account'}
                          </button>
                          
                          <button onClick={() => handleRevokeSessions(detailsModalUser.id)} className="px-4 py-2 border border-[#B5563A] text-[#B5563A] hover:bg-[#B5563A]/10 text-sm font-mono uppercase tracking-wide transition-colors">
                            Force Logout (All Devices)
                          </button>
                        </Can>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/*INVITE MODAL*/}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2A28]/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF7F0] border border-[#DDD6C7] w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="flex justify-between items-center p-6 border-b-4 border-double border-[#2B2A28]">
               <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-[#2B2A28]"><UserPlus className="w-5 h-5 text-[#3F5C73]" /> Invite Staff</h2>
               <button onClick={() => setIsInviteModalOpen(false)} className="text-[#8A8378] hover:text-[#2B2A28]"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleInviteSubmit} className="p-6 space-y-5">
               <div>
                 <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">Full Name</label>
                 <input required type="text" value={inviteData.name} onChange={e => setInviteData(p => ({ ...p, name: e.target.value }))} className="w-full border border-[#DDD6C7] px-4 py-2.5 font-serif bg-transparent outline-none focus:border-[#3F5C73] transition-colors" />
               </div>
               <div>
                 <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">Email</label>
                 <input required type="email" value={inviteData.email} onChange={e => setInviteData(p => ({ ...p, email: e.target.value }))} className="w-full border border-[#DDD6C7] px-4 py-2.5 font-serif bg-transparent outline-none focus:border-[#3F5C73] transition-colors" />
               </div>
               
               <div>
                 <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">System Role</label>
                 <select value={inviteData.systemRoleSlug} onChange={e => setInviteData(p => ({ ...p, systemRoleSlug: e.target.value }))} className="w-full border border-[#DDD6C7] px-4 py-2.5 bg-[#F3EFE4]/40 font-serif font-medium outline-none focus:border-[#3F5C73] transition-colors">
                   <option value="ADMIN">ADMIN (Standard)</option>
                   <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                 </select>
               </div>

               {inviteData.systemRoleSlug !== 'SUPER_ADMIN' && (
                 <div>
                   <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-2">Functional Roles (Access Bundles)</label>
                   <div className="flex flex-wrap gap-2 p-3 bg-[#F3EFE4]/40 border border-[#DDD6C7] max-h-40 overflow-y-auto">
                     {functionalRoles.map(role => (
                       <label key={role.id} className={`flex items-center gap-2 px-3 py-1.5 border cursor-pointer transition-colors ${inviteData.functionalRoleIds.includes(role.id) ? 'bg-[#3F5C73]/10 border-[#3F5C73]/40 text-[#3F5C73]' : 'bg-[#FAF7F0] border-[#DDD6C7] hover:bg-[#F3EFE4]'}`}>
                         <input type="checkbox" className="hidden" checked={inviteData.functionalRoleIds.includes(role.id)} onChange={() => toggleFunctionalRoleArray(inviteData, setInviteData, role.id)} />
                         <span className="text-sm font-medium font-serif">{role.name}</span>
                       </label>
                     ))}
                   </div>
                 </div>
               )}

               <div className="flex justify-end gap-3 pt-4 border-t border-dotted border-[#DDD6C7]">
                 <button type="button" onClick={() => setIsInviteModalOpen(false)} className="px-5 py-2 text-sm font-mono uppercase tracking-wide text-[#8A8378] hover:text-[#2B2A28] transition-colors">Cancel</button>
                 <button type="submit" disabled={inviting} className="px-5 py-2 text-sm font-mono uppercase tracking-wide text-[#FAF7F0] bg-[#2B2A28] hover:bg-[#3F5C73] transition-colors flex items-center gap-2">
                   {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Send Invite
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/*EDIT ROLES MODAL*/}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B2A28]/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF7F0] border border-[#DDD6C7] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b-4 border-double border-[#2B2A28]">
              <div>
                <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-[#2B2A28]"><Shield className="w-5 h-5 text-[#7A4F8C]" /> Manage Access</h2>
                <p className="text-sm text-[#8A8378] mt-1 font-serif italic">Modifying roles for <strong className="font-bold not-italic">{editingUser.name}</strong></p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-[#8A8378] hover:text-[#2B2A28]"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleUpdateUserRoles} className="p-6 space-y-5">
              <div className="border border-[#A67C2E]/40 bg-[#A67C2E]/5 p-3 flex gap-2 text-[#8a6420] text-sm font-serif">
                <AlertTriangle className="w-5 h-5 shrink-0" /> The user's active sessions will be terminated automatically to apply these changes securely.
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">System Role</label>
                <select value={editRoleData.systemRoleSlug} onChange={e => setEditRoleData(p => ({ ...p, systemRoleSlug: e.target.value }))} className="w-full border border-[#DDD6C7] px-4 py-2.5 bg-[#F3EFE4]/40 font-serif font-medium outline-none focus:border-[#7A4F8C] transition-colors">
                  <option value="ADMIN">ADMIN (Standard)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                </select>
              </div>

              {editRoleData.systemRoleSlug !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-2">Functional Roles (Access Bundles)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-[#F3EFE4]/40 border border-[#DDD6C7] max-h-48 overflow-y-auto">
                    {functionalRoles.map(role => (
                      <label key={role.id} className={`flex items-center gap-2 px-3 py-1.5 border cursor-pointer transition-colors ${editRoleData.functionalRoleIds.includes(role.id) ? 'bg-[#7A4F8C]/10 border-[#7A4F8C]/40 text-[#7A4F8C]' : 'bg-[#FAF7F0] border-[#DDD6C7] hover:bg-[#F3EFE4]'}`}>
                        <input type="checkbox" className="hidden" checked={editRoleData.functionalRoleIds.includes(role.id)} onChange={() => toggleFunctionalRoleArray(editRoleData, setEditRoleData, role.id)} />
                        <span className="text-sm font-medium font-serif">{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-dotted border-[#DDD6C7]">
                <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2 text-sm font-mono uppercase tracking-wide text-[#8A8378] hover:text-[#2B2A28] transition-colors">Cancel</button>
                <button type="submit" disabled={updatingRoles} className="px-5 py-2 text-sm font-mono uppercase tracking-wide text-[#FAF7F0] bg-[#7A4F8C] hover:bg-[#634072] transition-colors flex items-center gap-2">
                  {updatingRoles ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />} Apply Security Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersList;