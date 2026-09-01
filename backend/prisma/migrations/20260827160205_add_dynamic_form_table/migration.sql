-- CreateTable
CREATE TABLE `dynamic_forms` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `schema` JSON NOT NULL,
    `settings` JSON NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `dynamic_forms_slug_key`(`slug`),
    INDEX `dynamic_forms_status_idx`(`status`),
    INDEX `dynamic_forms_slug_idx`(`slug`),
    INDEX `dynamic_forms_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `form_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `formId` VARCHAR(191) NOT NULL,
    `formVersion` INTEGER NOT NULL,
    `payload` JSON NOT NULL,
    `isViewed` BOOLEAN NOT NULL DEFAULT false,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `fingerprint` VARCHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `form_submissions_formId_idx`(`formId`),
    INDEX `form_submissions_fingerprint_idx`(`fingerprint`),
    INDEX `form_submissions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dynamic_forms` ADD CONSTRAINT `dynamic_forms_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dynamic_forms` ADD CONSTRAINT `dynamic_forms_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `dynamic_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
