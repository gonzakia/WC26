# WC26 Predictions

WC26 Predictions is a learning-focused full-stack app for the 2026 FIFA World Cup.
Players join private groups, predict match scorelines, earn points for exact picks
or correct outcomes, and compete on a shared leaderboard.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local development

This repo is scaffolded manually because the current environment does not have
Node.js installed, but the project structure is ready to install and run once
Node is available.

## MVP features

- Create or join a prediction group
- View upcoming World Cup matches
- Submit one prediction per match before kickoff
- Award 3 points for an exact score
- Award 1 point for the correct winner or draw
- Show a leaderboard for each group

## Data model

The initial Prisma schema includes:

- `User`
- `Group`
- `GroupMember`
- `Match`
- `Prediction`

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run prisma:generate`.
5. Create the local database with `npx prisma migrate dev --name init`.
6. Seed demo data with `npm run prisma:seed`.
7. Start the app with `npm run dev`.

## Suggested next steps

1. Add authentication with Supabase or NextAuth.
2. Build match and group pages backed by Prisma queries.
3. Add forms for creating groups and submitting predictions.
4. Add an admin workflow to enter final match scores.
5. Compute leaderboard totals from scored predictions.
