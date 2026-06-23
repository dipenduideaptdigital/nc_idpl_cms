import React, { useState, useEffect } from 'react';
import { usersApi } from '../../../api/users';
import { rolesApi } from '../../../api/roles';
import { 
  Users, Search, Shield, UserPlus, CheckCircle, PowerOff, 
  Trash2, Mail, Edit3, X, Loader2, AlertTriangle
} from 'lucide-react';
import { Can } from '../../../components/shared/Can';
import { useAuth } from '../../../context/AuthContext';

const UsersList = () => {
  const { user: currentUser } = useAuth();
  
  // Data States
  const [users, setUsers] = useState([]);
  const [functionalRoles, setFunctionalRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // For Role Modification

  // Invite Form State
  const [inviteData, setInviteData] = useState({
    name: '', email: '', systemRoleSlug: 'ADMIN', functionalRoleIds: []
  });
  const [inviting, setInviting] = useState(false);

  // Edit Role Form State
  const [editRoleData, setEditRoleData] = useState({
    systemRoleSlug: '', functionalRoleIds: []
  });
  const [updatingRoles, setUpdatingRoles] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRolesForDropdown();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAllUsers({ page: currentPage, limit: 10, search: searchTerm });
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

  // --- Handlers ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const isActivating = currentStatus !== 'ACTIVE';
    const action = isActivating ? 'activate' : 'suspend';
    
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

    try {
      await usersApi.updateUserStatus(userId, isActivating ? 'ACTIVE' : 'SUSPENDED');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email) return;

    try {
      setInviting(true);
      await usersApi.inviteAdmin(inviteData);
      setIsInviteModalOpen(false);
      setInviteData({ name: '', email: '', systemRoleSlug: 'ADMIN', functionalRoleIds: [] });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setInviting(false);
    }
  };

  const openEditRolesModal = async (u) => {
    setEditingUser(u);
    try {
      // Fetch currently assigned functional roles for this user
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
      
      // Update System Role first
      if (editRoleData.systemRoleSlug !== editingUser.systemRole.slug) {
        await usersApi.updateSystemRole(editingUser.id, editRoleData.systemRoleSlug);
      }

      // Update Functional Roles
      await usersApi.assignFunctionalRoles(editingUser.id, editRoleData.functionalRoleIds);
      
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update roles.');
    } finally {
      setUpdatingRoles(false);
    }
  };

  // --- UI Helpers ---
  const toggleFunctionalRoleArray = (stateObj, setter, roleId) => {
    const arr = stateObj.functionalRoleIds;
    setter(prev => ({
      ...prev,
      functionalRoleIds: arr.includes(roleId) ? arr.filter(id => id !== roleId) : [...arr, roleId]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Team & Users
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage staff accounts, invites, and system access.</p>
        </div>
        
        <Can permission="user.create">
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Invite Staff
          </button>
        </Can>
      </div>

      {/* Main Table Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider">Roles</th>
                <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400"/></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10 text-zinc-500">No users found.</td></tr>
              ) : (
                users.map(u => {
                  const isSelf = u.id === currentUser.id;
                  const isSuperAdmin = u.systemRole.slug === 'SUPER_ADMIN';
                  const isSuspended = u.status === 'SUSPENDED';

                  return (
                    <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isSuspended ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 flex items-center gap-2">
                              {u.name}
                              {isSelf && <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">You</span>}
                            </div>
                            <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3"/> {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${isSuperAdmin ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}`}>
                            {u.systemRole.name.toUpperCase()}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {u.functionalRoles?.map(fr => (
                              <span key={fr.functionalRole.slug} className="text-[10px] font-mono bg-white border border-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded">
                                {fr.functionalRole.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {u.status === 'ACTIVE' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3.5 h-3.5"/> Active</span>}
                        {u.status === 'PENDING' && <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full w-max">Pending Setup</span>}
                        {u.status === 'SUSPENDED' && <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full flex items-center gap-1 w-max"><PowerOff className="w-3.5 h-3.5"/> Suspended</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* Protect Edit Action */}
                          {!isSelf && (!isSuperAdmin || currentUser.systemRole === 'SUPER_ADMIN') && (
                            <Can permission="user.edit">
                              <button onClick={() => openEditRolesModal(u)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Manage Access">
                                <Shield className="w-4 h-4"/>
                              </button>
                            </Can>
                          )}

                          {/* Protect Status Toggle */}
                          {!isSelf && (!isSuperAdmin || currentUser.systemRole === 'SUPER_ADMIN') && (
                            <Can permission="user.suspend">
                              <button onClick={() => handleToggleStatus(u.id, u.status)} className={`p-2 rounded-lg transition-colors ${u.status === 'ACTIVE' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`} title={u.status === 'ACTIVE' ? "Suspend User" : "Activate User"}>
                                {u.status === 'ACTIVE' ? <PowerOff className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
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
        
        {/* Quick Pagination */}
        {meta?.totalPages > 1 && (
          <div className="p-4 border-t border-zinc-100 flex justify-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border rounded hover:bg-zinc-50 disabled:opacity-50">Prev</button>
            <span className="px-4 py-1 text-sm font-medium">{currentPage} / {meta.totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(meta.totalPages, p+1))} disabled={currentPage === meta.totalPages} className="px-3 py-1 text-sm border rounded hover:bg-zinc-50 disabled:opacity-50">Next</button>
          </div>
        )}
      </div>

      {/* --- INVITE MODAL --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-600"/> Invite Staff</h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-zinc-800"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleInviteSubmit} className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-2 text-blue-800 text-sm">
                <Mail className="w-5 h-5 shrink-0"/> An email with a secure setup link will be sent.
              </div>

              <div><label className="block text-sm font-bold mb-1">Full Name</label><input required type="text" value={inviteData.name} onChange={e => setInviteData(p => ({...p, name: e.target.value}))} className="w-full border px-4 py-2.5 rounded-xl"/></div>
              <div><label className="block text-sm font-bold mb-1">Corporate Email</label><input required type="email" value={inviteData.email} onChange={e => setInviteData(p => ({...p, email: e.target.value}))} className="w-full border px-4 py-2.5 rounded-xl"/></div>
              
              <div>
                <label className="block text-sm font-bold mb-1">System Role</label>
                <select value={inviteData.systemRoleSlug} onChange={e => setInviteData(p => ({...p, systemRoleSlug: e.target.value}))} className="w-full border px-4 py-2.5 rounded-xl bg-zinc-50 font-medium">
                  <option value="ADMIN">ADMIN (Standard)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                </select>
              </div>

              {inviteData.systemRoleSlug !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-sm font-bold mb-2">Functional Roles (Access Bundles)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 border rounded-xl max-h-40 overflow-y-auto">
                    {functionalRoles.map(role => (
                      <label key={role.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${inviteData.functionalRoleIds.includes(role.id) ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-zinc-200 hover:bg-zinc-100'}`}>
                        <input type="checkbox" className="hidden" checked={inviteData.functionalRoleIds.includes(role.id)} onChange={() => toggleFunctionalRoleArray(inviteData, setInviteData, role.id)} />
                        <span className="text-sm font-medium">{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="px-5 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={inviting} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2">
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Mail className="w-4 h-4"/>} Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT ROLES MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600"/> Manage Access</h2>
                <p className="text-sm text-zinc-500 mt-1">Modifying roles for <strong>{editingUser.name}</strong></p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-zinc-400 hover:text-zinc-800"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleUpdateUserRoles} className="p-6 space-y-5">
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-2 text-amber-800 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0"/> The user's active sessions will be terminated automatically to apply these changes securely.
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">System Role</label>
                <select value={editRoleData.systemRoleSlug} onChange={e => setEditRoleData(p => ({...p, systemRoleSlug: e.target.value}))} className="w-full border px-4 py-2.5 rounded-xl bg-zinc-50 font-medium">
                  <option value="ADMIN">ADMIN (Standard)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                </select>
              </div>

              {editRoleData.systemRoleSlug !== 'SUPER_ADMIN' && (
                <div>
                  <label className="block text-sm font-bold mb-2">Functional Roles (Access Bundles)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 border rounded-xl max-h-48 overflow-y-auto">
                    {functionalRoles.map(role => (
                      <label key={role.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${editRoleData.functionalRoleIds.includes(role.id) ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-zinc-200 hover:bg-zinc-100'}`}>
                        <input type="checkbox" className="hidden" checked={editRoleData.functionalRoleIds.includes(role.id)} onChange={() => toggleFunctionalRoleArray(editRoleData, setEditRoleData, role.id)} />
                        <span className="text-sm font-medium">{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={updatingRoles} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2">
                  {updatingRoles ? <Loader2 className="w-4 h-4 animate-spin"/> : <Shield className="w-4 h-4"/>} Apply Security Changes
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