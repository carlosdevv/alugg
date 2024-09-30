/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `stock_items` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password_hash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "stock_items" DROP CONSTRAINT "stock_items_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "stock_items" DROP CONSTRAINT "stock_items_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "stock_items" DROP CONSTRAINT "stock_items_owner_id_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "inventoryId" TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "avatar_url";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_url",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password_hash" SET NOT NULL;

-- DropTable
DROP TABLE "stock_items";

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "object_price" DOUBLE PRECISION NOT NULL,
    "rent_price" DOUBLE PRECISION NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "item_in_renovation" BOOLEAN NOT NULL DEFAULT false,
    "item_inactive" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT,
    "categoryId" TEXT NOT NULL,
    "inventoryId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
