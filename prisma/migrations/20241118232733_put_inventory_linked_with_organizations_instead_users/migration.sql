/*
  Warnings:

  - You are about to drop the column `owner_id` on the `inventories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_owner_id_fkey";

-- DropIndex
DROP INDEX "inventories_owner_id_key";

-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "owner_id",
ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "inventories_organizationId_key" ON "inventories"("organizationId");

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
