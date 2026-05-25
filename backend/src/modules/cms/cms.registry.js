import { 
  heroSchema, 
  servicesSchema, 
  aboutSchema 
} from "./cms.validation.js";

//  Maps frontend section keys to backend validation schemas
export const CMS_REGISTRY = {
  "homepage_hero": heroSchema,
  "homepage_services": servicesSchema,
  "homepage_about": aboutSchema,
  
  // "footer_settings": footerSchema,
  // "about_team": teamSchema,
  // "contact_info": contactSchema
};