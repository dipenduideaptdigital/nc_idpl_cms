/*
  Warnings:

  - You are about to drop the column `area` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `bulletPoints` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `spaces` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `projects` DROP COLUMN `area`,
    DROP COLUMN `bulletPoints`,
    DROP COLUMN `client`,
    DROP COLUMN `spaces`,
    ADD COLUMN `galleryImages` JSON NULL,
    ADD COLUMN `heroImageId` VARCHAR(191) NULL,
    ADD COLUMN `specifications` VARCHAR(191) NULL,
    ADD COLUMN `subtitle` TEXT NULL;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_heroImageId_fkey` FOREIGN KEY (`heroImageId`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
