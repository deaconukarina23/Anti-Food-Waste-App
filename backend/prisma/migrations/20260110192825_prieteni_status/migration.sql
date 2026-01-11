/*
  Warnings:

  - You are about to drop the column `tip` on the `prieten` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `prieten` DROP COLUMN `tip`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'In asteptare';
