/*
  Warnings:

  - You are about to drop the column `slug` on the `inventories` table. All the data in the column will be lost.
  - Added the required column `name` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "slug",
ADD COLUMN     "name" TEXT NOT NULL;
