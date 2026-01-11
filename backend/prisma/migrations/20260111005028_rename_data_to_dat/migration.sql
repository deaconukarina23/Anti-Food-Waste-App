/*
  Warnings:

  - You are about to drop the column `data` on the `produs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `produs` DROP COLUMN `data`,
    ADD COLUMN `dat` BOOLEAN NOT NULL DEFAULT false;
