import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SignOutButton } from "@/components/auth-forms";
import { requireCurrentUser } from "@/lib/auth";
import { ResultForm } from "@/components/result-form";
import { SyncWorldCupButton } from "@/components/sync-controls";
import { prisma } from "@/lib/prisma";

export default async function AdminResultsPage() {
  await requireCurrentUser();

  const [matches, latestSyncedMatch] = await Promise.all([
    prisma.match.findMany({
      orderBy: { kickoffAt: "asc" },
    }),
    prisma.match.findFirst({
      where: {
        syncedAt: {
          not: null,
        },
      },
      orderBy: {
        syncedAt: "desc",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf5ea_0%,#f0e6d3_100%)] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-ink"
            href="/"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <SignOutButton />
        </div>

        <section className="mt-6 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
            Data Ops
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Sync World Cup fixtures and results
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            The app can pull matches and final scores from football-data.org, then
            automatically update prediction points for every group.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[1.75rem] border border-black/5 bg-sand/45 p-5">
            <SyncWorldCupButton />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-ink">
                {latestSyncedMatch?.syncedAt
                  ? `Last sync: ${latestSyncedMatch.syncedAt.toLocaleString()}`
                  : "No automatic sync has run yet."}
              </p>
              <p className="mt-1">
                Data provided by football-data.org.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-ink">Manual override</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              You should not need this often, but it stays available in case an
              external result is delayed or needs correction.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {matches.map((match) => (
              <ResultForm key={match.id} match={match} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
