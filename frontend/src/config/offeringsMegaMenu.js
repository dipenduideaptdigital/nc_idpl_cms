export const MEGA_MENU_KEY = 'global_offerings_mega_menu';
export const DEFAULT_MEGA_MENU = {
  label: 'OFFERINGS',
  headingLine1: 'Lorem Ipsum Dolor',
  headingLine2: 'Sit Amet, Consectetur',
  description: "Liquid landscapes mirrored in mindful art,\na living mandala's heart.",
  tagline: 'RESET . RENEW . REBUILD',
  ripple: { title: 'Ripple', image: '', href: '' },
  gulmo: { title: 'Gulmo', image: '', href: '' },
  prakriti: { title: 'Prakriti LAB', image: '', href: '', description: 'Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments.' },
};

export function mergeMegaMenu(content) {
  const source = content && typeof content === 'object' ? content : {};
  const merge = (defaults, values) => Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => {
    const value = values?.[key];
    return [key, typeof fallback === 'object' ? merge(fallback, value) : typeof value === 'string' && value.trim() ? value : fallback];
  }));
  return merge(DEFAULT_MEGA_MENU, source);
}
