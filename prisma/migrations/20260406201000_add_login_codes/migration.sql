-- CreateTable
CREATE TABLE "LoginCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "displayNameHint" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginCode_codeHash_key" ON "LoginCode"("codeHash");

-- CreateIndex
CREATE INDEX "LoginCode_email_idx" ON "LoginCode"("email");
