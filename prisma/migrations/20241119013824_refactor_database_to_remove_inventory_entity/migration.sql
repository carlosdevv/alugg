/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `inventory_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `inventoryId` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_inactive` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the `inventories` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `id` on the `inventory_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_inventoryId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "inventoryId";

-- AlterTable
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_pkey",
DROP COLUMN "inventoryId",
DROP COLUMN "item_inactive",
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL,
ADD CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "inventories";

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
