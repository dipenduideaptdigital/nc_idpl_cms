import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { Save, ArrowLeft, ShieldCheck, Check, Info, KeyRound } from 'lucide-react';

const RoleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [permissionsMap, setPermissionsMap] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: []
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const permsRes = await rolesApi.getSystemPermissions();

      setPermissionsMap(permsRes.data || {});

      if (isEditMode) {
        const roleRes = await rolesApi.getRoleById(id);
        setFormData({
          name: roleRes.data.name,
          description: roleRes.data.description || '',
          permissionIds: roleRes.data.permissions?.map(p => typeof p === 'string' ? p : p.id) || []
        });
      }
    } catch (err) {
      console.error("Exact API Error:", err.response?.data || err.message);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (permId) => {
    setFormData(prev => {
      const isSelected = prev.permissionIds.includes(permId);
      return {
        ...prev,
        permissionIds: isSelected
          ? prev.permissionIds.filter(id => id !== permId)
          : [...prev.permissionIds, permId]
      };
    });
  };

  const handleToggleModule = (moduleName, modulePermissions) => {
    const modulePermIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermIds.every(id => formData.permissionIds.includes(id));

    setFormData(prev => {
      if (allSelected) {
        return { ...prev, permissionIds: prev.permissionIds.filter(id => !modulePermIds.includes(id)) };
      } else {
        const combined = new Set([...prev.permissionIds, ...modulePermIds]);
        return { ...prev, permissionIds: Array.from(combined) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Role name is required");

    try {
      setSaving(true);
      if (isEditMode) {
        await rolesApi.updateRole(id, formData);
      } else {
        await rolesApi.createRole(formData);
      }
      navigate('/admin/settings/roles');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-72 flex flex-col justify-center items-center gap-3">
        <div className="w-9 h-9 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading access configuration…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12 font-sans text-slate-800">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#13151F] p-6 rounded-2xl shadow-lg shadow-indigo-950/10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.6) 23px, rgba(255,255,255,0.6) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(255,255,255,0.6) 23px, rgba(255,255,255,0.6) 24px)'
          }}
        />
        <div className="flex items-center gap-4 relative z-10">
          <Link to="/admin/settings/roles" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-1">
              <KeyRound className="w-3.5 h-3.5" />
              {isEditMode ? 'Editing role' : 'New access role'}
            </div>
            <h1 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Role' : 'Create Access Role'}</h1>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors disabled:opacity-60 shadow-md shadow-indigo-500/30"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
          Save Role
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl font-medium border border-rose-200 flex items-center gap-2">
          <Info className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Role Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Basic Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Content Editor"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What can this role do?"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white resize-none transition-colors"
                />
              </div>
            </div>
            <div className="mt-6 bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl flex gap-3 text-sm text-indigo-800">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-indigo-500" />
              <p>Roles act as a bundle of permissions. Once created, assign this role to any user from the Team &amp; Users tab.</p>
            </div>
          </div>

          {/* Live coverage summary — signature element */}
          <div className="bg-[#13151F] text-white p-6 rounded-2xl shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-1">Total clearance</p>
            <p className="text-4xl font-bold tabular-nums">{formData.permissionIds.length}</p>
            <p className="text-sm text-slate-400 mt-1">permissions granted across all modules</p>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Permission Matrix</h2>
              <span className="text-xs font-bold bg-indigo-500 text-white px-3 py-1 rounded-full tabular-nums">
                {formData.permissionIds.length} Assigned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(permissionsMap).map(([moduleName, modulePermissions]) => {
                const modulePermIds = modulePermissions.map(p => p.id);
                const isAllSelected = modulePermIds.every(id => formData.permissionIds.includes(id));
                const selectedCount = modulePermIds.filter(id => formData.permissionIds.includes(id)).length;
                const isSomeSelected = !isAllSelected && selectedCount > 0;
                const coveragePct = modulePermIds.length ? Math.round((selectedCount / modulePermIds.length) * 100) : 0;

                return (
                  <div
                    key={moduleName}
                    className={`relative rounded-xl overflow-hidden border transition-colors ${
                      isAllSelected ? 'border-indigo-300 bg-indigo-50/40' : isSomeSelected ? 'border-indigo-100 bg-white' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* coverage bar */}
                    <div className="h-1 w-full bg-slate-100">
                      <div
                        className={`h-full transition-all ${isAllSelected ? 'bg-indigo-500' : 'bg-indigo-300'}`}
                        style={{ width: `${coveragePct}%` }}
                      />
                    </div>

                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{moduleName}</h3>
                        <p className="text-[11px] font-mono text-slate-400">{selectedCount}/{modulePermIds.length} granted</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleModule(moduleName, modulePermissions)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                          isAllSelected
                            ? 'bg-indigo-500 text-white'
                            : isSomeSelected
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {isAllSelected ? 'Deselect all' : 'Select all'}
                      </button>
                    </div>

                    <div className="p-2 space-y-1">
                      {modulePermissions.map(perm => {
                        const isSelected = formData.permissionIds.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-white ring-1 ring-indigo-200 shadow-sm' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-[18px] h-[18px] rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                                isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => handleTogglePermission(perm.id)}
                            />
                            <div className="flex flex-col min-w-0">
                              <span className={`text-sm font-semibold truncate ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                {perm.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 truncate">{perm.slug}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </form>
  );
};

export default RoleEditor;