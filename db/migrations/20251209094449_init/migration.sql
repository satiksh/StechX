/*
  Warnings:

  - The values [PENDING] on the enum `ContractStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [TALENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `advanceAmount` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContractStatus_new" AS ENUM ('PENDING_ADMIN_APPROVAL', 'PENDING_CLIENT_APPROVAL', 'ACTIVE', 'AWAITING_EXTENSION', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'REFUNDED');
ALTER TABLE "public"."Contract" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Contract" ALTER COLUMN "status" TYPE "ContractStatus_new" USING ("status"::text::"ContractStatus_new");
ALTER TYPE "ContractStatus" RENAME TO "ContractStatus_old";
ALTER TYPE "ContractStatus_new" RENAME TO "ContractStatus";
DROP TYPE "public"."ContractStatus_old";
ALTER TABLE "Contract" ALTER COLUMN "status" SET DEFAULT 'PENDING_ADMIN_APPROVAL';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'ESCROWED';
ALTER TYPE "PaymentStatus" ADD VALUE 'RELEASED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProjectStatus" ADD VALUE 'BIDDING';
ALTER TYPE "ProjectStatus" ADD VALUE 'BID_WON';
ALTER TYPE "ProjectStatus" ADD VALUE 'PENDING_ACCEPTANCE';
ALTER TYPE "ProjectStatus" ADD VALUE 'REJECTED_REOPEN_REQUESTED';

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'CLIENT', 'FREELANCER', 'AGENCY');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "adminApprovedAt" TIMESTAMP(3),
ADD COLUMN     "advanceAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "advancePercentage" DOUBLE PRECISION NOT NULL DEFAULT 30,
ADD COLUMN     "clientApprovedAt" TIMESTAMP(3),
ADD COLUMN     "estimatedDays" INTEGER,
ADD COLUMN     "extensionDays" INTEGER,
ADD COLUMN     "extensionReason" TEXT,
ADD COLUMN     "extensionRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleMeetLink" TEXT,
ADD COLUMN     "signedByClient" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signedByFreelancer" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'PENDING_ADMIN_APPROVAL';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "biddingEndsAt" TIMESTAMP(3),
ADD COLUMN     "customBudget" DOUBLE PRECISION,
ADD COLUMN     "lastRejectedAt" TIMESTAMP(3),
ADD COLUMN     "maxBidPrice" DOUBLE PRECISION,
ADD COLUMN     "rejectionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weekDeadline" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "isEscrowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "releasedAt" TIMESTAMP(3),
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'milestone';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileRating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Bid" (
    "id" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "freelancerId" UUID NOT NULL,
    "bidAmount" DOUBLE PRECISION NOT NULL,
    "proposedDays" INTEGER,
    "coverLetter" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "acceptanceDeadline" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bid_jobId_idx" ON "Bid"("jobId");

-- CreateIndex
CREATE INDEX "Bid_freelancerId_idx" ON "Bid"("freelancerId");

-- CreateIndex
CREATE INDEX "Bid_status_idx" ON "Bid"("status");

-- CreateIndex
CREATE INDEX "Bid_isWinner_idx" ON "Bid"("isWinner");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_jobId_freelancerId_key" ON "Bid"("jobId", "freelancerId");

-- CreateIndex
CREATE INDEX "Job_biddingEndsAt_idx" ON "Job"("biddingEndsAt");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
