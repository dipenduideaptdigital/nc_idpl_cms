import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { Save, ArrowLeft, ShieldCheck, Check, Info, KeyRound, Search, ChevronDown, X } from 'lucide-react';

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
        <div className="w-8 h-8 border-2 border-[#DDD6C7] border-t-[#3F5C73] rounded-full animate-spin"></div>
        <p className="text-sm font-mono uppercase tracking-wider text-[#8A8378]">Loading access configuration…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-16 text-[#2B2A28]">

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-double border-[#2B2A28] pb-4 mb-8">
        <div className="flex items-start gap-3">
          <Link to="/admin/settings/roles" className="p-2 -ml-2 mt-0.5 text-[#8A8378] hover:text-[#2B2A28] transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#3F5C73] font-bold mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3 h-3" />
              {isEditMode ? 'Editing role' : 'New access role'}
            </p>
            <h1 className="text-3xl font-serif font-bold text-[#2B2A28]">{isEditMode ? 'Edit Role' : 'Create Access Role'}</h1>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2B2A28] text-[#FAF7F0] font-mono text-sm uppercase tracking-wide hover:bg-[#3F5C73] transition-colors disabled:opacity-60 flex-shrink-0"
        >
          {saving ? <div className="w-4 h-4 border-2 border-[#FAF7F0] border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
          Save Role
        </button>
      </div>

      {error && (
        <div className="border border-[#B5563A]/30 bg-[#B5563A]/5 text-[#8a3a26] px-4 py-3 mb-6 flex items-center gap-2 font-mono text-sm">
          <Info className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Role Details */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#2B2A28] pb-2 mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3F5C73]" />
                <h2 className="font-serif text-lg font-bold tracking-tight">Basic Details</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">Role Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Content Editor"
                  required
                  className="w-full px-4 py-2.5 border border-[#DDD6C7] bg-transparent font-serif outline-none focus:border-[#3F5C73] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-[#8A8378] mb-1.5">Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What can this role do?"
                  className="w-full px-4 py-2.5 border border-[#DDD6C7] bg-transparent font-serif outline-none focus:border-[#3F5C73] resize-none transition-colors"
                />
              </div>
            </div>

            <div className="mt-5 border border-dashed border-[#3F5C73]/40 bg-[#3F5C73]/5 p-4 flex gap-3 text-sm text-[#2B2A28] font-serif">
              <Info className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-[#3F5C73]" />
              <p>Roles act as a bundle of permissions. Once created, assign this role to any user from the Team &amp; Users tab.</p>
            </div>
          </div>

          {/* Live coverage summary — signature element */}
          <div className="border-2 border-[#2B2A28] p-5">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8A8378] mb-1">Total clearance</p>
            <p className="text-4xl font-serif font-bold tabular-nums text-[#2B2A28]">{formData.permissionIds.length}</p>
            <p className="text-sm text-[#8A8378] mt-1 font-serif italic">permissions granted across all modules</p>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between border-b-2 border-[#2B2A28] pb-2 mb-4">
            <h2 className="font-serif text-lg font-bold tracking-tight">Permission Matrix</h2>
            <span className="font-mono text-[11px] text-[#8A8378] tabular-nums">
              {formData.permissionIds.length} assigned
            </span>
          </div>

          {/* Search + bulk expand controls — solves the "20 permissions = endless scroll" problem */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 border border-[#DDD6C7] focus-within:border-[#3F5C73] transition-colors">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8378] w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search permissions by name or slug…"
                className="w-full pl-10 pr-9 py-2.5 outline-none text-sm font-serif bg-transparent placeholder:text-[#8A8378]/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8378] hover:text-[#2B2A28]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={expandAllModules}
                className="px-3 py-2 border border-[#DDD6C7] font-mono text-[11px] uppercase tracking-wide text-[#8A8378] hover:border-[#2B2A28] hover:text-[#2B2A28] transition-colors"
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAllModules}
                className="px-3 py-2 border border-[#DDD6C7] font-mono text-[11px] uppercase tracking-wide text-[#8A8378] hover:border-[#2B2A28] hover:text-[#2B2A28] transition-colors"
              >
                Collapse all
              </button>
            </div>
          </div>

          {/* Accordion list of modules — collapsed by default, so 20+ permissions per module never force a long scroll */}
          <div className="border border-[#DDD6C7] divide-y divide-[#DDD6C7]">
            {filteredEntries.map(({ moduleName, modulePermissions, matches }) => {
              const modulePermIds = modulePermissions.map(p => p.id);
              const isAllSelected = modulePermIds.every(id => formData.permissionIds.includes(id));
              const selectedCount = modulePermIds.filter(id => formData.permissionIds.includes(id)).length;
              const isSomeSelected = !isAllSelected && selectedCount > 0;
              const coveragePct = modulePermIds.length ? Math.round((selectedCount / modulePermIds.length) * 100) : 0;

              // While searching, a module with no matching permissions is hidden entirely;
              // a module with matches auto-expands so results are visible without manual clicking.
              if (isSearching && matches.length === 0) return null;
              const isOpen = isSearching ? true : !!expandedModules[moduleName];

              return (
                <div key={moduleName} className="bg-[#FAF7F0]">
                  <button
                    type="button"
                    onClick={() => toggleModuleExpand(moduleName)}
                    className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#F3EFE4]/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ChevronDown className={`w-4 h-4 text-[#8A8378] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      <div className="min-w-0">
                        <h3 className="font-serif font-bold text-[15px] text-[#2B2A28] truncate">{moduleName}</h3>
                        <p className="text-[11px] font-mono text-[#8A8378]">{selectedCount}/{modulePermIds.length} granted</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* coverage bar */}
                      <div className="w-16 h-1 bg-[#DDD6C7] hidden sm:block">
                        <div
                          className={`h-full ${isAllSelected ? 'bg-[#3F5C73]' : 'bg-[#3F5C73]/40'}`}
                          style={{ width: `${coveragePct}%` }}
                        />
                      </div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); handleToggleModule(moduleName, modulePermissions); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleToggleModule(moduleName, modulePermissions); } }}
                        className={`text-[11px] font-mono uppercase tracking-wide px-2.5 py-1 border transition-colors cursor-pointer ${
                          isAllSelected
                            ? 'border-[#3F5C73] bg-[#3F5C73]/10 text-[#3F5C73]'
                            : isSomeSelected
                            ? 'border-[#3F5C73]/40 text-[#3F5C73]'
                            : 'border-[#DDD6C7] text-[#8A8378] hover:border-[#2B2A28] hover:text-[#2B2A28]'
                        }`}
                      >
                        {isAllSelected ? 'Deselect all' : 'Select all'}
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {(isSearching ? matches : modulePermissions).map(perm => {
                        const isSelected = formData.permissionIds.includes(perm.id);
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors border border-transparent ${
                              isSelected ? 'bg-white border-[#3F5C73]/30' : 'hover:bg-[#F3EFE4]/60'
                            }`}
                          >
                            <div
                              className={`w-[16px] h-[16px] flex items-center justify-center border transition-colors flex-shrink-0 ${
                                isSelected ? 'bg-[#3F5C73] border-[#3F5C73] text-[#FAF7F0]' : 'bg-white border-[#DDD6C7]'
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
                              <span className={`text-sm font-serif font-semibold truncate ${isSelected ? 'text-[#2B2A28]' : 'text-[#5b5852]'}`}>
                                {perm.name}
                              </span>
                              <span className="text-[10px] font-mono text-[#8A8378] truncate">{perm.slug}</span>
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
              <div className="px-4 py-8 text-center font-serif italic text-[#8A8378]">
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