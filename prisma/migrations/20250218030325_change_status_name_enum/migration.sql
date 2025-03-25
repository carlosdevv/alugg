/*
  Warnings:

  - The `status` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'AVALIABLE', 'IN_USE', 'IN_REPAIR');

-- AlterTable
ALTER TABLE "items" DROP COLUMN "status",
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "Status";
