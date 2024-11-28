-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
