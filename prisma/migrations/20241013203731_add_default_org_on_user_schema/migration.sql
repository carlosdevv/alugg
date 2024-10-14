-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defaultOrganization" TEXT;

-- CreateIndex
CREATE INDEX "users_defaultOrganization_idx" ON "users"("defaultOrganization");
