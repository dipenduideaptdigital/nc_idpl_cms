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
      <div className="h-72 flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#DDD6C7] border-t-[#3F5C73] rounded-full animate-spin"></div>
        <p className="text-sm font-mono uppercase tracking-wider text-[#8A8378]">Loading roles…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-[#2B2A28]">

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-double border-[#2B2A28] pb-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#3F5C73] font-bold mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3 h-3" />
            Access control
          </p>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-2.5 text-[#2B2A28]">
            <ShieldCheck className="w-6 h-6 text-[#3F5C73]" />
            Access Roles
          </h1>
          <p className="text-sm text-[#8A8378] mt-1 font-serif italic">
            Manage functional roles and their granular permissions.
          </p>
        </div>

        <Can permission="role.create">
          <Link
            to="/admin/settings/roles/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2B2A28] text-[#FAF7F0] font-mono text-sm uppercase tracking-wide hover:bg-[#3F5C73] transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Role
          </Link>
        </Can>
      </div>

      {error && (
        <div className="border border-[#B5563A]/30 bg-[#B5563A]/5 text-[#8a3a26] px-4 py-3 mb-6 flex items-center gap-2 font-mono text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Roles Grid */}
      {roles.length === 0 ? (
        <div className="border border-dashed border-[#DDD6C7] py-16 text-center">
          <ShieldCheck className="w-8 h-8 text-[#DDD6C7] mx-auto mb-3" />
          <p className="font-serif text-lg text-[#2B2A28] mb-1">No roles yet</p>
          <p className="text-sm text-[#8A8378] italic font-serif">Create your first role to start managing access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map(role => (
            <div
              key={role.id}
              className="bg-[#FAF7F0] border border-[#DDD6C7] relative group overflow-hidden hover:shadow-[2px_3px_0_0_#DDD6C7] transition-shadow"
            >
              {/* Accent strip — matches the editorial signature */}
              <div className="h-[3px] w-full bg-[#3F5C73]" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-[15px] text-[#2B2A28] truncate">{role.name}</h3>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#3F5C73] border border-[#3F5C73]/30 bg-[#3F5C73]/5 px-2 py-0.5 mt-1.5">
                      <KeyRound className="w-2.5 h-2.5" /> {role.slug}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Can permission="role.edit">
                      <Link
                        to={`/admin/settings/roles/edit/${role.id}`}
                        className="p-1.5 text-[#8A8378] hover:text-[#3F5C73] hover:bg-[#3F5C73]/10 transition-colors"
                        title="Edit role"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </Can>
                    <Can permission="role.delete">
                      <button
                        onClick={() => handleDelete(role.id, role._count?.users)}
                        disabled={isDeleting === role.id}
                        className="p-1.5 text-[#8A8378] hover:text-[#B5563A] hover:bg-[#B5563A]/10 transition-colors disabled:opacity-50"
                        title="Delete role"
                      >
                        {isDeleting === role.id ? (
                          <div className="w-4 h-4 border-2 border-[#B5563A] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </Can>
                  </div>
                </div>

                <p className="text-sm font-serif italic text-[#8A8378] mb-5 h-10 line-clamp-2">
                  {role.description || 'No description provided for this role.'}
                </p>

                <div className="flex items-center justify-between border-t border-dotted border-[#DDD6C7] pt-3.5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#5b5852] border border-[#DDD6C7] px-2.5 py-1 bg-[#F3EFE4]/60">
                    <Users className="w-3.5 h-3.5 text-[#8A8378]" />
                    {role._count?.users || 0} Users
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8A8378]">
                    Custom Role
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default RolesList;