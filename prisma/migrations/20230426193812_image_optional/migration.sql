-- AlterTable
ALTER TABLE "company" ALTER COLUMN "image_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "notify_date" SET DEFAULT NOW() + interval '14 day';
