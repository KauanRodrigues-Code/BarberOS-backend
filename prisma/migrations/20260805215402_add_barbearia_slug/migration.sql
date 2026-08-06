/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `barbearias` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "barbearias" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "barbearias_slug_key" ON "barbearias"("slug");
