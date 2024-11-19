/*
  Warnings:

  - Made the column `inventoryId` on table `inventory_items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_inventoryId_fkey";

-- AlterTable
ALTER TABLE "inventory_items" ALTER COLUMN "inventoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
