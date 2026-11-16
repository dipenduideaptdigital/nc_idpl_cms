import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Layout, Type, Plus, Trash2, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { pagesApi } from '../../../api/pages';
import { ncPuckConfig } from '../../../config/ncPuck.config';
import ImageField from '../../../components/admin/ImageField';
import TipTapEditor from '../../../components/admin/TipTapEditor';

const DEFAULT_OPT_1 = [
  'DOOA GLASS POT MARU 95',
  'DOOA JUNGLE SOIL 700ML',
  'DOOA JUNGLE BASE 200ML',
  'DOOA WABI KUSA MIST 200ML',
  'PLANTS & MOSS',
  'WORKSHOP BASIC CHARGE',
  'TERRARIUM HUMIDIFIER BOTTLE',
  'TWEEZER',
];

const DEFAULT_OPT_2 = [
  'EXTRA CLEAR CUSTOM TANK',
  'DOOA JUNGLE SOIL 700ML',
  'DOOA JUNGLE BASE 200ML',
  'DOOA WABI KUSA MIST 200ML',
  'PLANTS & MOSS',
  'WORKSHOP BASIC CHARGE',
  'TERRARIUM HUMIDIFIER BOTTLE',
  'TWEEZER',
];

export default function WorkshopEditor() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isPuckMode, setIsPuckMode] = useState(false);

  const [formData, setFormData] = useState({
    pageTitle: 'Terrarium Workshop',
    slug: '',
    status: 'PUBLISHED',
    // Mapping controls
    activityKey: 'nature-workshops',
    placement: 'upcoming',
    venue: 'NatureCube Experience Centre, Kolkata',
    thumbnail: '',
    // Hero Block
    heroImage: '',
    // Details Block
    title: 'TERRARIUM WORKSHOP',
    mentor: 'GAUTAM GUPTA',
    date: '22nd March, 2026',
    fee: '₹ 8500.00',
    feeSubtext: 'inclusive of all taxes',
    buttonText: 'BOOK NOW',
    detailsSubtitle: 'AN ALL-INCLUSIVE WORKSHOP EXPERIENCE',
    detailsDescription:
      "<p>At Naturecube, we take students from schools and colleges on extensive field tours to natural surroundings and nature reserves, teaching them about nature, conservation, and ecosystem functions. Using both outdoor environments and our gallery's aquariums and terrariums as models.</p>",
    option1Title: 'DOOA GLASS POT MARU 95',
    option1Items: [...DEFAULT_OPT_1],
    option2Title: 'EXTRA CLEAR CUSTOM TANK',
    option2Items: [...DEFAULT_OPT_2],
    // Gallery Block (5 images)
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchWorkshop();
    }
  }, [id]);

  useEffect(() => {
    if (isPuckMode) document.body.classList.add('puck-mode');
    else document.body.classList.remove('puck-mode');
    return () => document.body.classList.remove('puck-mode');
  }, [isPuckMode]);

  const fetchWorkshop = async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getPageById(id);
      const page = res.data;
      const blocks = page.content?.blocks || [];
      const hero = blocks.find((b) => b.type === 'workshopHero')?.data || {};
      const details = blocks.find((b) => b.type === 'workshopDetails')?.data || {};
      const gallery = blocks.find((b) => b.type === 'workshopGallery')?.data || {};

      const extractStr = (val) => (typeof val === 'object' ? val.item || val.name || val.title || '' : String(val || ''));

      setFormData((prev) => ({
        ...prev,
        pageTitle: page.title || '',
        slug: page.slug || '',
        status: page.status || 'PUBLISHED',
        activityKey: page.content?.activityKey || 'nature-workshops',
        placement: page.content?.placement || 'upcoming',
        venue: page.content?.venue || 'NatureCube Experience Centre, Kolkata',
        thumbnail: page.content?.thumbnail || '',
        heroImage: hero.backgroundImage || '',
        title: details.title || page.title || 'TERRARIUM WORKSHOP',
        mentor: details.mentor || 'GAUTAM GUPTA',
        date: details.date || '22nd March, 2026',
        fee: details.fee || '₹ 8500.00',
        feeSubtext: details.feeSubtext || 'inclusive of all taxes',
        buttonText: details.buttonText || 'BOOK NOW',
        detailsSubtitle: details.detailsSubtitle || 'AN ALL-INCLUSIVE WORKSHOP EXPERIENCE',
        detailsDescription: details.detailsDescription || prev.detailsDescription,
        option1Title: details.option1Title || 'DOOA GLASS POT MARU 95',
        option1Items:
          Array.isArray(details.option1Items) && details.option1Items.length > 0
            ? details.option1Items.map(extractStr)
            : DEFAULT_OPT_1,
        option2Title: details.option2Title || 'EXTRA CLEAR CUSTOM TANK',
        option2Items:
          Array.isArray(details.option2Items) && details.option2Items.length > 0
            ? details.option2Items.map(extractStr)
            : DEFAULT_OPT_2,
        image1: gallery.image1 || '',
        image2: gallery.image2 || '',
        image3: gallery.image3 || '',
        image4: gallery.image4 || '',
        image5: gallery.image5 || '',
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to load workshop data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPagePayload = (stateData) => {
    const rawSlug =
      stateData.slug?.trim() ||
      `workshops/${(stateData.pageTitle || stateData.title || 'workshop')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-/]+/g, '-')
        .replace(/^-+|-+$/g, '')}`;

    return {
      title: stateData.pageTitle || stateData.title || 'Workshop',
      slug: rawSlug,
      status: stateData.status || 'PUBLISHED',
      template: 'workshop-page',
      includeInSitemap: true,
      content: {
        activityKey: stateData.activityKey || 'nature-workshops',
        placement: stateData.placement || 'upcoming',
        venue: stateData.venue || 'NatureCube Experience Centre, Kolkata',
        thumbnail: stateData.thumbnail || stateData.heroImage || stateData.image1 || '',
        blocks: [
          {
            type: 'workshopHero',
            data: {
              isVisible: true,
              backgroundImage: stateData.heroImage || '',
            },
          },
          {
            type: 'workshopDetails',
            data: {
              isVisible: true,
              title: stateData.title,
              mentor: stateData.mentor,
              date: stateData.date,
              fee: stateData.fee,
              feeSubtext: stateData.feeSubtext,
              buttonText: stateData.buttonText,
              detailsSubtitle: stateData.detailsSubtitle,
              detailsDescription: stateData.detailsDescription,
              option1Title: stateData.option1Title,
              option1Items: (stateData.option1Items || []).filter(Boolean),
              option2Title: stateData.option2Title,
              option2Items: (stateData.option2Items || []).filter(Boolean),
            },
          },
          {
            type: 'workshopGallery',
            data: {
              isVisible: true,
              image1: stateData.image1 || '',
              image2: stateData.image2 || '',
              image3: stateData.image3 || '',
              image4: stateData.image4 || '',
              image5: stateData.image5 || '',
            },
          },
          {
            type: 'getStartedCta',
            data: {
              isVisible: true,
            },
          },
        ],
      },
    };
  };

  const saveWorkshop = async (stateToSave = formData) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = buildPagePayload(stateToSave);
      if (isEditMode) {
        await pagesApi.updatePage(id, payload);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const res = await pagesApi.createPage(payload);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/workshops/edit/${res.data.id}`, { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save workshop page.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveWorkshop(formData);
  };

  // Puck Mode Data Mapping
  const puckData = {
    content: [
      {
        type: 'workshopHero',
        props: { id: 'ws-hero', isVisible: true, backgroundImage: formData.heroImage },
      },
      {
        type: 'workshopDetails',
        props: {
          id: 'ws-details',
          isVisible: true,
          title: formData.title,
          mentor: formData.mentor,
          date: formData.date,
          fee: formData.fee,
          feeSubtext: formData.feeSubtext,
          buttonText: formData.buttonText,
          detailsSubtitle: formData.detailsSubtitle,
          detailsDescription: formData.detailsDescription,
          option1Title: formData.option1Title,
          option1Items: formData.option1Items.map((item) => ({ item })),
          option2Title: formData.option2Title,
          option2Items: formData.option2Items.map((item) => ({ item })),
        },
      },
      {
        type: 'workshopGallery',
        props: {
          id: 'ws-gallery',
          isVisible: true,
          image1: formData.image1,
          image2: formData.image2,
          image3: formData.image3,
          image4: formData.image4,
          image5: formData.image5,
        },
      },
      {
        type: 'getStartedCta',
        props: { id: 'ws-cta', isVisible: true },
      },
    ],
    root: { props: { title: formData.pageTitle || formData.title } },
    zones: {},
  };

  const handlePuckPublish = async (data) => {
    const blocks = data.content || [];
    const heroProps = blocks.find((b) => b.type === 'workshopHero')?.props || {};
    const detailProps = blocks.find((b) => b.type === 'workshopDetails')?.props || {};
    const galleryProps = blocks.find((b) => b.type === 'workshopGallery')?.props || {};

    const nextState = {
      ...formData,
      heroImage: heroProps.backgroundImage ?? formData.heroImage,
      title: detailProps.title ?? formData.title,
      mentor: detailProps.mentor ?? formData.mentor,
      date: detailProps.date ?? formData.date,
      fee: detailProps.fee ?? formData.fee,
      feeSubtext: detailProps.feeSubtext ?? formData.feeSubtext,
      buttonText: detailProps.buttonText ?? formData.buttonText,
      detailsSubtitle: detailProps.detailsSubtitle ?? formData.detailsSubtitle,
      detailsDescription: detailProps.detailsDescription ?? formData.detailsDescription,
      option1Title: detailProps.option1Title ?? formData.option1Title,
      option1Items: Array.isArray(detailProps.option1Items)
        ? detailProps.option1Items.map((x) => (typeof x === 'string' ? x : x.item || ''))
        : formData.option1Items,
      option2Title: detailProps.option2Title ?? formData.option2Title,
      option2Items: Array.isArray(detailProps.option2Items)
        ? detailProps.option2Items.map((x) => (typeof x === 'string' ? x : x.item || ''))
        : formData.option2Items,
      image1: galleryProps.image1 ?? formData.image1,
      image2: galleryProps.image2 ?? formData.image2,
      image3: galleryProps.image3 ?? formData.image3,
      image4: galleryProps.image4 ?? formData.image4,
      image5: galleryProps.image5 ?? formData.image5,
    };

    setFormData(nextState);
    setIsPuckMode(false);
    await saveWorkshop(nextState);
  };

  const fieldClass =
    'w-full mt-1 px-3 py-2 border border-zinc-200 dark:border-blue-500/25 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[13px] placeholder:text-zinc-400 focus:outline-none focus:border-blue-500';
  const labelClass = 'block text-[13px] font-medium text-zinc-600 dark:text-zinc-400';

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isPuckMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-blue-500/20 bg-zinc-50 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setIsPuckMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 rounded-md text-[13px] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workshop Form
          </button>
          <span className="font-semibold text-base">Puck Visual Editor: {formData.pageTitle || formData.title}</span>
          <p className="text-sm text-zinc-500">Click "Publish" to save</p>
        </div>
        <div className="flex-1 overflow-y-auto min-h-[calc(100vh-70px)]">
          <Puck config={ncPuckConfig} data={puckData} onPublish={handlePuckPublish} iframe={{ enabled: false }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center nc-border p-4 rounded-md gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/workshops" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <Sparkles className="w-5 h-5 text-zinc-500" />
              {isEditMode ? `Edit Workshop: ${formData.pageTitle}` : 'Create New Workshop Page'}
            </h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">
              Uses the official Workshop Page template and maps automatically to Prakriti Lab cards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPuckMode(true)}
            className="px-3 h-9 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-blue-500/25 text-zinc-700 dark:text-zinc-200 text-[13px] font-medium rounded-md flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <Type className="w-4 h-4" /> Edit Visually (Puck)
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 h-9 bg-blue-600 text-white rounded-md text-[13px] font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Workshop'}
          </button>
        </div>
      </div>

      {success && (
        <div className="px-3 py-2.5 text-[13px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Workshop page saved successfully!
        </div>
      )}
      {error && (
        <div className="px-3 py-2.5 text-[13px] bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Mapping & Routing Card */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-md border border-zinc-200 dark:border-blue-500/20 space-y-4">
        <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-blue-500/20 pb-3">
         Prakriti Lab Mapping & Placement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Map to Prakriti Lab Card (Page) *</label>
            <select name="activityKey" value={formData.activityKey} onChange={handleChange} className={fieldClass}>
              <option value="field-trips">Field Trips</option>
              <option value="community-interaction">Community Interaction</option>
              <option value="nature-workshops">Nature Workshops</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Target Section on that Page *</label>
            <select name="placement" value={formData.placement} onChange={handleChange} className={fieldClass}>
              <option value="upcoming">Upcoming Section</option>
              <option value="archive">Archive Section</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Publish Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={fieldClass}>
              <option value="PUBLISHED">Published (Live)</option>
              <option value="DRAFT">Draft (Hidden)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className={labelClass}>Internal Page Title *</label>
            <input
              type="text"
              name="pageTitle"
              required
              value={formData.pageTitle}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  pageTitle: e.target.value,
                  title: p.title === p.pageTitle.toUpperCase() ? e.target.value.toUpperCase() : p.title,
                }))
              }
              placeholder="e.g. Terrarium Workshop"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>URL Slug (Auto-generated if empty)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="workshops/terrarium-workshop"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Venue (Shown in Archive list)</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="NatureCube Experience Centre, Kolkata"
              className={fieldClass}
            />
          </div>
        </div>
      </div>

      {/* Hero & Card Thumbnail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-md border border-zinc-200 dark:border-blue-500/20 space-y-3">
          <h2 className="text-[15px] font-semibold border-b border-zinc-200 dark:border-blue-500/20 pb-3">Hero Banner Image</h2>
          <p className="text-xs text-zinc-500">Full-bleed top banner on the workshop detail page.</p>
          <ImageField
            value={formData.heroImage}
            onChange={(url) => setFormData((p) => ({ ...p, heroImage: url }))}
          />
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-md border border-zinc-200 dark:border-blue-500/20 space-y-3">
          <h2 className="text-[15px] font-semibold border-b border-zinc-200 dark:border-blue-500/20 pb-3">Card Thumbnail (Optional)</h2>
          <p className="text-xs text-zinc-500">
            Shown on the Upcoming / Archive card. Uses Hero Banner if left empty.
          </p>
          <ImageField
            value={formData.thumbnail}
            onChange={(url) => setFormData((p) => ({ ...p, thumbnail: url }))}
          />
        </div>
      </div>

      {/* Workshop Details Section */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-md border border-zinc-200 dark:border-blue-500/20 space-y-5">
        <h2 className="text-[15px] font-semibold border-b border-zinc-200 dark:border-blue-500/20 pb-3">Details & Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Display Heading *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Workshop Mentor</label>
            <input type="text" name="mentor" value={formData.mentor} onChange={handleChange} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Workshop Date</label>
            <input type="text" name="date" value={formData.date} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Workshop Fee</label>
            <input type="text" name="fee" value={formData.fee} onChange={handleChange} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Fee Subtext</label>
            <input
              type="text"
              name="feeSubtext"
              value={formData.feeSubtext}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>CTA Button Text</label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Details Subtitle</label>
          <input
            type="text"
            name="detailsSubtitle"
            value={formData.detailsSubtitle}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={`${labelClass} mb-2`}>Details Description</label>
          <div className="border border-zinc-200 dark:border-blue-500/25 rounded-md overflow-hidden">
            <TipTapEditor
              value={formData.detailsDescription}
              onChange={(val) => setFormData((p) => ({ ...p, detailsDescription: val }))}
            />
          </div>
        </div>

        {/* Packages Option 1 & Option 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 dark:border-blue-500/20">
          {/* Option 1 */}
          <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-blue-500/25 space-y-3">
            <label className={labelClass}>Option 01 Package Title</label>
            <input
              type="text"
              name="option1Title"
              value={formData.option1Title}
              onChange={handleChange}
              className={fieldClass}
            />
            <div className="flex justify-between items-center pt-2">
              <span className={labelClass}>Option 01 Items</span>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, option1Items: [...p.option1Items, ''] }))}
                className="text-[13px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData.option1Items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = [...formData.option1Items];
                      next[idx] = e.target.value;
                      setFormData((p) => ({ ...p, option1Items: next }));
                    }}
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        option1Items: p.option1Items.filter((_, i) => i !== idx),
                      }))
                    }
                    className="p-2 text-zinc-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Option 2 */}
          <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-blue-500/25 space-y-3">
            <label className={labelClass}>Option 02 Package Title</label>
            <input
              type="text"
              name="option2Title"
              value={formData.option2Title}
              onChange={handleChange}
              className={fieldClass}
            />
            <div className="flex justify-between items-center pt-2">
              <span className={labelClass}>Option 02 Items</span>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, option2Items: [...p.option2Items, ''] }))}
                className="text-[13px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData.option2Items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = [...formData.option2Items];
                      next[idx] = e.target.value;
                      setFormData((p) => ({ ...p, option2Items: next }));
                    }}
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        option2Items: p.option2Items.filter((_, i) => i !== idx),
                      }))
                    }
                    className="p-2 text-zinc-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workshop 5-Image Gallery Section */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-md border border-zinc-200 dark:border-blue-500/20 space-y-4">
        <h2 className="text-[15px] font-semibold border-b border-zinc-200 dark:border-blue-500/20 pb-3">Workshop Gallery (5 Images)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['image1', 'image2', 'image3', 'image4', 'image5'].map((imgKey, i) => (
            <div key={imgKey} className="p-3 border border-zinc-200 dark:border-blue-500/25 rounded-md space-y-2">
              <span className={labelClass}>Gallery Image {i + 1}</span>
              <ImageField
                value={formData[imgKey]}
                onChange={(url) => setFormData((p) => ({ ...p, [imgKey]: url }))}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}