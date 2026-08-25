import cron from "node-cron";
import { prisma } from "../config/db.js";
import { logger } from "../config/logger.js";
import { systemStateStore } from "../shared/core/systemStateStore.js";

export const initPageJobs = () => {
  cron.schedule("* * * * *", async () => {
    const currentState = systemStateStore.get();
    if (!currentState || currentState.state !== "ACTIVE") return;

    try {
      const now = new Date();

      const scheduledPages = await prisma.page.findMany({
        where: { 
          status: "SCHEDULED", 
          scheduledUpdateAt: { lte: now }
        }
      });

      for (const page of scheduledPages) {
        await prisma.page.update({
          where: { id: page.id },
          data: { 
            status: "PUBLISHED",
            publishedAt: now,
            scheduledUpdateAt: null 
          }
        });
      }

      if (scheduledPages.length > 0) {
        logger.info(`Page Publisher: Automatically published ${scheduledPages.length} new scheduled pages.`);
      }


      const pendingUpdates = await prisma.page.findMany({
        where: { 
          status: "PUBLISHED", 
          scheduledUpdateAt: { lte: now }
        }
      });

      for (const page of pendingUpdates) {
        if (page.scheduledUpdateData) {
          const newData = page.scheduledUpdateData;
          
          await prisma.page.update({
            where: { id: page.id },
            data: {
              title: newData.title !== undefined ? newData.title : page.title,
              slug: newData.slug !== undefined ? newData.slug : page.slug,
              fullPath: newData.fullPath !== undefined ? newData.fullPath : page.fullPath,
              excerpt: newData.excerpt !== undefined ? newData.excerpt : page.excerpt,
              content: newData.content !== undefined ? newData.content : page.content,
              template: newData.template !== undefined ? newData.template : page.template,
              templateKey: newData.templateKey !== undefined ? newData.templateKey : page.templateKey,
              templateVersion: newData.templateVersion !== undefined ? newData.templateVersion : page.templateVersion,
              
              metaTitle: newData.metaTitle !== undefined ? newData.metaTitle : page.metaTitle,
              metaDescription: newData.metaDescription !== undefined ? newData.metaDescription : page.metaDescription,
              metaKeywords: newData.metaKeywords !== undefined ? newData.metaKeywords : page.metaKeywords,
              
              featuredImageId: newData.featuredImageId !== undefined ? newData.featuredImageId : page.featuredImageId,
              parentId: newData.parentId !== undefined ? newData.parentId : page.parentId,
              menuOrder: newData.menuOrder !== undefined ? newData.menuOrder : page.menuOrder,
              showInMenu: newData.showInMenu !== undefined ? newData.showInMenu : page.showInMenu,
              
              includeInSitemap: newData.includeInSitemap !== undefined ? newData.includeInSitemap : page.includeInSitemap,
              noIndex: newData.noIndex !== undefined ? newData.noIndex : page.noIndex,
              noFollow: newData.noFollow !== undefined ? newData.noFollow : page.noFollow,
              canonicalUrl: newData.canonicalUrl !== undefined ? newData.canonicalUrl : page.canonicalUrl,
              ogTitle: newData.ogTitle !== undefined ? newData.ogTitle : page.ogTitle,
              ogDescription: newData.ogDescription !== undefined ? newData.ogDescription : page.ogDescription,
              ogImageId: newData.ogImageId !== undefined ? newData.ogImageId : page.ogImageId,
              
              scheduledUpdateData: null,
              scheduledUpdateAt: null,
              updatedAt: new Date()
            }
          });

          // Create a revision snapshot safely
          await prisma.pageRevision.create({
            data: {
              pageId: page.id,
              snapshot: newData,
              actorId: page.updatedById || null
            }
          });
        } else {
          await prisma.page.update({
            where: { id: page.id },
            data: { scheduledUpdateAt: null }
          });
        }
      }

      if (pendingUpdates.length > 0) {
        logger.info(`Page Publisher: Applied scheduled updates to ${pendingUpdates.length} existing live pages.`);
      }

    } catch (err) {
      logger.error("Page Publisher Job Failed", err);
    }
  });
};