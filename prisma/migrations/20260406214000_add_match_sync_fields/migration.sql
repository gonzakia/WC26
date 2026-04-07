ALTER TABLE "Match" ADD COLUMN "externalMatchId" TEXT;
ALTER TABLE "Match" ADD COLUMN "source" TEXT;
ALTER TABLE "Match" ADD COLUMN "groupName" TEXT;
ALTER TABLE "Match" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'SCHEDULED';
ALTER TABLE "Match" ADD COLUMN "sourceUpdatedAt" DATETIME;
ALTER TABLE "Match" ADD COLUMN "syncedAt" DATETIME;

CREATE UNIQUE INDEX "Match_externalMatchId_key" ON "Match"("externalMatchId");
