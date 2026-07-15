/*
  Warnings:

  - You are about to drop the column `token` on the `admin_invitations` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `password_reset_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenHash]` on the table `admin_invitations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tokenHash]` on the table `password_reset_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenHash` to the `admin_invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHash` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `admin_invitations_token_key` ON `admin_invitations`;

-- DropIndex
DROP INDEX `password_reset_tokens_token_key` ON `password_reset_tokens`;

-- AlterTable
ALTER TABLE `admin_invitations` DROP COLUMN `token`,
    ADD COLUMN `tokenHash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `password_reset_tokens` DROP COLUMN `token`,
    ADD COLUMN `tokenHash` VARCHAR(191) NOT NULL,
    ADD COLUMN `usedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `admin_invitations_tokenHash_key` ON `admin_invitations`(`tokenHash`);

-- CreateIndex
CREATE UNIQUE INDEX `password_reset_tokens_tokenHash_key` ON `password_reset_tokens`(`tokenHash`);
