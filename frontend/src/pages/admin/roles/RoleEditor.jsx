import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { rolesApi } from '../../../api/roles';
import { Save, ArrowLeft, Shield, Check, Info } from 'lucide-react';

const RoleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [permissionsMap, setPermissionsMap] = useState({}); // Stores grouped permissions from backend
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
      // 1. Fetch the master list of system permissions
      const permsRes = await rolesApi.getSystemPermissions();
      setPermissionsMap(permsRes.data);

      // 2. If editing, fetch the role data
      if (isEditMode) {
        const roleRes = await rolesApi.getRoleById(id);
        setFormData({
          name: roleRes.data.name,
          description: roleRes.data.description || '',
          permissionIds: roleRes.data.permissions || []
        });
      }
    } catch (err) {
      setError('Failed to load data.');
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

  // Bonus UX: Select/Deselect All in a specific module
  const handleToggleModule = (moduleName, modulePermissions) => {
    const modulePermIds = modulePermissions.map(p => p.id);
    const allSelected = modulePermIds.every(id => formData.permissionIds.includes(id));

    setFormData(prev => {
      if (allSelected) {
        // Remove all from this module
        return { ...prev, permissionIds: prev.permissionIds.filter(id => !modulePermIds.includes(id)) };
      } else {
        // Add all from this module (prevent duplicates)
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
    return <div className="h-64 flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/settings/roles" className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{isEditMode ? 'Edit Role' : 'Create Access Role'}</h1>
            <p className="text-zinc-500 text-sm mt-1">Configure functional roles and assign system capabilities.</p>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-sm"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4"/>}
          Save Role
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-medium border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Role Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-3 text-zinc-800">
              <Shield className="w-5 h-5 text-blue-600" /> Basic Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1">Role Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Content Editor"
                  required
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1">Description</label>
                <textarea 
                  rows="4"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What can this role do?"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Roles act as a bundle of permissions. Once created, you can assign this role to any user from the Team & Users tab.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-lg font-bold text-zinc-800">Permission Matrix</h2>
              <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {formData.permissionIds.length} Assigned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(permissionsMap).map(([moduleName, modulePermissions]) => {
                const modulePermIds = modulePermissions.map(p => p.id);
                const isAllSelected = modulePermIds.every(id => formData.permissionIds.includes(id));
                const isSomeSelected = !isAllSelected && modulePermIds.some(id => formData.permissionIds.includes(id));

                return (
                  <div key={moduleName} className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-zinc-100/80 border-b border-zinc-200 flex justify-between items-center">
                      <h3 className="font-bold text-zinc-800 tracking-wide">{moduleName}</h3>
                      <button 
                        type="button" 
                        onClick={() => handleToggleModule(moduleName, modulePermissions)}
                        className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${isAllSelected ? 'bg-blue-600 text-white' : isSomeSelected ? 'bg-blue-200 text-blue-800' : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'}`}
                      >
                        {isAllSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      {modulePermissions.map(perm => {
                        const isSelected = formData.permissionIds.includes(perm.id);
                        return (
                          <label 
                            key={perm.id} 
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-white border-blue-200 shadow-sm' : 'border-transparent hover:bg-zinc-100'}`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-zinc-300'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={isSelected}
                              onChange={() => handleTogglePermission(perm.id)}
                            />
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold ${isSelected ? 'text-zinc-900' : 'text-zinc-600'}`}>
                                {perm.name}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">{perm.slug}</span>
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