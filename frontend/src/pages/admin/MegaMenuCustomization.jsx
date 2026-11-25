
import React, { useEffect, useState } from 'react';
import {
  Save,
  Loader2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import apiClient from '../../api/client';
import ImageField from '../../components/admin/ImageField';
import { usePermission } from '../../hooks/usePermission';

import {
  DEFAULT_MEGA_MENU,
  MEGA_MENU_KEY,
  mergeMegaMenu,
} from '../../config/offeringsMegaMenu';

const inputClass =
  'w-full px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm';

const labelClass =
  'block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5';

const menuCards = [
  { key: 'ripple', label: 'Ripple' },
  { key: 'gulmo', label: 'Gulmo' },
  { key: 'prakriti', label: 'Prakriti LAB' },
];

const textFields = [
  { key: 'label', label: 'Section Label' },
  { key: 'tagline', label: 'Bottom Tagline' },
  { key: 'headingLine1', label: 'Heading Line 1' },
  { key: 'headingLine2', label: 'Heading Line 2' },
];

const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  maxLength = 200,
  placeholder = '',
}) => {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>

      {multiline ? (
        <textarea
          className={`${inputClass} resize-y`}
          rows={3}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className={inputClass}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
        />
      )}
    </label>
  );
};

const MegaMenuCustomization = () => {
  const { hasPermission } = usePermission();
  const allowed = hasPermission('page.edit');

  const [data, setData] = useState(DEFAULT_MEGA_MENU);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState(null);

  // Fetch mega menu settings
  useEffect(() => {
    if (!allowed) return;

    const controller = new AbortController();

    const fetchSettings = async () => {
      setLoading(true);
      setLoadFailed(false);
      setMessage(null);

      try {
        const res = await apiClient.get(
          `/cms/section/${MEGA_MENU_KEY}`,
          { signal: controller.signal }
        );

        if (!controller.signal.aborted) {
          setData(
            mergeMegaMenu(res.data?.data?.content)
          );
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadFailed(true);
        setMessage({
          type: 'error',
          text:
            error.response?.data?.message ||
            'Failed to load mega menu settings.',
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => controller.abort();
  }, [allowed, attempt]);

  // Update general content
  const handleChange = (key, value) => {
    setMessage(null);

    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update individual menu card
  const handleCardChange = (key, field, value) => {
    setMessage(null);

    setData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  // Reset form to default content
  const handleReset = () => {
    setData(DEFAULT_MEGA_MENU);
    setMessage(null);
  };

  // Save mega menu settings
  const handleSave = async (e) => {
    e.preventDefault();

    if (!allowed || loading || loadFailed || saving) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await apiClient.put(
        `/cms/section/${MEGA_MENU_KEY}`,
        { content: data }
      );

      setData(
        mergeMegaMenu(res.data?.data?.content || data)
      );

      setMessage({
        type: 'success',
        text: 'Mega menu settings updated successfully!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to save mega menu settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!allowed) {
    return (
      <div
        role="alert"
        className="p-6 text-sm text-zinc-500 dark:text-zinc-400"
      >
        You do not have permission to edit the mega menu.
      </div>
    );
  }

  const isDisabled = loading || saving || loadFailed;

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 pb-10 text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Mega Menu
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage content and images for the Offerings mega menu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isDisabled}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}

            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}

          <span>{message.text}</span>

          {loadFailed && (
            <button
              type="button"
              onClick={() => setAttempt((prev) => prev + 1)}
              className="ml-auto underline font-semibold"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin" />
        </div>
      ) : !loadFailed ? (
        <fieldset
          disabled={saving}
          className="min-w-0 disabled:opacity-75"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors duration-300">

            {/* General Content */}
            <section className="p-5 space-y-4">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                  General Content
                </h2>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Manage the content displayed on the left side of the menu.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {textFields.map(({ key, label }) => (
                  <Field
                    key={key}
                    label={label}
                    value={data[key]}
                    onChange={(value) =>
                      handleChange(key, value)
                    }
                  />
                ))}
              </div>

              <Field
                label="Description"
                value={data.description}
                onChange={(value) =>
                  handleChange('description', value)
                }
                multiline
                maxLength={1000}
              />
            </section>

            {/* Menu Items */}
            <section className="p-5 border-t border-zinc-200 dark:border-zinc-800">
              <div className="mb-2">
                <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                  Menu Items
                </h2>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Manage menu titles, destination links and images.
                </p>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {menuCards.map(({ key, label }) => (
                  <div
                    key={key}
                    className="py-5 last:pb-0"
                  >
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                      {label}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-5">

                      {/* Image Field */}
                      <div className="w-full max-w-[320px]">
                        <label className={labelClass}>
                          {key === 'prakriti'
                            ? 'Background Image'
                            : 'Card Image'}
                        </label>

                        <ImageField
                          value={data[key].image || ''}
                          onChange={(value) =>
                            handleCardChange(
                              key,
                              'image',
                              value
                            )
                          }
                        />
                      </div>

                      {/* Card Content */}
                      <div className="min-w-0 space-y-3">
                        <Field
                          label="Title"
                          value={data[key].title}
                          onChange={(value) =>
                            handleCardChange(
                              key,
                              'title',
                              value
                            )
                          }
                        />

                        <Field
                          label="Destination Path"
                          value={data[key].href}
                          onChange={(value) =>
                            handleCardChange(
                              key,
                              'href',
                              value
                            )
                          }
                          maxLength={500}
                          placeholder="Leave empty for automatic page link"
                        />

                        {key === 'prakriti' && (
                          <Field
                            label="Description"
                            value={data[key].description}
                            onChange={(value) =>
                              handleCardChange(
                                key,
                                'description',
                                value
                              )
                            }
                            multiline
                            maxLength={1000}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </fieldset>
      ) : null}
    </form>
  );
};

export default MegaMenuCustomization;
