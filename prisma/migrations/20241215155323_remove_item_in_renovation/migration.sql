/*
  Warnings:

  - You are about to drop the column `item_in_renovation` on the `items` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'IN_REPAIR';

-- AlterTable
ALTER TABLE "items" DROP COLUMN "item_in_renovation";
