-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_talentId_fkey";

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "talentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
