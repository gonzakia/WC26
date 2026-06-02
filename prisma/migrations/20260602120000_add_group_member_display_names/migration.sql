ALTER TABLE "GroupMember" ADD COLUMN "displayName" TEXT;

UPDATE "GroupMember"
SET "displayName" = (
  SELECT "User"."displayName"
  FROM "User"
  WHERE "User"."id" = "GroupMember"."userId"
)
WHERE "displayName" IS NULL;
