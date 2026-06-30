import React, { useState, useEffect } from 'react';
import { contactsApi } from '../../../api/contacts';
import { 
  Mail, Search, Phone, Clock, CheckCircle, Trash2, ShieldAlert, X, 
  MessageSquare, User, Calendar, Loader2, ArrowRight
} from 'lucide-react';
import { Can } from '../../../components/shared/Can';

const TABS = [
  { id: 'NEW', label: 'New Leads' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'SPAM', label: 'Spam' }
];

const ContactInbox = () => {
  const [activeTab, setActiveTab] = useState('NEW');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.getSubmissions({ status: activeTab, search: searchTerm, limit: 15 });
      setSubmissions(data.data || []);
      setMeta(data.meta);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLead = async (id) => {
    try {
      const res = await contactsApi.getSubmissionDetails(id);
      setSelectedLead(res.data);
      setSubmissions(subs => subs.map(s => s.id === id ? { ...s, isViewed: true } : s));
    } catch (err) {
      alert("Failed to load details");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await contactsApi.updateStatus(selectedLead.id, newStatus, "Status updated via admin panel.");
      setSelectedLead(null);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Permanently delete/anonymize this data?")) return;
    try {
      await contactsApi.deleteSubmission(id);
      setSelectedLead(null);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if(!noteText) return;
    try {
      setUpdating(true);
      await contactsApi.addInternalNote(selectedLead.id, noteText);
      setNoteText('');
      // Reload specific lead to get new notes
      const res = await contactsApi.getSubmissionDetails(selectedLead.id);
      setSelectedLead(res.data);
    } catch (err) {
      alert("Failed to add note");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-[#2B2A28]">

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-double border-[#2B2A28] pb-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#3F5C73] font-bold mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            Contact management
          </p>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-2.5 text-[#2B2A28]">
            <Mail className="w-6 h-6 text-[#3F5C73]" />
            Lead Inbox
          </h1>
          <p className="text-sm text-[#8A8378] mt-1 font-serif italic">
            Manage customer inquiries and contact forms.
          </p>
        </div>
      </div>

      {/* Main Panel — two-column inbox layout */}
      <div className="border border-[#DDD6C7] flex flex-col md:flex-row h-[720px]">

        {/* Left Sidebar — list */}
        <div className="w-full md:w-[300px] flex-shrink-0 border-r border-[#DDD6C7] flex flex-col bg-[#F3EFE4]/40">

          {/* Tabs */}
          <div className="flex border-b border-[#DDD6C7] overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap px-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#B5563A] text-[#2B2A28] bg-[#FAF7F0]'
                    : 'border-transparent text-[#8A8378] hover:text-[#2B2A28]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-3 border-b border-dotted border-[#DDD6C7]">
            <div className="relative border border-[#DDD6C7] focus-within:border-[#3F5C73] transition-colors bg-[#FAF7F0]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8378]" />
              <input
                type="text"
                placeholder="Search name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm font-serif bg-transparent outline-none placeholder:text-[#8A8378]/70 text-[#2B2A28]"
              />
            </div>
          </div>

          {/* Submissions list */}
          <div className="flex-1 overflow-y-auto divide-y divide-dotted divide-[#DDD6C7]">
            {loading ? (
              <div className="p-10 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#3F5C73]" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-10 text-center font-serif italic text-[#8A8378] text-sm">
                No leads in this folder.
              </div>
            ) : (
              submissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => handleOpenLead(sub.id)}
                  className={`p-4 cursor-pointer hover:bg-[#FAF7F0] transition-colors relative ${
                    selectedLead?.id === sub.id ? 'bg-[#FAF7F0] border-l-2 border-l-[#3F5C73]' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  {/* Unread indicator */}
                  {!sub.isViewed && (
                    <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-[#B5563A]" />
                  )}
                  <h4 className={`text-sm font-serif ${sub.isViewed ? 'font-normal text-[#5b5852]' : 'font-bold text-[#2B2A28]'}`}>
                    {sub.name}
                  </h4>
                  <p className="text-[11px] font-mono text-[#8A8378] mt-1 truncate">{sub.email}</p>
                  <p className="text-[10px] font-mono text-[#8A8378]/70 mt-2 uppercase tracking-wide">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel — detail viewer */}
        <div className="flex-1 bg-[#FAF7F0] flex flex-col min-w-0">
          {selectedLead ? (
            <div className="flex-1 overflow-y-auto flex flex-col">

              {/* Sticky toolbar */}
              <div className="sticky top-0 z-10 px-6 py-3 border-b border-[#DDD6C7] bg-[#F3EFE4]/80 backdrop-blur-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8378]">Status</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="border border-[#DDD6C7] bg-[#FAF7F0] font-mono text-[11px] uppercase tracking-wide px-3 py-1.5 outline-none focus:border-[#3F5C73] text-[#2B2A28] transition-colors disabled:opacity-60"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="SPAM">Spam</option>
                  </select>
                </div>

                <Can permission="contact.delete">
                  <button
                    onClick={() => handleDelete(selectedLead.id)}
                    className="p-2 text-[#8A8378] hover:text-[#B5563A] hover:bg-[#B5563A]/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Can>
              </div>

              {/* Lead details */}
              <div className="p-6 md:p-8 flex-1">

                {/* Name & contact row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-dotted border-[#DDD6C7]">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#2B2A28] mb-2">{selectedLead.name}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-[#5b5852]">
                      <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-1.5 hover:text-[#3F5C73] transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                      </a>
                      {selectedLead.phone && (
                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1.5 hover:text-[#3F5C73] transition-colors">
                          <Phone className="w-3.5 h-3.5" /> {selectedLead.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8378] block mb-1">Received on</span>
                    <span className="text-sm font-mono text-[#2B2A28]">
                      {new Date(selectedLead.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="border border-[#DDD6C7] bg-[#F3EFE4]/40 p-5 mb-8">
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#8A8378] mb-3">Message</h3>
                  <p className="font-serif text-sm leading-relaxed text-[#2B2A28] whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>

                {/* Internal Notes */}
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#2B2A28] font-bold flex items-center gap-2 border-b border-dotted border-[#DDD6C7] pb-2 mb-4">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8A8378]" />
                    Internal Notes
                  </h3>

                  {selectedLead.internalNotes?.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedLead.internalNotes.map(note => (
                        <div key={note.id} className="border border-[#DDD6C7] bg-[#FAF7F0] p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-mono font-bold text-[#3F5C73] flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              {note.author?.name || 'Admin'}
                            </span>
                            <span className="text-[10px] font-mono text-[#8A8378]">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm font-serif text-[#2B2A28]">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-serif italic text-[#8A8378] mb-4">No internal notes yet.</p>
                  )}

                  <Can permission="contact.edit">
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <div className="flex-1 border border-[#DDD6C7] focus-within:border-[#3F5C73] transition-colors bg-[#FAF7F0]">
                        <input
                          type="text"
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Add a note for the team…"
                          className="w-full px-4 py-2.5 text-sm font-serif bg-transparent outline-none placeholder:text-[#8A8378]/70 text-[#2B2A28]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updating || !noteText}
                        className="px-4 py-2.5 bg-[#2B2A28] text-[#FAF7F0] hover:bg-[#3F5C73] transition-colors disabled:opacity-50 flex items-center"
                      >
                        {updating
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <ArrowRight className="w-4 h-4" />
                        }
                      </button>
                    </form>
                  </Can>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <Mail className="w-10 h-10 text-[#DDD6C7] mb-4" />
              <h3 className="font-serif text-lg font-bold text-[#2B2A28] mb-1">Select a Lead</h3>
              <p className="text-sm font-serif italic text-[#8A8378]">
                Choose a contact submission from the list to view details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactInbox;