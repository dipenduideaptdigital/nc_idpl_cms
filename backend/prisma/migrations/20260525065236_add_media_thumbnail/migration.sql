-- AlterTable
ALTER TABLE `media` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `thumbnailUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `media_deletedAt_idx` ON `media`(`deletedAt`);
