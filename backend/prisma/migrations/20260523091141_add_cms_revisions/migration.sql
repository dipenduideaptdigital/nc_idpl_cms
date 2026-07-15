-- CreateTable
CREATE TABLE `setting_revisions` (
    `id` VARCHAR(191) NOT NULL,
    `settingId` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `setting_revisions_settingId_idx`(`settingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `setting_revisions` ADD CONSTRAINT `setting_revisions_settingId_fkey` FOREIGN KEY (`settingId`) REFERENCES `settings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
