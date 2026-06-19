-- AlterTable
ALTER TABLE `blogs` ADD COLUMN `canonicalUrl` TEXT NULL,
    ADD COLUMN `includeInSitemap` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `noFollow` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `noIndex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` TEXT NULL,
    ADD COLUMN `ogImageId` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pages` ADD COLUMN `canonicalUrl` TEXT NULL,
    ADD COLUMN `includeInSitemap` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `noFollow` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `noIndex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` TEXT NULL,
    ADD COLUMN `ogImageId` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `page_path_histories` (
    `id` VARCHAR(191) NOT NULL,
    `pageId` VARCHAR(191) NOT NULL,
    `oldFullPath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `page_path_histories_oldFullPath_key`(`oldFullPath`),
    INDEX `page_path_histories_pageId_idx`(`pageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_slug_histories` (
    `id` VARCHAR(191) NOT NULL,
    `blogId` VARCHAR(191) NOT NULL,
    `oldSlug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `blog_slug_histories_oldSlug_key`(`oldSlug`),
    INDEX `blog_slug_histories_blogId_idx`(`blogId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `blogs_includeInSitemap_idx` ON `blogs`(`includeInSitemap`);

-- CreateIndex
CREATE INDEX `pages_includeInSitemap_idx` ON `pages`(`includeInSitemap`);

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_ogImageId_fkey` FOREIGN KEY (`ogImageId`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_path_histories` ADD CONSTRAINT `page_path_histories_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_ogImageId_fkey` FOREIGN KEY (`ogImageId`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_slug_histories` ADD CONSTRAINT `blog_slug_histories_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
