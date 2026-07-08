import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../../api/projects';
import { Plus, Edit3, Trash2, Briefcase, AlertCircle } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAdminProjects();
      setProjects(data.data || []);
    } catch (err) {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsApi.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete project.');
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6" /> Manage Projects
          </h1>
          <p className="text-zinc-500 text-sm">Add, update, or remove portfolio projects.</p>
        </div>
        <Link to="/admin/projects/create" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase">Project Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-50">
                <td className="px-6 py-4 font-medium">{project.title}</td>
                <td className="px-6 py-4">{project.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link to={`/admin/projects/edit/${project.id}`} className="text-blue-500 hover:text-blue-700"><Edit3 className="w-4 h-4 inline" /></Link>
                  <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;