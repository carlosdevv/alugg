/*
  Warnings:

  - The `item_inactive` column on the `inventory_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "item_inactive",
ADD COLUMN     "item_inactive" "Status" NOT NULL DEFAULT 'ACTIVE';
