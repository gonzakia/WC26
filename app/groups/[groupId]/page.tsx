import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trophy, Users } from "lucide-react";
import { SignOutButton } from "@/components/auth-forms";
import { GroupManagement } from "@/components/group-management";
import { MatchBrowser } from "@/components/match-browser";
import { OngoingPredictions } from "@/components/ongoing-predictions";
import { SettingsMenu } from "@/components/settings-menu";
import { getGroupPageData } from "@/lib/data";
import { getLocale, getTranslations, localizePath } from "@/lib/i18n";

type GroupPageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

const ONGOING_MATCH_WINDOW_MS = 3 * 60 * 60 * 1000;
const LIVE_MATCH_STATUSES = new Set(["IN_PLAY", "PAUSED", "LIVE"]);

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params;
  const locale = await getLocale();
  const t = getTranslations(locale);
  const data = await getGroupPageData(groupId);

  if (!data) {
    notFound();
  }

  const { currentUser, group, membership, leaderboard, matches, predictionsByMatchId } = data;
  const now = new Date();
  const ongoingMatches = matches.filter((match) => {
    const kickoffTime = match.kickoffAt.getTime();
    if (LIVE_MATCH_STATUSES.has(match.status)) {
      return true;
    }

    return (
      kickoffTime <= now.getTime() &&
      kickoffTime + ONGOING_MATCH_WINDOW_MS >= now.getTime()
    );
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf5ea_0%,#f0e6d3_100%)] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl" id="top">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-ink"
            href={localizePath("/", locale)}
          >
            <ChevronLeft className="h-4 w-4" />
            {t.common.backDashboard}
          </Link>
          <div className="flex items-center gap-3">
            <SettingsMenu currentLocale={locale} labels={t.settings} />
            <SignOutButton label={t.common.signOut} />
          </div>
        </div>

        <section className="mt-6 rounded-[2rem] border border-white/60 bg-[#0d1f17] p-8 text-white shadow-glow">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-200">
                {t.groupPage.overview}
              </p>
              <h1 className="mt-3 text-4xl font-semibold">{group.name}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {t.common.signedInAs}{" "}
                <span className="font-semibold text-white">
                  {membership.displayName ?? currentUser.displayName}
                </span>
                {" "}{t.groupPage.makingPicks}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <Users className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">{t.groupPage.members}</p>
                <p className="mt-1 text-2xl font-semibold">{group.members.length}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Trophy className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">{t.groupPage.inviteCode}</p>
                <p className="mt-1 text-2xl font-semibold tracking-[0.15em]">
                  {group.inviteCode}
                </p>
              </div>
            </div>
          </div>
        </section>

        <OngoingPredictions
          labels={t.groupPage.ongoingPredictions}
          locale={locale}
          matches={ongoingMatches}
          members={group.members}
        />

        <section className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="min-w-0 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              {t.groupPage.matches}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {t.groupPage.navigate}
            </h2>
            <MatchBrowser
              groupId={group.id}
              locale={locale === "es" ? "es-ES" : "en-US"}
              labels={{
                common: {
                  venueTbd: t.common.venueTbd,
                  finalScore: t.common.finalScore,
                  home: t.common.home,
                  away: t.common.away,
                  savePick: t.common.savePick,
                  savingPick: t.common.savingPick,
                  savedPick: t.common.savedPick,
                  locked: t.common.locked,
                  open: t.common.open,
                },
                matchBrowser: t.matchBrowser,
              }}
              matches={matches.map((match) => ({
                ...match,
                kickoffAt: match.kickoffAt.toISOString(),
              }))}
              predictionsByMatchId={Object.fromEntries(predictionsByMatchId.entries())}
            />
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              {t.groupPage.leaderboard}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {t.groupPage.leaderboardTitle}
            </h2>

            <div className="mt-6 overflow-hidden rounded-3xl border border-black/5">
              <div className="grid grid-cols-[0.55fr_1.5fr_0.8fr_1fr_0.8fr] bg-ink px-4 py-3 text-xs font-semibold tracking-[0.18em] text-slate-200">
                <span>#</span>
                <span>{t.groupPage.player}</span>
                <span>{t.groupPage.exact}</span>
                <span>{t.groupPage.outcome}</span>
                <span>{t.groupPage.total}</span>
              </div>

              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[0.55fr_1.8fr_1fr_1fr_1fr] items-center border-t border-black/5 bg-white px-4 py-4 text-sm text-slate-800"
                >
                  <span className="font-semibold">#{index + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{entry.name}</p>
                      {entry.id === membership.id ? (
                        <span className="rounded-full bg-pitch-50 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pitch-800">
                          {t.groupPage.management.youBadge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span>{entry.exact}</span>
                  <span>{entry.outcomes}</span>
                  <span className="font-semibold text-pitch-700">{entry.total}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700">
              {t.groupPage.leaderboardCopy}
            </div>
          </div>
        </section>

        {membership.role === "OWNER" ? (
          <GroupManagement
            currentUserRole={membership.role}
            groupId={group.id}
            labels={t.groupPage.management}
            members={group.members.map((member) => ({
              id: member.id,
              userId: member.userId,
              role: member.role,
              name: member.displayName?.trim() || member.user.displayName,
              isCurrentUser: member.userId === currentUser.id,
            }))}
          />
        ) : null}
      </div>
    </main>
  );
}
