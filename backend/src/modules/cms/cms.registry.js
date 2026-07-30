import { 
  heroSchema, 
  servicesSchema, 
  aboutSchema,
  ourServicesSchema,
  howWeWorkSchema,
  ourProjectsSchema,
  panoramasSchema,
  teamSchema,
  testimonialsSchema,
  videoBannerSchema,
  blogSectionSchema,
  gallerySchema,
  ctaSchema,
  generalSettingsSchema,
  cmsSettingsSchema,
  whatsappSettingsSchema,
  footerSchema,
  
  // ----NATURE CUBE SCHEMAS ----
  ncHeroSchema,
  ncMandalasSchema,
  ncLivingArtSchema,
  ncShowcaseSchema,
  ncPlantDisplaySchema,
  ncServicesSchema,
  ncPartnersSchema
} from "./cms.validation.js";

// Maps frontend section keys to backend validation schemas
export const CMS_REGISTRY = {
  // EXISTING SUBHAKRITEE SECTIONS
  "homepage_hero": heroSchema,
  "homepage_services": servicesSchema,
  "homepage_about": aboutSchema,
  "homepage_our_services": ourServicesSchema,
  "homepage_how_we_work": howWeWorkSchema,
  "homepage_our_projects": ourProjectsSchema,
  "homepage_panoramas": panoramasSchema,
  "homepage_team": teamSchema,
  "homepage_testimonials": testimonialsSchema,
  "homepage_video_banner": videoBannerSchema,
  "homepage_blog_section": blogSectionSchema,
  "homepage_gallery": gallerySchema,
  "homepage_cta": ctaSchema,
  "homepage_general": generalSettingsSchema,
  "homepage_footer": footerSchema,
  "cms_settings": cmsSettingsSchema,
  "whatsapp_settings": whatsappSettingsSchema,

  // NEW NATURE CUBE SECTIONS
  "nc_homepage_hero": ncHeroSchema,
  "nc_homepage_mandalas": ncMandalasSchema,
  "nc_homepage_living_art": ncLivingArtSchema,
  "nc_homepage_showcase": ncShowcaseSchema,
  "nc_homepage_plant_display": ncPlantDisplaySchema,
  "nc_homepage_services": ncServicesSchema,
  "nc_homepage_partners": ncPartnersSchema
};