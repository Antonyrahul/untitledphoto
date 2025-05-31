-- AlterTable
ALTER TABLE "Shot" ADD COLUMN     "awsOutputUrl" TEXT;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "plan" DROP NOT NULL;
