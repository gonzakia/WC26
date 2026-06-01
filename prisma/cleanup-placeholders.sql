BEGIN;

DELETE FROM "Prediction"
WHERE "matchId" IN (
  SELECT "id"
  FROM "Match"
  WHERE "slug" IN (
    'mexico-vs-japan-2026-06-11',
    'united-states-vs-ghana-2026-06-12'
  )
);

DELETE FROM "Match"
WHERE "slug" IN (
  'mexico-vs-japan-2026-06-11',
  'united-states-vs-ghana-2026-06-12'
);

COMMIT;
