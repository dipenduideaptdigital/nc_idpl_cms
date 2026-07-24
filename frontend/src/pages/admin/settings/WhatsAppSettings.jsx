import React, { useState, useEffect } from 'react';
import { MessageSquare, Save, Loader2, CheckCircle2, AlertCircle, Phone, Power, Check } from 'lucide-react';
import apiClient from '../../../api/client';

const WhatsAppSettings = () => {
  const [phoneNumber, setPhoneNumber] = useState('+91 9831-637-409');
  const [defaultMessage, setDefaultMessage] = useState('Hi Subhaakritee, I am interested in your interior design services.');
  const [isActive, setIsActive] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/cms/section/whatsapp_settings');
      const content = res.data?.data?.content || res.data?.content;
      if (content) {
        if (content.phoneNumber !== undefined) setPhoneNumber(content.phoneNumber);
        if (content.defaultMessage !== undefined) setDefaultMessage(content.defaultMessage);
        if (content.isActive !== undefined) setIsActive(Boolean(content.isActive));
      }
    } catch (error) {
      console.error('Failed to load WhatsApp settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        content: {
          phoneNumber: phoneNumber.trim() || '+91 9831-637-409',
          defaultMessage: defaultMessage.trim() || 'Hi Subhaakritee, I am interested in your interior design services.',
          isActive: Boolean(isActive),
        },
      };

      await apiClient.put('/cms/section/whatsapp_settings', payload);

      // Local storage cache for instant client updates
      localStorage.setItem('idpl_whatsapp_number', phoneNumber.trim());
      localStorage.setItem('idpl_whatsapp_active', String(isActive));
      localStorage.setItem('idpl_whatsapp_message', defaultMessage.trim());

      // Global window event notification
      window.dispatchEvent(
        new CustomEvent('whatsapp_settings_updated', {
          detail: {
            phoneNumber: phoneNumber.trim(),
            defaultMessage: defaultMessage.trim(),
            isActive: Boolean(isActive),
          },
        })
      );

      setMessage({ type: 'success', text: 'WhatsApp settings updated successfully!' });
    } catch (error) {
      console.error('Failed to save WhatsApp settings:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save WhatsApp settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-zinc-900 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            WhatsApp & Contact Settings
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Configure the main WhatsApp number, default greeting message, and chatbot activation.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors shadow-sm focus:ring-2 focus:ring-emerald-600/20 flex-shrink-0"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Settings Section */}
      <div className="space-y-6 max-w-4xl">
          
        {/* Chatbot Activation Toggle Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Power className="w-4 h-4 text-zinc-600" />
              Chatbot & Floating Widget Status
            </h2>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
              }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 mb-1">
                Activate WhatsApp Floating Chatbot
              </h3>
              <p className="text-xs text-zinc-500 max-w-md">
                When enabled, the floating WhatsApp widget appears on all website pages. Deactivating it will hide the chatbot from public view.
              </p>
            </div>

            {/* Toggle Switch Button */}
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600/30 ${
                isActive ? 'bg-emerald-600' : 'bg-zinc-300'
              }`}
              role="switch"
              aria-checked={isActive}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Form Fields Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-600" />
              Contact Details
            </h2>
            <span className="text-xs text-zinc-400 font-medium">Public Information</span>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +91 9831-637-409"
                className="block w-full px-4 py-3 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors sm:text-sm font-semibold"
                required
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                This number is used for opening direct chats in the WhatsApp chatbot.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Default Chat Message
              </label>
              <textarea
                rows={3}
                value={defaultMessage}
                onChange={(e) => setDefaultMessage(e.target.value)}
                placeholder="e.g. Hi Subhaakritee, I am interested in your interior design services."
                className="block w-full px-4 py-3 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors sm:text-sm font-medium"
              />
              <p className="text-xs text-zinc-400 mt-1.5">
                Pre-filled greeting message when users open a direct chat link.
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppSettings;