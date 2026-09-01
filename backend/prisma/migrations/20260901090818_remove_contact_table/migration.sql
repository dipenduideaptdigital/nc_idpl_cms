/*
  Warnings:

  - You are about to drop the `contact_internal_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact_submission_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact_submissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact_internal_notes` DROP FOREIGN KEY `contact_internal_notes_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `contact_internal_notes` DROP FOREIGN KEY `contact_internal_notes_submissionId_fkey`;

-- DropForeignKey
ALTER TABLE `contact_submission_logs` DROP FOREIGN KEY `contact_submission_logs_actorId_fkey`;

-- DropForeignKey
ALTER TABLE `contact_submission_logs` DROP FOREIGN KEY `contact_submission_logs_submissionId_fkey`;

-- DropForeignKey
ALTER TABLE `contact_submissions` DROP FOREIGN KEY `contact_submissions_assignedToId_fkey`;

-- DropTable
DROP TABLE `contact_internal_notes`;

-- DropTable
DROP TABLE `contact_submission_logs`;

-- DropTable
DROP TABLE `contact_submissions`;
