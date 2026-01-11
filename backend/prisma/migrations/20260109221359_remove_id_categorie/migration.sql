/*
  Warnings:

  - You are about to drop the column `idCategorie` on the `produs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Produs_idCategorie_fkey` ON `produs`;

-- AlterTable
ALTER TABLE `produs` DROP COLUMN `idCategorie`;
