import { prisma } from "../../config/db.js";

export const findSettingByKey = async (key) => {
  return await prisma.setting.findUnique({
    where: { key },
  });
};

export const upsertSetting = async (key, value, actorUserId = null) => {
  return await prisma.$transaction(async (tx) => {
    const existingSetting = await tx.setting.findUnique({
      where: { key },
    });

    // If it already exists, archive the OLD value into the Revision history
    // This ensures we always have the exact snapshot of what it was before this update
    if (existingSetting) {
      await tx.settingRevision.create({
        data: {
          settingId: existingSetting.id,
          value: existingSetting.value, 
          actorId: actorUserId,
        }
      });
    }

    // Now perform the upsert to save the NEW value in the main table
    const updatedSetting = await tx.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return updatedSetting;
  });
};