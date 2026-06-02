-- CreateTable
CREATE TABLE `contact_forms` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `successMessage` VARCHAR(191) NULL DEFAULT 'Thank you! Your submission has been successfully processed.',
    `redirectUrl` VARCHAR(191) NULL,
    `notifyEmails` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `contact_forms_slug_key`(`slug`),
    INDEX `contact_forms_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `messageHash` VARCHAR(64) NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `sourcePage` VARCHAR(191) NULL,
    `isViewed` BOOLEAN NOT NULL DEFAULT false,
    `formId` VARCHAR(191) NOT NULL,
    `assignedToId` VARCHAR(191) NULL,
    `resolvedAt` DATETIME(3) NULL,
    `spamScore` INTEGER NOT NULL DEFAULT 0,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `fingerprint` VARCHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `contact_submissions_formId_idx`(`formId`),
    INDEX `contact_submissions_status_idx`(`status`),
    INDEX `contact_submissions_createdAt_idx`(`createdAt`),
    INDEX `contact_submissions_email_idx`(`email`),
    INDEX `contact_submissions_fingerprint_idx`(`fingerprint`),
    INDEX `contact_submissions_messageHash_idx`(`messageHash`),
    INDEX `contact_submissions_deletedAt_idx`(`deletedAt`),
    INDEX `contact_submissions_isViewed_idx`(`isViewed`),
    INDEX `contact_submissions_assignedToId_idx`(`assignedToId`),
    INDEX `contact_submissions_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_submission_logs` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `fromStatus` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM', 'ARCHIVED') NOT NULL,
    `toStatus` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM', 'ARCHIVED') NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_submission_logs_submissionId_idx`(`submissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_internal_notes` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `note` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_internal_notes_submissionId_idx`(`submissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact_submissions` ADD CONSTRAINT `contact_submissions_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `contact_forms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_submissions` ADD CONSTRAINT `contact_submissions_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_submission_logs` ADD CONSTRAINT `contact_submission_logs_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `contact_submissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_submission_logs` ADD CONSTRAINT `contact_submission_logs_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_internal_notes` ADD CONSTRAINT `contact_internal_notes_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `contact_submissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_internal_notes` ADD CONSTRAINT `contact_internal_notes_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
