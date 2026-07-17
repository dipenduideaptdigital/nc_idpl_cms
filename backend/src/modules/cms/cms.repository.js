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

    if (existingSetting) {
      await tx.settingRevision.create({
        data: {
          settingId: existingSetting.id,
          value: existingSetting.value, 
          actorId: actorUserId,
        }
      });
    }

    const updatedSetting = await tx.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return updatedSetting;
  }, 
  {
    maxWait: 5000, 
    timeout: 20000 
  });
};