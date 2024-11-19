/*
  Warnings:

  - The primary key for the `inventory_items` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id");
