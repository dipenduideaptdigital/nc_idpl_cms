import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pagesApi } from '../../../api/pages';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await pagesApi.getPages();
      setPages(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      setError('Failed to load pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(id);
      await pagesApi.deletePage(id);
      setPages(pages.filter(page => page.id !== id));
    } catch (err) {
      console.error('Failed to delete page:', err);
      alert('Failed to delete page. It might be in use or you do not have permission.');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredPages = pages.filter(page => 
    page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.fullPath?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Published</span>;
      case 'DRAFT':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">Draft</span>;
      case 'ARCHIVED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">Archived</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-500 font-medium">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-zinc-900" />
            Pages
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your website's pages and content.</p>
        </div>
        <Link 
          to="/admin/pages/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-sm focus:ring-2 focus:ring-zinc-900/20"
        >
          <Plus className="w-4 h-4" />
          Create New Page
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p>{error}</p>
          <button onClick={() => fetchPages()} className="ml-auto text-sm underline font-medium hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search pages by title or URL path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors sm:text-sm"
            />
          </div>
          <div className="text-sm text-zinc-500 font-medium">
            {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900">{page.title}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-1.5 py-0.5 rounded">
                            {page.fullPath || `/${page.slug}`}
                          </span>
                          
                          <a 
                            href={page.fullPath?.startsWith('/') ? page.fullPath : `/${page.fullPath || page.slug}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-700 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(page.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 font-medium">{page.author?.name || 'System'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/pages/edit/${page.id}`}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Page"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(page.id)}
                          disabled={isDeleting === page.id}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Page"
                        >
                          {isDeleting === page.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-zinc-200 mb-3" />
                      <p className="text-lg font-medium text-zinc-900">No pages found</p>
                      <p className="text-sm mt-1">Get started by creating a new page.</p>
                      <Link 
                        to="/admin/pages/create"
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Create your first page & rarr;
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PageList;