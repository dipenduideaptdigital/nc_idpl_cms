import React from 'react';
import ImageField from '../ImageField';

const LearnTogetherCustomization = ({ data, setData }) => {
  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fieldClass = "w-full mt-1 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm transition-colors";
  const labelClass = "block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold border-b border-zinc-200 dark:border-zinc-800 pb-3 text-zinc-900 dark:text-zinc-100">
        Learn Together Section
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Tagline</label>
          <input
            type="text"
            value={data.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="learn together"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Main Title (Uppercase)</label>
          <input
            type="text"
            value={data.mainTitle || ''}
            onChange={(e) => handleChange('mainTitle', e.target.value)}
            placeholder="LIVING"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Italic Title (Green)</label>
          <input
            type="text"
            value={data.italicTitle || ''}
            onChange={(e) => handleChange('italicTitle', e.target.value)}
            placeholder="art"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={`${labelClass} mb-2`}>Box Logo / Image (Optional)</label>
        <ImageField
          value={data.logoImage || ''}
          onChange={(url) => handleChange('logoImage', url)}
        />
      </div>

      <div>
        <label className={labelClass}>Sub-Headline</label>
        <textarea
          rows="2"
          value={data.subHeadline || ''}
          onChange={(e) => handleChange('subHeadline', e.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Paragraph Description</label>
        <textarea
          rows="3"
          value={data.paragraph || ''}
          onChange={(e) => handleChange('paragraph', e.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Button Text</label>
          <input
            type="text"
            value={data.buttonText || ''}
            onChange={(e) => handleChange('buttonText', e.target.value)}
            placeholder="explore the art"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Button Link</label>
          <input
            type="text"
            value={data.buttonLink || ''}
            onChange={(e) => handleChange('buttonLink', e.target.value)}
            placeholder="/explore"
            className={fieldClass}
          />
        </div>
      </div>
    </div>
  );
};

export default LearnTogetherCustomization;