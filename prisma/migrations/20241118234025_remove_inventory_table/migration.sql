/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the `inventories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_inventoryId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "inventoryId";

-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "inventoryId",
ADD COLUMN     "organizationId" TEXT;

-- DropTable
DROP TABLE "inventories";

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
