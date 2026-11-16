import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Layout, Type, ArrowLeft, Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { pagesApi } from '../../../api/pages';
import { ncPuckConfig } from '../../../config/ncPuck.config';
import ImageField from '../../../components/admin/ImageField';

const ACTIVITY_META = {
  'field-trips': {
    label: 'Field Trips',
    order: 0,
    defaultDesc: 'Explore nature and ecosystems through guided learning in the field.',
  },
  'community-interaction': {
    label: 'Community Interaction',
    order: 1,
    defaultDesc: 'Connect with communities and learn from their relationship with nature.',
  },
  'nature-workshops': {
    label: 'Nature Workshops',
    order: 2,
    defaultDesc: 'Learn about nature and conservation through hands-on workshops.',
  },
};

const TABS = [
  { id: 'card', label: 'Overview Card (Prakriti Lab)' },
  { id: 'hero', label: 'Hero Banner' },
  { id: 'intro', label: 'Introduction & Logos' },
  { id: 'events', label: 'Upcoming Events' },
  { id: 'archive', label: 'Past Archive' },
  { id: 'cta', label: 'Bottom CTA' },
];

const getInitialData = (key) => {
  const meta = ACTIVITY_META[key] || ACTIVITY_META['field-trips'];
  return {
    activityKey: key,
    card: {
      title: meta.label,
      description: meta.defaultDesc,
      image: '',
      alt: meta.label,
      order: meta.order,
      visible: true,
    },
    hero: {
      heading: meta.label,
      image: '',
      alt: meta.label,
      showHeading: key !== 'nature-workshops',
    },
    introduction: {
      visible: true,
      heading: `Introduction of\n${meta.label}`,
      description:
        'Discover nature through practical experiences, shared learning, and activities that bring people closer to the natural world.',
      logos: [],
    },
    events: {
      visible: true,
      heading: key === 'nature-workshops' ? 'UPCOMING WORKSHOPS' : `UPCOMING ${meta.label.toUpperCase()}`,
      description: 'It is a long\nestablished fact\nthat a reader will\nbe distracted.',
      buttonLabel: 'Reserve Your Seat',
      buttonUrl: '#contact',
      items: [],
    },
    archive: {
      visible: true,
      heading: `Archive ${meta.label}`,
      items: [],
    },
    cta: {
      visible: true,
      title: 'LIVING',
      accent: 'art',
      headline: 'It is a long established<br />fact that a reader will be<br />distracted.',
      description: 'It is a long established fact that a reader will be distracted.',
      buttonLabel: "LET'S GET STARTED",
      buttonUrl: '#contact',
    },
  };
};

