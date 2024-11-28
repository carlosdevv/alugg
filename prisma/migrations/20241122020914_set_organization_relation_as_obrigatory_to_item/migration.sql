/*
  Warnings:

  - Made the column `organizationId` on table `inventory_items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_organizationId_fkey";

-- AlterTable
ALTER TABLE "inventory_items" ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
