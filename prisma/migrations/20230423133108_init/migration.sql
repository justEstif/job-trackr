/*
  Warnings:

  - You are about to drop the column `description` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `home_url` on the `company` table. All the data in the column will be lost.
  - Added the required column `source` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" DROP COLUMN "description",
DROP COLUMN "home_url";

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "source" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "notify_date" SET DEFAULT NOW() + '14';