export default function ActivityEditor() {
  const { activityKey = 'field-trips' } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [isPuckMode, setIsPuckMode] = useState(false);
  const [activeTab, setActiveTab] = useState('card');
  const [formData, setFormData] = useState(() => getInitialData(activityKey));

  useEffect(() => {
    if (!ACTIVITY_META[activityKey]) {
      navigate('/admin/prakriti-activities/field-trips', { replace: true });
      return;
    }
    fetchActivityPage(activityKey);
  }, [activityKey]);

  useEffect(() => {
    if (isPuckMode) document.body.classList.add('puck-mode');
    else document.body.classList.remove('puck-mode');
    return () => document.body.classList.remove('puck-mode');
  }, [isPuckMode]);

  const fetchActivityPage = async (key) => {
    try {
      setLoading(true);
      setError(null);
      setPageId(null);
      const defaults = getInitialData(key);
      setFormData(defaults);

      // Check admin pages list so even DRAFT activity pages are found
      const listRes = await pagesApi.getPages({ search: `prakriti-lab/activities/${key}`, limit: 20 });
      const existingPage = (listRes?.data || []).find(
        (p) => p.fullPath === `/prakriti-lab/activities/${key}` || p.slug === `prakriti-lab/activities/${key}`
      );

      if (existingPage) {
        setPageId(existingPage.id);
        const block = existingPage.content?.blocks?.find((b) => b.type === 'prakritiActivity');
        if (block?.data) {
          setFormData({
            ...defaults,
            ...block.data,
            activityKey: key,
            card: { ...defaults.card, ...(block.data.card || {}) },
            hero: { ...defaults.hero, ...(block.data.hero || {}) },
            introduction: { ...defaults.introduction, ...(block.data.introduction || {}) },
            events: { ...defaults.events, ...(block.data.events || {}) },
            archive: { ...defaults.archive, ...(block.data.archive || {}) },
            cta: { ...defaults.cta, ...(block.data.cta || {}) },
          });
        }
      }
    } catch (err) {
      console.error('Failed to load activity page:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const saveToServer = async (dataToSave) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Clean & ensure backend Zod validation rules pass
    const sanitizedData = {
      ...dataToSave,
      activityKey,
      card: {
        ...dataToSave.card,
        title: (dataToSave.card?.title || ACTIVITY_META[activityKey].label).trim(),
        order: Number(dataToSave.card?.order ?? ACTIVITY_META[activityKey].order),
        visible: dataToSave.card?.visible !== false,
      },
      introduction: {
        ...dataToSave.introduction,
        logos: (dataToSave.introduction?.logos || []).slice(0, 4).map((l) => ({
          image: l.image || '',
          alt: l.alt || 'Partner Logo',
          label: l.label || 'LOGO',
        })),
      },
      events: {
        ...dataToSave.events,
        items: (dataToSave.events?.items || []).map((ev) => ({
          title: ev.title || 'Upcoming Event',
          image: ev.image || '',
          description: ev.description || '',
          buttonLabel: ev.buttonLabel || 'Book Now',
          buttonUrl: ev.buttonUrl || '#contact',
          ...(ev.date ? { date: ev.date } : {}),
          ...(ev.endDate ? { endDate: ev.endDate } : {}),
          ...(ev.venue ? { venue: ev.venue } : { venue: 'Kolkata' }),
        })),
      },
      archive: {
        ...dataToSave.archive,
        items: (dataToSave.archive?.items || []).map((ar) => ({
          title: ar.title || 'Archive Event',
          image: ar.image || '',
          alt: ar.alt || ar.title || 'Archive',
          venue: ar.venue || 'Kolkata',
          date: ar.date || '2026',
          linkLabel: ar.linkLabel || 'View Details',
          linkUrl: ar.linkUrl || '',
        })),
      },
    };

    const payload = {
      title: sanitizedData.card.title || ACTIVITY_META[activityKey].label,
      slug: `prakriti-lab/activities/${activityKey}`,
      status: 'PUBLISHED',
      template: 'prakriti-activity-page',
      includeInSitemap: true,
      content: {
        blocks: [
          {
            type: 'prakritiActivity',
            data: sanitizedData,
          },
        ],
      },
    };

    try {
      if (pageId) {
        await pagesApi.updatePage(pageId, payload);
      } else {
        const res = await pagesApi.createPage(payload);
        setPageId(res.data.id);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save activity page. Check date formats (YYYY-MM-DD) or URLs.');
    } finally {
      setSaving(false);
    }
  };

  // Convert nested formData to flat Puck props for easy visual editing
  const puckData = {
    content: [
      {
        type: 'prakritiActivity',
        props: {
          id: `activity-${activityKey}`,
          activityKey,
          card: formData.card,
          hero_heading: formData.hero.heading,
          hero_showHeading: formData.hero.showHeading,
          hero_image: formData.hero.image,
          intro_visible: formData.introduction.visible,
          intro_heading: formData.introduction.heading,
          intro_description: formData.introduction.description,
          intro_logos: formData.introduction.logos,
          events_visible: formData.events.visible,
          events_heading: formData.events.heading,
          events_description: formData.events.description,
          events_buttonLabel: formData.events.buttonLabel,
          events_buttonUrl: formData.events.buttonUrl,
          events_items: formData.events.items,
          archive_visible: formData.archive.visible,
          archive_heading: formData.archive.heading,
          archive_items: formData.archive.items,
          cta_visible: formData.cta.visible,
          cta_title: formData.cta.title,
          cta_accent: formData.cta.accent,
          cta_headline: formData.cta.headline,
          cta_description: formData.cta.description,
          cta_buttonLabel: formData.cta.buttonLabel,
          cta_buttonUrl: formData.cta.buttonUrl,
        },
      },
    ],
    root: { props: { title: ACTIVITY_META[activityKey]?.label || 'Activity' } },
    zones: {},
  };

  const handlePuckPublish = async (data) => {
    const block = data.content?.[0];
    if (block?.props) {
      const p = block.props;
      const updated = {
        ...formData,
        activityKey,
        hero: {
          ...formData.hero,
          heading: p.hero_heading ?? formData.hero.heading,
          showHeading: p.hero_showHeading !== false,
          image: p.hero_image ?? formData.hero.image,
        },
        introduction: {
          ...formData.introduction,
          visible: p.intro_visible !== false,
          heading: p.intro_heading ?? formData.introduction.heading,
          description: p.intro_description ?? formData.introduction.description,
          logos: p.intro_logos ?? formData.introduction.logos,
        },
        events: {
          ...formData.events,
          visible: p.events_visible !== false,
          heading: p.events_heading ?? formData.events.heading,
          description: p.events_description ?? formData.events.description,
          buttonLabel: p.events_buttonLabel ?? formData.events.buttonLabel,
          items: p.events_items ?? formData.events.items,
        },
        archive: {
          ...formData.archive,
          visible: p.archive_visible !== false,
          heading: p.archive_heading ?? formData.archive.heading,
          items: p.archive_items ?? formData.archive.items,
        },
        cta: {
          ...formData.cta,
          visible: p.cta_visible !== false,
          title: p.cta_title ?? formData.cta.title,
          accent: p.cta_accent ?? formData.cta.accent,
          headline: p.cta_headline ?? formData.cta.headline,
          description: p.cta_description ?? formData.cta.description,
          buttonLabel: p.cta_buttonLabel ?? formData.cta.buttonLabel,
          buttonUrl: p.cta_buttonUrl ?? formData.cta.buttonUrl,
        },
      };
      setFormData(updated);
      await saveToServer(updated);
    }
    setIsPuckMode(false);
  };

  const fieldClass =
    'w-full mt-1 px-3 py-2 border border-zinc-200 dark:border-blue-500/25 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[13px] placeholder:text-zinc-400 focus:outline-none focus:border-blue-500';
  const labelClass = 'text-[13px] font-medium text-zinc-600 dark:text-zinc-400';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-zinc-500 font-medium">Loading Prakriti Activity Editor...</p>
      </div>
    );
  }

  if (isPuckMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-blue-500/20 bg-zinc-50 dark:bg-zinc-900">
          <button
            onClick={() => setIsPuckMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 text-zinc-900 dark:text-zinc-100 rounded-md text-[13px] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Standard Form
          </button>
          <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
            Puck Visual Editor: {ACTIVITY_META[activityKey]?.label}
          </span>
          <p className="text-sm text-zinc-500">Click "Publish" to save changes</p>
        </div>
        <div className="flex-1 overflow-y-auto min-h-[calc(100vh-70px)]">
          <Puck config={ncPuckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Top Bar & Activity Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center nc-border p-4 rounded-md gap-4">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <Layout className="w-5 h-5 text-zinc-500" />
            Prakriti Lab: {ACTIVITY_META[activityKey]?.label}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            URL: <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">/prakriti-lab/activities/{activityKey}</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPuckMode(true)}
            className="px-3 h-9 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 text-zinc-700 dark:text-zinc-200 text-[13px] font-medium rounded-md flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <Type className="w-4 h-4" /> Edit Visually (Puck)
          </button>
          <button
            type="button"
            onClick={() => saveToServer(formData)}
            disabled={saving}
            className="px-4 h-9 bg-blue-600 text-white rounded-md text-[13px] font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-70 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Quick Switcher Between the 3 Activities */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(ACTIVITY_META).map(([key, meta]) => (
          <button
            key={key}
            type="button"
            onClick={() => navigate(`/admin/prakriti-activities/${key}`)}
            className={`px-3 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
              activityKey === key
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-blue-500/20 hover:bg-zinc-50'
            }`}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {success && (
        <div className="px-3 py-2.5 text-[13px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Activity page saved and published!
        </div>
      )}
      {error && (
        <div className="px-3 py-2.5 text-[13px] bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Tabs */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-blue-500/20 p-2 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Form Content */}
        <div className="lg:col-span-9">
          <div className="nc-border rounded-md p-5 space-y-4">
            {/* TAB 1: CARD */}
            {activeTab === 'card' && (
              <div className="space-y-4">
                <h2 className="text-[15px] font-semibold border-b border-zinc-200 dark:border-blue-500/20 pb-3">Prakriti Lab Card Settings</h2>
                <p className="text-xs text-zinc-500">
                  Controls how this card appears on the main <code>/prakriti-lab</code> page.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Card Title</label>
                    <input
                      type="text"
                      value={formData.card.title}
                      onChange={(e) => updateSection('card', 'title', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Display Order (0, 1, 2)</label>
                    <input
                      type="number"
                      value={formData.card.order}
                      onChange={(e) => updateSection('card', 'order', Number(e.target.value))}
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Card Description</label>
                  <textarea
                    rows="3"
                    value={formData.card.description}
                    onChange={(e) => updateSection('card', 'description', e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Card Image</label>
                  <ImageField
                    value={formData.card.image}
                    onChange={(url) => updateSection('card', 'image', url)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: HERO */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-blue-500/20 pb-3">
                  <h2 className="text-[15px] font-semibold">Hero Banner</h2>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hero.showHeading !== false}
                      onChange={(e) => updateSection('hero', 'showHeading', e.target.checked)}
                    />
                    Show Heading Overlay
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Hero Heading</label>
                  <input
                    type="text"
                    value={formData.hero.heading}
                    onChange={(e) => updateSection('hero', 'heading', e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Background Image</label>
                  <ImageField
                    value={formData.hero.image}
                    onChange={(url) => updateSection('hero', 'image', url)}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: INTRO & LOGOS */}
            {activeTab === 'intro' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-blue-500/20 pb-3">
                  <h2 className="text-[15px] font-semibold">Introduction & Partner Logos</h2>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.introduction.visible !== false}
                      onChange={(e) => updateSection('introduction', 'visible', e.target.checked)}
                    />
                    Visible
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Intro Heading</label>
                  <textarea
                    rows="2"
                    value={formData.introduction.heading}
                    onChange={(e) => updateSection('introduction', 'heading', e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Intro Description</label>
                  <textarea
                    rows="3"
                    value={formData.introduction.description}
                    onChange={(e) => updateSection('introduction', 'description', e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-blue-500/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className={labelClass}>Partner Logos (Max 4)</span>
                    {(formData.introduction.logos || []).length < 4 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateSection('introduction', 'logos', [
                            ...(formData.introduction.logos || []),
                            { image: '', label: 'LOGO', alt: 'Partner Logo' },
                          ])
                        }
                        className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 px-2.5 h-8 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Logo
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData.introduction.logos || []).map((logo, idx) => (
                      <div key={idx} className="p-4 border border-zinc-200 dark:border-blue-500/25 rounded-md space-y-3 relative bg-zinc-50 dark:bg-zinc-800/40">
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(
                              'introduction',
                              'logos',
                              formData.introduction.logos.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-2 right-2 text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Fallback Label"
                          value={logo.label || ''}
                          onChange={(e) => {
                            const next = [...formData.introduction.logos];
                            next[idx] = { ...next[idx], label: e.target.value };
                            updateSection('introduction', 'logos', next);
                          }}
                          className={fieldClass}
                        />
                        <ImageField
                          value={logo.image}
                          onChange={(url) => {
                            const next = [...formData.introduction.logos];
                            next[idx] = { ...next[idx], image: url };
                            updateSection('introduction', 'logos', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: UPCOMING EVENTS */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-blue-500/20 pb-3">
                  <h2 className="text-[15px] font-semibold">Upcoming Events Section</h2>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.events.visible !== false}
                      onChange={(e) => updateSection('events', 'visible', e.target.checked)}
                    />
                    Visible
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Section Heading</label>
                    <input
                      type="text"
                      value={formData.events.heading}
                      onChange={(e) => updateSection('events', 'heading', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Button Label</label>
                    <input
                      type="text"
                      value={formData.events.buttonLabel}
                      onChange={(e) => updateSection('events', 'buttonLabel', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Subtext / Description</label>
                  <textarea
                    rows="2"
                    value={formData.events.description}
                    onChange={(e) => updateSection('events', 'description', e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-blue-500/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className={labelClass}>Event Cards</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSection('events', 'items', [
                          ...(formData.events.items || []),
                          { title: 'NEW WORKSHOP', venue: 'Kolkata', image: '', description: '', buttonLabel: 'Book Now', buttonUrl: '#contact' },
                        ])
                      }
                      className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 px-2.5 h-8 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Event Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(formData.events.items || []).map((ev, idx) => (
                      <div key={idx} className="p-4 border border-zinc-200 dark:border-blue-500/25 rounded-md space-y-3 relative bg-zinc-50 dark:bg-zinc-800/40">
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(
                              'events',
                              'items',
                              formData.events.items.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-2 right-2 text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Event Title"
                            value={ev.title || ''}
                            onChange={(e) => {
                              const next = [...formData.events.items];
                              next[idx] = { ...next[idx], title: e.target.value };
                              updateSection('events', 'items', next);
                            }}
                            className={fieldClass}
                          />
                          <input
                            type="text"
                            placeholder="Venue (e.g. Kolkata)"
                            value={ev.venue || ''}
                            onChange={(e) => {
                              const next = [...formData.events.items];
                              next[idx] = { ...next[idx], venue: e.target.value };
                              updateSection('events', 'items', next);
                            }}
                            className={fieldClass}
                          />
                        </div>
                        <ImageField
                          value={ev.image}
                          onChange={(url) => {
                            const next = [...formData.events.items];
                            next[idx] = { ...next[idx], image: url };
                            updateSection('events', 'items', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ARCHIVE */}
            {activeTab === 'archive' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-blue-500/20 pb-3">
                  <h2 className="text-[15px] font-semibold">Past Events Archive</h2>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.archive.visible !== false}
                      onChange={(e) => updateSection('archive', 'visible', e.target.checked)}
                    />
                    Visible
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Archive Heading</label>
                  <input
                    type="text"
                    value={formData.archive.heading}
                    onChange={(e) => updateSection('archive', 'heading', e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div className="pt-4 border-t border-zinc-200 dark:border-blue-500/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className={labelClass}>Archive Items</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSection('archive', 'items', [
                          ...(formData.archive.items || []),
                          { title: 'Past Workshop', venue: 'Kolkata', date: 'March 2026', image: '', alt: 'Archive', linkLabel: 'View', linkUrl: '' },
                        ])
                      }
                      className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 px-2.5 h-8 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Archive Item
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(formData.archive.items || []).map((item, idx) => (
                      <div key={idx} className="p-4 border border-zinc-200 dark:border-blue-500/25 rounded-md space-y-3 relative bg-zinc-50 dark:bg-zinc-800/40">
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(
                              'archive',
                              'items',
                              formData.archive.items.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-2 right-2 text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Title"
                            value={item.title || ''}
                            onChange={(e) => {
                              const next = [...formData.archive.items];
                              next[idx] = { ...next[idx], title: e.target.value };
                              updateSection('archive', 'items', next);
                            }}
                            className={fieldClass}
                          />
                          <input
                            type="text"
                            placeholder="Venue"
                            value={item.venue || ''}
                            onChange={(e) => {
                              const next = [...formData.archive.items];
                              next[idx] = { ...next[idx], venue: e.target.value };
                              updateSection('archive', 'items', next);
                            }}
                            className={fieldClass}
                          />
                          <input
                            type="text"
                            placeholder="Date (e.g. March 2026)"
                            value={item.date || ''}
                            onChange={(e) => {
                              const next = [...formData.archive.items];
                              next[idx] = { ...next[idx], date: e.target.value };
                              updateSection('archive', 'items', next);
                            }}
                            className={fieldClass}
                          />
                        </div>
                        <ImageField
                          value={item.image}
                          onChange={(url) => {
                            const next = [...formData.archive.items];
                            next[idx] = { ...next[idx], image: url };
                            updateSection('archive', 'items', next);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CTA */}
            {activeTab === 'cta' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-blue-500/20 pb-3">
                  <h2 className="text-[15px] font-semibold">Bottom Call-To-Action</h2>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cta.visible !== false}
                      onChange={(e) => updateSection('cta', 'visible', e.target.checked)}
                    />
                    Visible
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Title Part 1</label>
                    <input
                      type="text"
                      value={formData.cta.title}
                      onChange={(e) => updateSection('cta', 'title', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Italic Accent Word</label>
                    <input
                      type="text"
                      value={formData.cta.accent}
                      onChange={(e) => updateSection('cta', 'accent', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Headline</label>
                  <textarea
                    rows="2"
                    value={formData.cta.headline}
                    onChange={(e) => updateSection('cta', 'headline', e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Subtext</label>
                  <textarea
                    rows="2"
                    value={formData.cta.description}
                    onChange={(e) => updateSection('cta', 'description', e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Button Label</label>
                    <input
                      type="text"
                      value={formData.cta.buttonLabel}
                      onChange={(e) => updateSection('cta', 'buttonLabel', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Button URL</label>
                    <input
                      type="text"
                      value={formData.cta.buttonUrl}
                      onChange={(e) => updateSection('cta', 'buttonUrl', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}