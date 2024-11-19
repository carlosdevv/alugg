/*
  Warnings:

  - Added the required column `slug` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "slug" TEXT NOT NULL;
