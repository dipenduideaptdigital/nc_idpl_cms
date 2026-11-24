import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, HelpCircle, ArrowUp, ArrowDown, X } from 'lucide-react';
import DOMPurify from 'dompurify';
import { faqsApi } from '../../../api/faqs';
import { usePermission } from '../../../hooks/usePermission';
import TipTapEditor from '../../../components/admin/TipTapEditor';

const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
const field = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950';
const primary = 'rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50';
const secondary = 'rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 disabled:opacity-50';
const iconButton = 'rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30';
const errorMessage = (error) => error.response?.data?.message || error.message || 'Operation failed.';
const blankCategory = () => ({ name: '', description: '', sortOrder: 0, status: 'PUBLISHED' });
const blankQuestion = (categoryId = '') => ({ categoryId, question: '', answer: '', sortOrder: 0, status: 'PUBLISHED' });

function FaqManagement({ canCreate, canEdit, canDelete }) {
  const [tab, setTab] = useState('question');
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [cats, qs] = await Promise.all([faqsApi.getAdminCategories(), faqsApi.getAdminQuestions()]);
      setCategories(cats.data || []);
      setQuestions(qs.data || []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!modal || busy) return;
    const close = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [modal, busy]);

  const change = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const open = (type, item = null) => {
    setFormError('');
    setError('');
    setSuccess('');
    setModal({ type, id: item?.id || null });
    if (type === 'category') {
      setForm(item ? { name: item.name, description: item.description || '', sortOrder: item.sortOrder, status: item.status } : blankCategory());
    } else {
      setForm(item ? { categoryId: item.categoryId, question: item.question, answer: typeof item.answer === 'string' ? DOMPurify.sanitize(item.answer) : '', sortOrder: item.sortOrder, status: item.status } : blankQuestion(categoryFilter || categories[0]?.id || ''));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (busy || !modal || (modal.id ? !canEdit : !canCreate)) return;
    setFormError('');
    const payload = { ...form, sortOrder: Number(form.sortOrder) };
    if (!statuses.includes(payload.status)) return setFormError('Please select a supported status.');
    if (modal.type === 'question') {
      payload.answer = DOMPurify.sanitize(payload.answer || '');
      const plain = new DOMParser().parseFromString(payload.answer, 'text/html').body.textContent.trim();
      if (!plain) return setFormError('Please enter an answer.');
    }
    setBusy(true);
    try {
      if (modal.type === 'category') {
        if (modal.id) await faqsApi.updateCategory(modal.id, payload);
        else await faqsApi.createCategory(payload);
      } else {
        if (modal.id) await faqsApi.updateQuestion(modal.id, payload);
        else await faqsApi.createQuestion(payload);
      }
      setModal(null);
      setSuccess('FAQ saved successfully.');
      await load();
    } catch (err) { setFormError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  const remove = async (type, item) => {
    if (!canDelete || busy) return;
    if (!window.confirm(type === 'category' ? `Delete "${item.name}" and ALL its questions? This cannot be undone.` : 'Delete this question? This cannot be undone.')) return;
    setBusy(true); setError(''); setSuccess('');
    try {
      if (type === 'category') {
        await faqsApi.deleteCategory(item.id);
        if (categoryFilter === item.id) setCategoryFilter('');
      } else await faqsApi.deleteQuestion(item.id);
      setSuccess('FAQ deleted successfully.');
      await load();
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  // Reorder against the full sibling list, not the filtered table.
  const siblings = (type, item) => type === 'category' ? categories : questions.filter(q => q.categoryId === item.categoryId);
  const move = async (type, item, direction) => {
    if (!canEdit || busy) return;
    const ordered = [...siblings(type, item)];
    const index = ordered.findIndex(row => row.id === item.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return;
    if (ordered.length > 500) return setError('Bulk reorder supports up to 500 items. Edit sort order manually.');
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    setBusy(true); setError(''); setSuccess('');
    try {
      await faqsApi.reorder(type, ordered.map((row, sortOrder) => ({ id: row.id, sortOrder })));
      setSuccess('Order updated successfully.');
      await load();
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  const rows = tab === 'category' ? categories : questions.filter(q =>
    (!categoryFilter || q.categoryId === categoryFilter) &&
    (!statusFilter || q.status === statusFilter) &&
    q.question.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 text-zinc-900 dark:text-zinc-100">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div><h1 className="flex items-center gap-2 text-2xl font-bold"><HelpCircle className="h-6 w-6 dark:text-emerald-400" /> FAQ Management</h1><p className="mt-1 text-sm text-zinc-500">Manage categories and questions for the public FAQ page.</p></div>
        {canCreate && <button type="button" className={`${primary} flex items-center gap-2`} disabled={busy || loading || (tab === 'question' && !categories.length)} onClick={() => open(tab)}><Plus size={16} /> Add {tab === 'category' ? 'Category' : 'Question'}</button>}
      </header>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950/40 dark:text-red-400">{error} <button type="button" disabled={busy} onClick={load} className="ml-2 underline">Retry</button></p>}
      {success && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">{success}</p>}
      <div className="flex flex-wrap gap-2" aria-label="FAQ sections">
        {['question', 'category'].map(type => <button key={type} type="button" disabled={busy} aria-pressed={tab === type} onClick={() => setTab(type)} className={`${secondary} ${tab === type ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : ''}`}>{type === 'question' ? `Questions (${questions.length})` : `Categories (${categories.length})`}</button>)}
      </div>
      {tab === 'question' && <div className="grid gap-3 sm:grid-cols-3">
        <input aria-label="Search questions" className={field} placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
        <select aria-label="Filter category" className={field} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select aria-label="Filter status" className={field} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="">All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select>
      </div>}
      {!loading && !categories.length && tab === 'question' && <p className="text-sm text-zinc-500">Create a category before adding questions.</p>}
      {loading ? <p role="status" className="p-10 text-center text-zinc-500">Loading FAQs...</p> : <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-800/50"><tr><th className="p-4">{tab === 'category' ? 'Category' : 'Question'}</th><th className="p-4">{tab === 'category' ? 'Questions' : 'Category'}</th><th className="p-4">Status</th><th className="p-4">Order</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map(item => { const group = siblings(tab, item); const index = group.findIndex(x => x.id === item.id); return <tr key={item.id}>
              <td className="p-4 font-medium">{tab === 'category' ? <>{item.name}<div className="text-xs font-normal text-zinc-500">{item.slug}</div></> : item.question}</td>
              <td className="p-4">{tab === 'category' ? item._count?.questions || 0 : item.category?.name || categories.find(c => c.id === item.categoryId)?.name || '—'}</td>
              <td className="p-4"><span className={`rounded-full px-2 py-1 text-xs font-medium ${item.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>{item.status}</span></td>
              <td className="p-4">{item.sortOrder}</td>
              <td className="p-4"><div className="flex justify-end gap-1 whitespace-nowrap">
                {canEdit && <><button type="button" className={iconButton} title="Move up" aria-label="Move up" disabled={busy || index <= 0} onClick={() => move(tab, item, -1)}><ArrowUp size={16} /></button><button type="button" className={iconButton} title="Move down" aria-label="Move down" disabled={busy || index >= group.length - 1} onClick={() => move(tab, item, 1)}><ArrowDown size={16} /></button><button type="button" className={`${iconButton} text-blue-600`} title="Edit" aria-label="Edit" disabled={busy} onClick={() => open(tab, item)}><Edit3 size={16} /></button></>}
                {canDelete && <button type="button" className={`${iconButton} text-red-600`} title="Delete" aria-label="Delete" disabled={busy} onClick={() => remove(tab, item)}><Trash2 size={16} /></button>}
              </div></td>
            </tr>; })}
            {!rows.length && <tr><td colSpan={5} className="p-10 text-center text-zinc-500">No {tab === 'category' ? 'categories' : 'questions'} found.</td></tr>}
          </tbody>
        </table>
      </div>}
      {modal && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="presentation">
        <form role="dialog" aria-modal="true" aria-labelledby="faq-modal-title" onSubmit={save} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
          <div className="flex items-center justify-between"><h2 id="faq-modal-title" className="text-xl font-bold">{modal.id ? 'Edit' : 'Add'} {modal.type === 'category' ? 'Category' : 'Question'}</h2><button type="button" aria-label="Close" disabled={busy} onClick={() => setModal(null)}><X size={20} /></button></div>
          {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
          {modal.type === 'category' ? <>
            <label className="block space-y-1 text-sm">Category name<input autoFocus required minLength={2} maxLength={100} className={field} value={form.name} onChange={e => change('name', e.target.value)} /></label>
            <label className="block space-y-1 text-sm">Description<textarea maxLength={300} rows={3} className={field} value={form.description} onChange={e => change('description', e.target.value)} /></label>
          </> : <>
            <label className="block space-y-1 text-sm">Category<select autoFocus required className={field} value={form.categoryId} onChange={e => change('categoryId', e.target.value)}><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="block space-y-1 text-sm">Question<input required minLength={5} maxLength={300} className={field} value={form.question} onChange={e => change('question', e.target.value)} /></label>
            <div className="space-y-1 text-sm"><p>Answer</p><TipTapEditor value={form.answer} onChange={value => change('answer', value)} /></div>
          </>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm">Sort order<input required type="number" min={0} max={2147483647} step={1} className={field} value={form.sortOrder} onChange={e => change('sortOrder', e.target.value)} /></label>
            <label className="block space-y-1 text-sm">Status<select required className={field} value={form.status} onChange={e => change('status', e.target.value)}>{!statuses.includes(form.status) && <option value={form.status} disabled>{form.status} (unsupported)</option>}{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
          </div>
          <div className="flex justify-end gap-2"><button type="button" className={secondary} disabled={busy} onClick={() => setModal(null)}>Cancel</button><button type="submit" className={primary} disabled={busy}>{busy ? 'Saving...' : 'Save'}</button></div>
        </form>
      </div>}
    </div>
  );
}

export default function FaqManager() {
  const { hasPermission } = usePermission();
  if (!hasPermission('faq.view')) return <p role="alert" className="rounded-xl bg-red-50 p-6 text-red-700 dark:bg-red-950/40 dark:text-red-400">You do not have permission to view FAQs.</p>;
  return <FaqManagement canCreate={hasPermission('faq.create')} canEdit={hasPermission('faq.edit')} canDelete={hasPermission('faq.delete')} />;
}
