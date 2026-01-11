/*
  Warnings:

  - You are about to drop the `categorie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categorie` to the `Produs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `produs` DROP FOREIGN KEY `Produs_idCategorie_fkey`;

-- AlterTable
ALTER TABLE `produs` ADD COLUMN `categorie` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `categorie`;
