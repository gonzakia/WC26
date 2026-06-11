# WC26 Predictions

WC26 Predictions is a full-stack Next.js app for private 2026 FIFA World Cup
prediction groups. Users can register or log in with a one-time email code,
join one or more private groups, make score predictions for each group, and
compete on group-specific leaderboards.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- Postgres for production
- Resend for one-time sign-in emails
- football-data.org for fixture and result sync

## Current Features

- Passwordless login and registration with one-time verification codes.
- Private group creation and invite-code based joining.
- Group owner tools for removing members, transferring ownership, and deleting
  groups.
- Member self-service for leaving a group.
- Group-specific display names through `GroupMember.displayName`.
- Separate predictions per group, so the same user can make different picks in
  different groups.
- Match browsing by date, group stage, and knockout stage.
- Live group-overview prediction reveal for matches that are ongoing or just
  finished.
- Localized English and Spanish UI.
- Locale-aware routes such as `/es`, `/es/sign-in`, and `/es/register`.
- Clean auth routes: `/sign-in` for login and `/register` for registration.
- Save confirmation feedback after submitting a prediction.
- Upcoming match snapshots using local display time.
- Manual result entry on the admin results page.
- football-data.org sync route for fixtures and confirmed results.
- Live-score sync route for in-progress match scores.
- Manual venue mapping for matches whose venue is not available from the data
  provider.

## Prediction Rules

Scoring is intentionally simple:

- Exact score: 3 points.
- Correct winner or draw, but not exact score: 1 point.
- Wrong outcome: 0 points.

Prediction deadlines:

- Each match locks at its own kickoff time.

Points are recalculated from stored predictions whenever confirmed match results
are entered or synced.

## Routing And Language

Language is controlled by both the URL and the stored locale cookie.

- `/` uses the saved language cookie, or English by default.
- `/es` forces Spanish and stores Spanish in the locale cookie.
- `/sign-in` shows the login flow.
- `/register` rewrites internally to the registration version of `/sign-in`.
- `/es/sign-in` and `/es/register` combine the language prefix with the auth
  flow.

The middleware in `middleware.ts` handles locale prefixes, the register rewrite,
and the `x-wc26-locale` request header used by `lib/i18n.ts`.

## Data Model

The Prisma schema currently includes:

- `User`
- `LoginCode`
- `Session`
- `Group`
- `GroupMember`
- `Match`
- `Prediction`

Important details:

- `User.displayName` is the account-level display name.
- `GroupMember.displayName` is the name shown inside a specific group.
- `Prediction` is unique per user, group, and match.
- `Match.externalMatchId`, `source`, `sourceUpdatedAt`, and `syncedAt` support
  fixture/result syncing.

## Match Data

Matches are stored in the `Match` table and can be seeded locally with:

```bash
npm run prisma:seed
```

The app can also sync fixtures and results from football-data.org:

- Admin UI: `/admin/results`
- Scheduled full sync route: `/api/cron/sync-world-cup` once daily
- Scheduled Vercel cron route: `/api/cron/sync-live-scores` once per minute
- Authenticated live refresh route: `/api/live-scores`

Confirmed results automatically update prediction points.
Live scores are stored while a match is in progress, but points are only awarded
after the result is confirmed.

## Manual Venues

Manual venue data lives in `lib/manual-venues.ts`.

Use this file when football-data.org does not provide venue data. The workflow is:

1. Add each stadium once in the `venues` object.
2. Map each manual game ID to a venue ID in `matchVenueIds`.

Manual game IDs are not football-data.org IDs and are not database IDs. They are
stable local IDs based on the tournament schedule:

- `gs-1` through `gs-72`
- `r32-1` through `r32-16`
- `r16-1` through `r16-8`
- `qf-1` through `qf-4`
- `sf-1` through `sf-2`
- `third`
- `final`

The `gameIds` object connects those IDs to real matches by stage, kickoff time,
and teams. The `matchVenueIds` object connects those same IDs to a venue.

If two matches have the same kickoff time and FIFA's official order differs from
the current order, update the relevant entries in `gameIds`, then keep the venue
mapping in `matchVenueIds` aligned with the game number.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values for your environment.

Required for database access:

- `DATABASE_URL`
- `DIRECT_URL`

Required for production-style email login:

- `RESEND_API_KEY`
- `EMAIL_FROM`

Required for football-data.org sync:

- `FOOTBALL_DATA_API_TOKEN`

Optional for scheduled sync protection:

- `CRON_SECRET`

If email credentials are not configured, the verification flow can show the
one-time code on the verification screen for local development.

## Local Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template:

```bash
cp .env.example .env
```

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Apply the database schema:

```bash
npx prisma db push
```

6. Seed starter match data:

```bash
npm run prisma:seed
```

7. Start the development server:

```bash
npm run dev
```

## Scripts

- `npm run dev`: start the Next.js development server.
- `npm run build`: build the Next.js app.
- `npm run start`: start the built app.
- `npm run vercel-build`: push the Prisma schema, generate Prisma client, and
  build the app for Vercel.
- `npm run lint`: run ESLint.
- `npm run prisma:generate`: generate Prisma client.
- `npm run prisma:migrate`: run Prisma migrations locally.
- `npm run prisma:seed`: seed starter data.
- `npm run prisma:studio`: open Prisma Studio.

## Deployment

The production database should be Postgres. The repo is set up for Vercel-style
deployment with:

```bash
npm run vercel-build
```

That script runs:

```bash
prisma db push && prisma generate && next build
```

For production:

1. Configure a Postgres database, such as Neon.
2. Set `DATABASE_URL` and `DIRECT_URL`.
3. Configure Resend and set `RESEND_API_KEY` and `EMAIL_FROM`.
4. Add `FOOTBALL_DATA_API_TOKEN` if fixture/result sync should run.
5. Set `CRON_SECRET` if the sync endpoint should be protected.

## Known Notes

- ESLint is listed as version 9, but the repo currently does not include an
  `eslint.config.*` file. `npm run lint` may need an ESLint config migration
  before it works.
- Venue mapping is manual and should be reviewed whenever match order or kickoff
  data changes.
- Admin result entry and data sync routes should be restricted before sharing
  broadly outside trusted users.
