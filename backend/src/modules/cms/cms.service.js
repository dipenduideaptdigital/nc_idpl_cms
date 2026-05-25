import { findSettingByKey, upsertSetting } from "./cms.repository.js";

// Get setting, fallback to empty object if not found
export const getHomepageSection = async (key) => {
  const setting = await findSettingByKey(key);
  return setting ? setting.value : { content: {} }; 
};

// Update setting (Pass the actorUserId for future audit/versioning)
export const updateHomepageSection = async (key, value, actorUserId) => {
  const updatedSetting = await upsertSetting(key, value, actorUserId);
  return updatedSetting.value;
};