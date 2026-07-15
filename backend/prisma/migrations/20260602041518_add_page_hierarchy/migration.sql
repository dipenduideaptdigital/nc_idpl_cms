/*
  Warnings:

  - A unique constraint covering the columns `[fullPath]` on the table `pages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId,slug,deletedAt]` on the table `pages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullPath` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `pages_slug_key` ON `pages`;

-- AlterTable
ALTER TABLE `pages` ADD COLUMN `fullPath` VARCHAR(191) NOT NULL,
    ADD COLUMN `menuOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `parentId` VARCHAR(191) NULL,
    ADD COLUMN `showInMenu` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `pages_fullPath_key` ON `pages`(`fullPath`);

-- CreateIndex
CREATE INDEX `pages_fullPath_idx` ON `pages`(`fullPath`);

-- CreateIndex
CREATE INDEX `pages_parentId_idx` ON `pages`(`parentId`);

-- CreateIndex
CREATE UNIQUE INDEX `pages_parentId_slug_deletedAt_key` ON `pages`(`parentId`, `slug`, `deletedAt`);

-- AddForeignKey
ALTER TABLE `pages` ADD CONSTRAINT `pages_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `pages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
