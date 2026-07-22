/*
  Warnings:

  - A unique constraint covering the columns `[fileHash]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `media` ADD COLUMN `fileHash` VARCHAR(64) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `media_fileHash_key` ON `media`(`fileHash`);
