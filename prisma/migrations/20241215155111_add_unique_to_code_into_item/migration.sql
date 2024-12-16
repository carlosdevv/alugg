/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "items_code_key" ON "items"("code");
