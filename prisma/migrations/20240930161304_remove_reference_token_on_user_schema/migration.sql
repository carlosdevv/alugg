/*
  Warnings:

  - You are about to drop the column `user_id` on the `tokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "user_id",
ADD COLUMN     "code" TEXT,
ADD COLUMN     "email" TEXT;
