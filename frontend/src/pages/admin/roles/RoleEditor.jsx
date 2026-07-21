import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { Save, ArrowLeft, ShieldCheck, Check, Info, KeyRound, Search, ChevronDown,Loader2, X } from 'lucide-react';

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

  // --- UI-only state for the permission matrix (search + accordion) ---
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState({});

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

  // --- UI-only derived helpers (do not touch formData/business logic) ---

  const toggleModuleExpand = (moduleName) => {
    setExpandedModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const expandAllModules = () => {
    const all = {};
    Object.keys(permissionsMap).forEach(m => { all[m] = true; });
    setExpandedModules(all);
  };

  const collapseAllModules = () => setExpandedModules({});

  // Filters permissions for display only; formData/permissionIds are never filtered or mutated.
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return Object.entries(permissionsMap).map(([moduleName, modulePermissions]) => {
      const matches = !q
        ? modulePermissions
        : modulePermissions.filter(
            p => p.name.toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q)
          );
      return { moduleName, modulePermissions, matches };
    });
  }, [permissionsMap, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  if (loading) {
    return (
      <div className="h-72 flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-zinc-500">Loading access configuration…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-16 text-zinc-900 font-sans space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-3">
          <Link to="/admin/settings/roles" className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{isEditMode ? 'Edit Role' : 'Create Access Role'}</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {isEditMode ? 'Modify granular permissions for this role.' : 'Create a new functional role bundle.'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20 flex-shrink-0 text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Role
        </button>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <Info className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Role Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-700" />
                <h2 className="text-sm font-bold text-zinc-900">Basic Details</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Content Editor"
                  required
                  className="block w-full px-4 py-2.5 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors sm:text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What can this role do?"
                  className="block w-full px-4 py-2.5 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors sm:text-sm font-medium resize-none"
                />
              </div>
            </div>

            <div className="border border-blue-100 bg-blue-50/50 p-4 rounded-xl flex gap-3 text-xs text-blue-700 leading-relaxed">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
              <p>Roles act as a bundle of permissions. Once created, assign this role to any user from the Team &amp; Users tab.</p>
            </div>

            {/* Clearance Summary */}
            <div className="border border-zinc-200 rounded-xl p-5 bg-zinc-50/50 flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Total clearance</p>
              <p className="text-4xl font-extrabold text-zinc-950">{formData.permissionIds.length}</p>
              <p className="text-xs text-zinc-500 mt-1 text-center font-medium">permissions granted across all modules</p>
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h2 className="text-sm font-bold text-zinc-900">Permission Matrix</h2>
            <span className="text-xs text-zinc-500 font-semibold">
              {formData.permissionIds.length} assigned
            </span>
          </div>

          {/* Search & Expansion Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search permissions by name or slug…"
                className="block w-full pl-10 pr-10 py-2 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={expandAllModules}
                className="px-3.5 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors bg-white"
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAllModules}
                className="px-3.5 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors bg-white"
              >
                Collapse all
              </button>
            </div>
          </div>

          {/* Module Accordions list */}
          <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-200 overflow-hidden">
            {filteredEntries.map(({ moduleName, modulePermissions, matches }) => {
              const modulePermIds = modulePermissions.map(p => p.id);
              const isAllSelected = modulePermIds.every(id => formData.permissionIds.includes(id));
              const selectedCount = modulePermIds.filter(id => formData.permissionIds.includes(id)).length;
              const isSomeSelected = !isAllSelected && selectedCount > 0;
              const coveragePct = modulePermIds.length ? Math.round((selectedCount / modulePermIds.length) * 100) : 0;

              if (isSearching && matches.length === 0) return null;
              const isOpen = isSearching ? true : !!expandedModules[moduleName];

              return (
                <div key={moduleName} className="bg-white">
                  <button
                    type="button"
                    onClick={() => toggleModuleExpand(moduleName)}
                    className="w-full px-4 py-4 flex items-center justify-between gap-4 hover:bg-zinc-50/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-zinc-900 truncate">{moduleName}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{selectedCount}/{modulePermIds.length} granted</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* coverage bar */}
                      <div className="w-16 h-1.5 bg-zinc-150 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${isAllSelected ? 'bg-zinc-900' : 'bg-zinc-400'}`}
                          style={{ width: `${coveragePct}%` }}
                        />
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); handleToggleModule(moduleName, modulePermissions); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleToggleModule(moduleName, modulePermissions); } }}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border rounded-lg transition-colors cursor-pointer ${
                          isAllSelected
                            ? 'border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-300'
                            : isSomeSelected
                            ? 'border-purple-200 bg-purple-50/50 text-purple-600'
                            : 'border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-950 bg-white'
                        }`}
                      >
                        {isAllSelected ? 'Deselect all' : 'Select all'}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1 border-t border-zinc-100 bg-zinc-50/20">
                      {(isSearching ? matches : modulePermissions).map(perm => {
                        const isSelected = formData.permissionIds.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors border border-transparent rounded-xl ${
                              isSelected ? 'bg-white border-zinc-200/60 shadow-sm' : 'hover:bg-zinc-50/80'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 flex items-center justify-center border transition-colors flex-shrink-0 rounded ${
                                isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-zinc-300'
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
                              <span className={`text-sm font-semibold truncate ${isSelected ? 'text-zinc-900' : 'text-zinc-600'}`}>
                                {perm.name}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400 truncate">{perm.slug}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {isSearching && filteredEntries.every(({ matches }) => matches.length === 0) && (
              <div className="px-4 py-8 text-center italic text-zinc-500 text-sm">
                No permissions match "{searchQuery}".
              </div>
            )}
          </div>
        </div>

      </div>
    </form>
  );
};

export default RoleEditor;