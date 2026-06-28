import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { ShieldCheck, Plus, Edit3, Trash2, AlertCircle, Users, KeyRound } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-72 gap-3">
        <div className="w-9 h-9 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading roles…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#13151F] p-6 rounded-2xl shadow-lg shadow-indigo-950/10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.6) 23px, rgba(255,255,255,0.6) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(255,255,255,0.6) 23px, rgba(255,255,255,0.6) 24px)'
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            Access control
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Access Roles
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage functional roles and their granular permissions.</p>
        </div>
        <Can permission="role.create">
          <Link
            to="/admin/settings/roles/create"
            className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors shadow-md shadow-indigo-500/30"
          >
            <Plus className="w-4 h-4" /> Create Role
          </Link>
        </Can>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 border border-rose-100">
          <AlertCircle className="w-5 h-5" /> <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Grid of Roles — styled as access badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map(role => (
          <div
            key={role.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative group overflow-hidden"
          >
            {/* accent strip — signature element */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400" />

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">{role.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1.5">
                    <KeyRound className="w-2.5 h-2.5" /> {role.slug}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Can permission="role.edit">
                    <Link to={`/admin/settings/roles/edit/${role.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </Can>
                  <Can permission="role.delete">
                    <button
                      onClick={() => handleDelete(role.id, role._count?.users)}
                      disabled={isDeleting === role.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isDeleting === role.id ? (
                        <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </Can>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">
                {role.description || "No description provided for this role."}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Users className="w-4 h-4 text-slate-400" />
                  {role._count?.users || 0} Users
                </div>
                <div className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">
                  Custom Role
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;