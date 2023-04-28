-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "notify_date" SET DEFAULT NOW() + interval '14 day';
