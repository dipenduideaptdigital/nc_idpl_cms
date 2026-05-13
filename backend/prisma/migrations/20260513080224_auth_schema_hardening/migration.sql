/*
  Warnings:

  - You are about to drop the column `invitedById` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_invitedById_fkey`;

-- DropIndex
DROP INDEX `admin_invitations_email_key` ON `admin_invitations`;

-- DropIndex
DROP INDEX `users_invitedById_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `invitedById`;

-- CreateIndex
CREATE INDEX `admin_invitations_email_idx` ON `admin_invitations`(`email`);

-- CreateIndex
CREATE INDEX `admin_invitations_expiresAt_idx` ON `admin_invitations`(`expiresAt`);

-- CreateIndex
CREATE INDEX `password_reset_tokens_expiresAt_idx` ON `password_reset_tokens`(`expiresAt`);

-- CreateIndex
CREATE INDEX `refresh_tokens_expiresAt_idx` ON `refresh_tokens`(`expiresAt`);

-- CreateIndex
CREATE INDEX `refresh_tokens_revokedAt_idx` ON `refresh_tokens`(`revokedAt`);

-- RenameIndex
ALTER TABLE `refresh_tokens` RENAME INDEX `refresh_tokens_userId_fkey` TO `refresh_tokens_userId_idx`;
