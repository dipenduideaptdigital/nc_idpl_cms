/*
  Warnings:

  - You are about to drop the column `formId` on the `contact_submissions` table. All the data in the column will be lost.
  - You are about to drop the `contact_forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact_submissions` DROP FOREIGN KEY `contact_submissions_formId_fkey`;

-- DropIndex
DROP INDEX `contact_submissions_formId_idx` ON `contact_submissions`;

-- AlterTable
ALTER TABLE `contact_submissions` DROP COLUMN `formId`;

-- DropTable
DROP TABLE `contact_forms`;
