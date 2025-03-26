/*
  Warnings:

  - You are about to drop the column `isCourtesy` on the `contract_items` table. All the data in the column will be lost.
  - You are about to drop the column `isFixedDiscount` on the `contract_items` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `contract_items` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `contract_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `contractId` on table `contract_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `return_date` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `withdrawal_date` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractDocumentType" AS ENUM ('WITHDRAWAL', 'INVOICE', 'RETURN', 'OTHER');

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_contractId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "contract_items" DROP CONSTRAINT "contract_items_contractId_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_customerId_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_userId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_contractId_fkey";

-- AlterTable
ALTER TABLE "contract_items" DROP COLUMN "isCourtesy",
DROP COLUMN "isFixedDiscount",
DROP COLUMN "price",
ADD COLUMN     "isBonus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "contractId" SET NOT NULL;

-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "end_date",
DROP COLUMN "name",
DROP COLUMN "start_date",
DROP COLUMN "userId",
ADD COLUMN     "additional_information" TEXT,
ADD COLUMN     "return_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL,
ADD COLUMN     "withdrawal_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN',
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "contract_days_after" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "contract_days_before" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "payments";

-- DropEnum
DROP TYPE "DocumentType";

-- CreateTable
CREATE TABLE "contract_payments" (
    "id" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "credit_parcel_amount" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contractId" TEXT NOT NULL,

    CONSTRAINT "contract_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_documents" (
    "id" TEXT NOT NULL,
    "type" "ContractDocumentType" NOT NULL DEFAULT 'INVOICE',
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT NOT NULL,

    CONSTRAINT "contract_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_items" ADD CONSTRAINT "contract_items_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_payments" ADD CONSTRAINT "contract_payments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_documents" ADD CONSTRAINT "contract_documents_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
