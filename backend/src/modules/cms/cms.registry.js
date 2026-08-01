import { 
  // ---- GLOBAL SETTINGS SCHEMAS ----
  generalSettingsSchema,
  cmsSettingsSchema,
  whatsappSettingsSchema,
  globalGeneralSettingsSchema,
  footerSchema,
  
  // ---- NATURE CUBE SCHEMAS ----
  ncHeroSchema,
  ncMandalasSchema,
  ncLivingArtSchema,
  ncShowcaseSchema,
  ncPlantDisplaySchema,
  ncServicesSchema,
  ncPartnersSchema,
  ncBlogsSchema,
  ncWhatTheySaySchema,
  ncCtaSchema
} from "./cms.validation.js";

export const CMS_REGISTRY = {
  // GLOBAL SETTINGS
  "homepage_general": generalSettingsSchema,
  "homepage_footer": footerSchema,
  "cms_settings": cmsSettingsSchema,
  "whatsapp_settings": whatsappSettingsSchema,
  "global_general_settings": globalGeneralSettingsSchema,
  // NEW NATURE CUBE SECTIONS
  "nc_homepage_hero": ncHeroSchema,
  "nc_homepage_mandalas": ncMandalasSchema,
  "nc_homepage_living_art": ncLivingArtSchema,
  "nc_homepage_showcase": ncShowcaseSchema,
  "nc_homepage_plant_display": ncPlantDisplaySchema,
  "nc_homepage_services": ncServicesSchema,
  "nc_homepage_partners": ncPartnersSchema,
  "nc_homepage_blogs": ncBlogsSchema,
  "nc_homepage_what_they_say": ncWhatTheySaySchema,
  "nc_homepage_cta": ncCtaSchema
};