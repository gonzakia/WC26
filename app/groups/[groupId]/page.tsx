import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trophy, Users } from "lucide-react";
import { SignOutButton } from "@/components/auth-forms";
import { MatchBrowser } from "@/components/match-browser";
import { getGroupPageData } from "@/lib/data";

type GroupPageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params;
  const data = await getGroupPageData(groupId);

  if (!data) {
    notFound();
  }

  const { currentUser, group, leaderboard, matches, predictionsByMatchId } = data;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf5ea_0%,#f0e6d3_100%)] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl" id="top">
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

        <section className="mt-6 rounded-[2rem] border border-white/60 bg-[#0d1f17] p-8 text-white shadow-glow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-200">
                Group overview
              </p>
              <h1 className="mt-3 text-4xl font-semibold">{group.name}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Signed in as{" "}
                <span className="font-semibold text-white">
                  {currentUser.displayName}
                </span>
                {" "}and making picks in this league.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <Users className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">Members</p>
                <p className="mt-1 text-2xl font-semibold">{group.members.length}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Trophy className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">Invite code</p>
                <p className="mt-1 text-2xl font-semibold tracking-[0.15em]">
                  {group.inviteCode}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              Matches
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              Navigate the tournament your way
            </h2>
            <MatchBrowser
              groupId={group.id}
              matches={matches.map((match) => ({
                ...match,
                kickoffAt: match.kickoffAt.toISOString(),
              }))}
              predictionsByMatchId={Object.fromEntries(predictionsByMatchId.entries())}
            />
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              Leaderboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              Live standings for this group
            </h2>

            <div className="mt-6 overflow-hidden rounded-3xl border border-black/5">
              <div className="grid grid-cols-[0.55fr_1.8fr_1fr_1fr_1fr] bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                <span>#</span>
                <span>Player</span>
                <span>Exact</span>
                <span>Outcome</span>
                <span>Total</span>
              </div>

              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[0.55fr_1.8fr_1fr_1fr_1fr] items-center border-t border-black/5 bg-white px-4 py-4 text-sm text-slate-800"
                >
                  <span className="font-semibold">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                      {entry.role}
                    </p>
                  </div>
                  <span>{entry.exact}</span>
                  <span>{entry.outcomes}</span>
                  <span className="font-semibold text-pitch-700">{entry.total}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700">
              Points are computed from stored predictions and confirmed match
              results. Until results are entered, the leaderboard stays at zero.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
