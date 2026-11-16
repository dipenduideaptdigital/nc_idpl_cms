import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pagesApi } from '../../../api/pages';
import { Plus, Edit3, Trash2, Calendar, Archive, ExternalLink, Loader2, AlertCircle, Sparkles, ArrowRightLeft } from 'lucide-react';
import Can from '../../../components/shared/Can';

const ACTIVITY_LABELS = {
  'field-trips': 'Field Trips',
  'community-interaction': 'Community Interaction',
  'nature-workshops': 'Nature Workshops',
};

export default function WorkshopList() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterActivity, setFilterActivity] = useState('ALL');
  const [filterPlacement, setFilterPlacement] = useState('ALL');

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getPages({ template: 'workshop-page', limit: 100 });
      setWorkshops(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load workshops.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop page?')) return;
    try {
      await pagesApi.deletePage(id);
      setWorkshops((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete workshop.');
    }
  };

  const handleTogglePlacement = async (workshop) => {
    const currentPlacement = workshop.content?.placement || 'upcoming';
    const nextPlacement = currentPlacement === 'upcoming' ? 'archive' : 'upcoming';

    try {
      const fullPageRes = await pagesApi.getPageById(workshop.id);
      const fullPage = fullPageRes.data;
      const updatedContent = {
        ...fullPage.content,
        activityKey: fullPage.content?.activityKey || 'nature-workshops',
        placement: nextPlacement,
      };

      await pagesApi.updatePage(workshop.id, {
        title: fullPage.title,
        status: fullPage.status,
        template: 'workshop-page',
        content: updatedContent,
      });

      setWorkshops((prev) =>
        prev.map((w) => (w.id === workshop.id ? { ...w, content: updatedContent } : w))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to switch workshop section.');
    }
  };

  const filtered = workshops.filter((w) => {
    const actKey = w.content?.activityKey || 'nature-workshops';
    const place = w.content?.placement || 'upcoming';
    if (filterActivity !== 'ALL' && actKey !== filterActivity) return false;
    if (filterPlacement !== 'ALL' && place !== filterPlacement) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p>Loading Workshops...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center nc-border p-4 rounded-md gap-4">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <Sparkles className="w-5 h-5 text-zinc-500" /> Manage Workshops
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] mt-1">
            Create workshop pages and map them to Prakriti Lab cards (Upcoming or Archive).
          </p>
        </div>

        <Can permission="page.create">
          <Link
            to="/admin/workshops/create"
            className="px-4 h-9 bg-blue-600 text-white rounded-md text-[13px] font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Workshop
          </Link>
        </Can>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-3 rounded-md border border-zinc-200 dark:border-blue-500/20">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium text-zinc-500 mr-2">Activity Page:</span>
          {['ALL', 'field-trips', 'community-interaction', 'nature-workshops'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterActivity(key)}
              className={`px-3 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                filterActivity === key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-blue-500/25 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}
            >
              {key === 'ALL' ? 'All 3 Pages' : ACTIVITY_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-zinc-500 mr-1">Section:</span>
          {['ALL', 'upcoming', 'archive'].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setFilterPlacement(sec)}
              className={`px-3 h-8 rounded-md text-[13px] font-medium capitalize transition-colors cursor-pointer ${
                filterPlacement === sec
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-blue-500/25 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="px-3 py-2.5 text-[13px] bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-blue-500/20 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-blue-500/20">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-4 py-2.5 text-left text-[13px] font-medium text-zinc-500">Workshop Title</th>
              <th className="px-4 py-2.5 text-left text-[13px] font-medium text-zinc-500">Mapped Activity Page</th>
              <th className="px-4 py-2.5 text-left text-[13px] font-medium text-zinc-500">Section (Upcoming / Archive)</th>
              <th className="px-4 py-2.5 text-left text-[13px] font-medium text-zinc-500">Status</th>
              <th className="px-4 py-2.5 text-right text-[13px] font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-blue-500/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-[13px] text-zinc-400">
                  No workshop pages found. Click "Create New Workshop" to build one.
                </td>
              </tr>
            ) : (
              filtered.map((workshop) => {
                const activityKey = workshop.content?.activityKey || 'nature-workshops';
                const placement = workshop.content?.placement || 'upcoming';
                const detailsBlock = workshop.content?.blocks?.find((b) => b.type === 'workshopDetails')?.data || {};

                return (
                  <tr key={workshop.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{workshop.title}</div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{workshop.fullPath}</span>
                        {detailsBlock.date && <span>• {detailsBlock.date}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] text-zinc-700 dark:text-zinc-300">
                        {ACTIVITY_LABELS[activityKey] || activityKey}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {placement === 'upcoming' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                            <Calendar className="w-3.5 h-3.5" /> Upcoming
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                            <Archive className="w-3.5 h-3.5" /> Archive
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleTogglePlacement(workshop)}
                          title={`Move to ${placement === 'upcoming' ? 'Archive' : 'Upcoming'}`}
                          className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          workshop.status === 'PUBLISHED'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {workshop.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={workshop.fullPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Can permission="page.edit">
                          <Link
                            to={`/admin/workshops/edit/${workshop.id}`}
                            className="p-1.5 text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                            title="Edit Workshop"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </Can>
                        <Can permission="page.delete">
                          <button
                            onClick={() => handleDelete(workshop.id)}
                            className="p-1.5 text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                            title="Delete Workshop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}