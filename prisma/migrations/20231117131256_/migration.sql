/*
  Warnings:

  - Added the required column `name` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `place` ADD COLUMN `name` VARCHAR(255) NOT NULL;
