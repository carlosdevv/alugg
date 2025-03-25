/*
  Warnings:

  - You are about to drop the column `addressId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_addressId_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "addressId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipcode" TEXT;

-- DropTable
DROP TABLE "Address";
