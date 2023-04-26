-- DropIndex
DROP INDEX "company_id_key";

-- DropIndex
DROP INDEX "job_id_key";

-- DropIndex
DROP INDEX "notification_id_key";

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "notify_date" SET DEFAULT NOW() + interval '14 day';
