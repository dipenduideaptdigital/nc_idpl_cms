export const generateDefaultContent = (templateConfig) => {
  if (!templateConfig || !Array.isArray(templateConfig.sections)) {
    return { content: {}, design: {} }; // Return V2 structure wrapper
  }

  const defaultState = {
    content: {},
    design: {}
  };

  templateConfig.sections.forEach(section => {
    if (!section?.key) return;

    // Initialize section objects
    defaultState.content[section.key] = {};
    defaultState.design[section.key] = {};

    // Generate Default Content
    if (Array.isArray(section.contentFields)) {
      section.contentFields.forEach(field => {
        if (!field?.key) return;
        defaultState.content[section.key][field.key] = field.defaultValue !== undefined ? field.defaultValue : '';
      });
    }

    // Generate Default Design/Theme configuration
    if (Array.isArray(section.designFields)) {
      section.designFields.forEach(field => {
        if (!field?.key) return;
        defaultState.design[section.key][field.key] = field.defaultValue !== undefined ? field.defaultValue : '';
      });
    }
  });

  return defaultState;
};