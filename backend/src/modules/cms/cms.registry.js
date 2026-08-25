import {   
  // ---- GLOBAL SETTINGS SCHEMAS ----
  generalSettingsSchema,
  cmsSettingsSchema,
  whatsappSettingsSchema,
  globalGeneralSettingsSchema,
  footerSchema,
  contactRoutingSettingsSchema,
  ncContactPageSchema,

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
  ncCtaSchema,

  // ---- GULMO PAGE SCHEMAS ----
  gulmoHeroSchema,
  gulmoTerrariumSchema,
  gulmoQuoteSchema,
  gulmoForestOrganismSchema,
  gulmoOurProjectsSchema,
  gulmoLetsBeginSchema,
  gulmoConceptSchema,
  headerMenuSchema
} from "./cms.validation.js";

export const CMS_REGISTRY = {
  // GLOBAL SETTINGS
  "global_header_menu": headerMenuSchema,
  "homepage_general": generalSettingsSchema,
  "homepage_footer": footerSchema,
  "cms_settings": cmsSettingsSchema,
  "whatsapp_settings": whatsappSettingsSchema,
  "global_general_settings": globalGeneralSettingsSchema,
  "contact_routing_settings": contactRoutingSettingsSchema,
  "nc_contact_page": ncContactPageSchema,
  
  // NATURE CUBE SECTIONS
  "nc_homepage_hero": ncHeroSchema,
  "nc_homepage_mandalas": ncMandalasSchema,
  "nc_homepage_living_art": ncLivingArtSchema,
  "nc_homepage_showcase": ncShowcaseSchema,
  "nc_homepage_plant_display": ncPlantDisplaySchema,
  "nc_homepage_services": ncServicesSchema,
  "nc_homepage_partners": ncPartnersSchema,
  "nc_homepage_blogs": ncBlogsSchema,
  "nc_homepage_what_they_say": ncWhatTheySaySchema,
  "nc_homepage_cta": ncCtaSchema,

  // GULMO SECTIONS
  "gulmo_hero": gulmoHeroSchema,
  "gulmo_terrarium": gulmoTerrariumSchema,
  "gulmo_quote": gulmoQuoteSchema,
  "gulmo_forest_organism": gulmoForestOrganismSchema,
  "gulmo_our_projects": gulmoOurProjectsSchema,
  "gulmo_lets_begin": gulmoLetsBeginSchema,
  "gulmo_concept": gulmoConceptSchema
};