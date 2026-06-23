import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { Shield, Plus, Edit3, Trash2, AlertCircle, Users } from 'lucide-react';
import { Can } from '../../../components/shared/Can';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await rolesApi.getAllRoles();
      setRoles(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, userCount) => {
    if (userCount > 0) {
      alert(`Cannot delete this role because ${userCount} user(s) are currently assigned to it.`);
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this functional role?')) return;

    try {
      setIsDeleting(id);
      await rolesApi.deleteRole(id);
      setRoles(roles.filter(r => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete role.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-500 font-medium">Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Access Roles
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage functional roles and their granular permissions.</p>
        </div>
        <Can permission="role.create">
          <Link to="/admin/settings/roles/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Role
          </Link>
        </Can>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5" /> <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Grid of Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-wide">{role.name}</h3>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded mt-1 inline-block">
                  {role.slug}
                </span>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Can permission="role.edit">
                  <Link to={`/admin/settings/roles/edit/${role.id}`} className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                </Can>
                <Can permission="role.delete">
                  <button 
                    onClick={() => handleDelete(role.id, role._count?.users)}
                    disabled={isDeleting === role.id}
                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDeleting === role.id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <Trash2 className="w-4 h-4" />}
                  </button>
                </Can>
              </div>
            </div>
            
            <p className="text-sm text-zinc-500 mb-6 h-10 line-clamp-2">
              {role.description || "No description provided for this role."}
            </p>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
                <Users className="w-4 h-4 text-zinc-500" />
                {role._count?.users || 0} Users
              </div>
              <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                Custom Role
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;