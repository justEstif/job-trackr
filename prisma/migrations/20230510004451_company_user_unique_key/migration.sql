/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name]` on the table `company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "company_name_key";

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "notify_date" SET DEFAULT NOW() + interval '14 day';

-- CreateIndex
CREATE UNIQUE INDEX "company_user_id_name_key" ON "company"("user_id", "name");
