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
    <div className="max-w-6xl mx-auto h-[80vh] min-h-[600px] max-h-[850px] flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 animate-in fade-in duration-500">
      
      {/* Compact Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2.5">
          <Mail className="w-4.5 h-4.5 text-zinc-600 dark:text-zinc-400" />
          <h1 className="text-sm font-semibold tracking-tight">Lead Inbox</h1>
          <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-[10px] rounded-full text-zinc-600 dark:text-zinc-400 font-medium">
            Customer Inquiries
          </span>
        </div>
      </header>

      {/* Main Body Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (List) */}
        <div className="w-full md:w-[320px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-950">
          
          {/* Segmented Control Tabs */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="flex p-0.5 bg-zinc-200/50 dark:bg-zinc-800/80 rounded-md">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 px-2 text-[11px] font-medium rounded transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Search */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-colors placeholder-zinc-400 dark:placeholder-zinc-500"
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                No leads found.
              </div>
            ) : (
              submissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => handleOpenLead(sub.id)}
                  className={`p-3 cursor-pointer transition-colors relative ${
                    selectedLead?.id === sub.id 
                      ? 'bg-zinc-100/80 dark:bg-zinc-800/80' 
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5">
                      {!sub.isViewed && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />
                      )}
                      <h4 className={`text-xs truncate ${sub.isViewed ? 'font-medium text-zinc-700 dark:text-zinc-300' : 'font-semibold text-zinc-900 dark:text-zinc-100'}`}>
                        {sub.name}
                      </h4>
                    </div>
                    <span className="text-[10px] text-zinc-400 flex-shrink-0">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate pl-3">{sub.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel (Details Viewer) */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-50/30 dark:bg-[#0a0a0a]">
          {selectedLead ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Detail Toolbar */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="pl-2 pr-6 py-1 text-xs font-medium bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md outline-none focus:ring-1 focus:ring-zinc-400 transition-colors cursor-pointer disabled:opacity-60"
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
                    className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Can>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6">
                
                {/* Lead Meta Data Header */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">{selectedLead.name}</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors w-fit">
                      <Mail className="w-3.5 h-3.5" /> {selectedLead.email}
                    </a>
                    
                    {selectedLead.phone && (
                      <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors w-fit">
                        <Phone className="w-3.5 h-3.5" /> {selectedLead.phone}
                      </a>
                    )}
                    
                    {selectedLead.website && (
                      <a href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">
                        <span className="w-3.5 h-3.5 flex items-center justify-center border border-current rounded-full text-[8px] font-bold">W</span> 
                        {selectedLead.website}
                      </a>
                    )}
                    
                    <div className="flex items-center gap-2 w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedLead.createdAt).toLocaleString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Main Message Box */}
                <div className="mb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Message</h3>
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-sm text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </div>
                </div>

                {/* Internal Notes Section */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Internal Notes
                  </h3>

                  {selectedLead.internalNotes?.length > 0 ? (
                    <div className="space-y-2.5 mb-4">
                      {selectedLead.internalNotes.map(note => (
                        <div key={note.id} className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                              <User className="w-3 h-3 text-zinc-500" />
                              {note.author?.name || 'Admin'}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {new Date(note.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300 text-xs mt-0.5">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic mb-4">No notes added yet.</p>
                  )}

                  {/* Add Note Input */}
                  <Can permission="contact.edit">
                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Type a note..."
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition-colors placeholder-zinc-400"
                      />
                      <button
                        type="submit"
                        disabled={updating || !noteText}
                        className="flex items-center justify-center px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-white transition-colors disabled:opacity-50"
                      >
                        {updating
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <ArrowRight className="w-3.5 h-3.5" />
                        }
                      </button>
                    </form>
                  </Can>
                </div>
                
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No Lead Selected</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                Click on a lead from the sidebar to view its details.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ContactInbox;