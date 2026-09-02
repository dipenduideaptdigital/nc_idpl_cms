import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { pagesApi } from '../../../api/pages';
import Can from '../../../components/shared/Can';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  ExternalLink,
  AlertCircle,
  Wrench,
  Archive,
  CheckCircle,
  FileEdit,
  Clock
} from 'lucide-react';

const TABS = [
  { id: 'ALL', label: 'All Pages' },
  { id: 'PUBLISHED', label: 'Published', icon: CheckCircle },
  { id: 'DRAFT', label: 'Drafts', icon: FileEdit },
  { id: 'ARCHIVED', label: 'Archived', icon: Archive },
  { id: 'SCHEDULED', label: 'Scheduled', icon: Clock }
];

// --- New Real-Time Countdown Component ---
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft('Processing...');
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      let timeString = '';
      if (d > 0) timeString += `${d}d `;
      if (h > 0 || d > 0) timeString += `${h}h `;
      timeString += `${m}m ${s}s`;

      setTimeLeft(timeString);
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-500/20 w-fit transition-colors">
      <Clock className="w-3 h-3 animate-pulse" />
      <span>Live in: {timeLeft}</span>
    </div>
  );
};

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [isDeleting, setIsDeleting] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const isSitePagesMode = location.pathname.includes('/admin/site-pages');
  const isServicesMode = location.pathname.includes('/admin/services');

  let basePath = '/admin/pages';
  if (isSitePagesMode) basePath = '/admin/site-pages';
  if (isServicesMode) basePath = '/admin/services';

  useEffect(() => {
    fetchPages();
  }, [location.pathname]); 

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

  const relevantPages = pages.filter(page => {
    const currentSlug = (page.slug || '').toLowerCase().trim();
    const fullPath = (page.fullPath || '').toLowerCase().trim();
    
    // Check if the page is a service page
    const isServicePage = currentSlug === 'services' || currentSlug === 'service' || fullPath.startsWith('/services') || page.template === 'service-page';

    if (isServicesMode) {
      return isServicePage;
    } else {
      return !isServicePage;
    }
  });

  // Filter Logic
  const filteredPages = relevantPages.filter(page => {
    const isScheduledTab = activeTab === 'SCHEDULED';
    const matchesTab = activeTab === 'ALL' 
      ? true 
      : (isScheduledTab 
          ? (page.status === 'SCHEDULED' || page.scheduledUpdateAt !== null) 
          : page.status === activeTab);

    const matchesSearch = 
      page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.fullPath?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (page) => {
    let badge = null;
    switch (page.status) {
      case 'PUBLISHED':
        badge = page.scheduledUpdateAt 
          ? <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 transition-colors duration-300">Published (Update Scheduled)</span>
          : <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-300">Published</span>;
        break;
      case 'DRAFT':
        badge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 transition-colors duration-300">Draft</span>;
        break;
      case 'ARCHIVED':
        badge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 transition-colors duration-300">Archived</span>;
        break;
      case 'SCHEDULED':
        badge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 transition-colors duration-300">Scheduled</span>;
        break;
      default:
        badge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">{page.status}</span>;
    }

    return (
      <div className="flex flex-col items-start gap-1">
        {badge}
        {page.scheduledUpdateAt && (
          <CountdownTimer targetDate={page.scheduledUpdateAt} />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 transition-colors duration-300">
            {isServicesMode ? <Wrench className="w-6 h-6 text-zinc-900 dark:text-zinc-100" /> : <FileText className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />}
            {isServicesMode ? 'Service Pages' : 'Pages'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 transition-colors duration-300">
            {isServicesMode 
              ? 'Manage all your service offerings and detailed service pages.'
              : 'Manage all your website pages, landing pages, and content.'}
          </p>
        </div>
        
        <Can permission="page.create">
          <Link 
            to={`${basePath}/create`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Create New Page
          </Link>
        </Can>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <p>{error}</p>
          <button onClick={() => fetchPages()} className="ml-auto text-sm underline font-medium hover:text-red-800 dark:hover:text-red-300 transition-colors">Retry</button>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
        
        {/* TABS NAVIGATION */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-6 gap-6 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto transition-colors duration-300">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white font-bold' 
                  : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors duration-300">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} pages by title or URL...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors sm:text-sm"
            />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-300">
            {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'} found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 transition-colors duration-300">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors duration-300">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors duration-300">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors duration-300">
                  Author
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors duration-300">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors duration-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800 transition-colors duration-300">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">{page.title}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded transition-colors duration-300">
                            {page.fullPath || `/${page.slug}`}
                          </span>
                          
                          {/* Only show External Link if Published */}
                          {page.status === 'PUBLISHED' && (
                            <Can permission="page.preview">
                              <a 
                                href={page.fullPath?.startsWith('/') ? page.fullPath : `/${page.fullPath || page.slug}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="View Public Page"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Can>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(page)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-300 font-medium transition-colors duration-300">{page.author?.name || 'System'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-300 transition-colors duration-300">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                      </div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 transition-colors duration-300">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Can permission="page.edit">
                          <Link 
                            to={`${basePath}/edit/${page.id}`}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Page"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </Can>
                        
                        <Can permission="page.delete">
                          <button 
                            onClick={() => handleDelete(page.id)}
                            disabled={isDeleting === page.id}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Page"
                          >
                            {isDeleting === page.id ? (
                              <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-zinc-200 dark:text-zinc-700 mb-3" />
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                        {activeTab !== 'ALL' ? `No ${activeTab.toLowerCase()} pages found` : 'No pages found'}
                      </p>
                      <p className="text-sm mt-1">Get started by creating a new page.</p>
                      <Link 
                        to={`${basePath}/create`}
                        className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Create your first page &rarr;
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