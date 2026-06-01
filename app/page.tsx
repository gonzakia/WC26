import Link from "next/link";
import { ArrowRight, Goal, ShieldCheck, Trophy, Users } from "lucide-react";
import { SignOutButton } from "@/components/auth-forms";
import { SettingsMenu } from "@/components/settings-menu";
import { SectionCard } from "@/components/section-card";
import {
  CreateGroupForm,
  EmptyGroupsState,
  GroupLink,
  JoinGroupForm,
} from "@/components/group-forms";
import { getDashboardData } from "@/lib/data";
import { formatKickoff } from "@/lib/date";
import { formatPoints } from "@/lib/format";
import { getLocale, getTranslations } from "@/lib/i18n";
import { sampleLeaderboard } from "@/lib/sample-data";
import { normalizeStageLabel } from "@/lib/tournament";

export default async function Home() {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const { currentUser, memberships, matches } = await getDashboardData();
  const scoringRules = [
    {
      label: t.home.exactScore,
      description: t.home.exactScoreCopy,
      points: 3,
    },
    {
      label: t.home.correctWinner,
      description: t.home.correctWinnerCopy,
      points: 1,
    },
    {
      label: t.home.wrongOutcome,
      description: t.home.wrongOutcomeCopy,
      points: 0,
    },
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-10 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
              WC26 Predictions
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {t.home.tagline}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SettingsMenu currentLocale={locale} labels={t.settings} />
            <div className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
              {t.common.signedInAs} {currentUser.displayName}
            </div>
          </div>
        </header>

        <div className="mt-4 flex justify-end">
          <SignOutButton label={t.common.signOut} />
        </div>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pitch-300 bg-pitch-50 px-4 py-2 text-sm text-pitch-800">
              <ShieldCheck className="h-4 w-4" />
              {t.home.learnBanner}
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              {t.home.heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              {t.home.heroCopy}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                href="#dashboard"
              >
                {t.home.openDashboard}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                href="#leaderboard"
              >
                {t.home.sampleLeaderboard}
              </a>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                href="/admin/results"
              >
                {t.home.enterResults}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/60 bg-[#0d1f17] p-6 text-white shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pitch-200">
                  {t.home.snapshot}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{t.home.privateLeagues}</h2>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-pitch-100">
                12 {t.common.members}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {matches.slice(0, 2).map((match) => (
                <div
                  key={match.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-pitch-200">
                        {normalizeStageLabel(match.stage, locale)}
                      </p>
                      <p className="mt-2 text-lg font-medium">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {formatKickoff(
                          match.kickoffAt,
                          locale === "es" ? "es-ES" : "en-US",
                        )}{" "}
                        · {match.venue ?? t.common.venueTbd}
                      </p>
                    </div>
                    <div className="rounded-full bg-pitch-400/15 px-3 py-1 text-xs font-semibold text-pitch-100">
                      {match.kickoffAt > new Date() ? t.common.open : t.common.locked}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <Users className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">{t.home.groups}</p>
                <p className="mt-1 text-2xl font-semibold">{t.home.privateLeagues}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Goal className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">{t.home.scoring}</p>
                <p className="mt-1 text-2xl font-semibold">{t.home.exactOutcome}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Trophy className="h-5 w-5 text-pitch-200" />
                <p className="mt-3 text-sm text-slate-300">{t.home.competition}</p>
                <p className="mt-1 text-2xl font-semibold">{t.home.liveRanking}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="dashboard"
        className="mx-auto max-w-7xl px-6 pb-8 lg:px-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-ink/10 bg-white/75 p-8 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              {t.home.yourGroups}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {t.home.jumpIntoLeague}
            </h2>

            <div className="mt-6 space-y-4">
              {memberships.length === 0 ? (
                <EmptyGroupsState
                  labels={{
                    ...t.groupForms,
                    noGroupsYet: t.common.noGroupsYet,
                    noGroupsCopy: t.common.noGroupsCopy,
                    openGroup: t.common.openGroup,
                  }}
              />
              ) : (
                memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex flex-col gap-4 rounded-[1.75rem] border border-black/5 bg-sand/45 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-ink">
                        {membership.group.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {t.common.inviteCode} {membership.group.inviteCode} ·{" "}
                        {membership.group._count.members} {t.common.members}
                      </p>
                    </div>
                    <GroupLink groupId={membership.group.id} label={t.common.openGroup} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <SectionCard eyebrow={t.home.create} title={t.home.startPrivateGroup}>
              <CreateGroupForm
                  labels={{
                    ...t.groupForms,
                    noGroupsYet: t.common.noGroupsYet,
                    noGroupsCopy: t.common.noGroupsCopy,
                    openGroup: t.common.openGroup,
                  }}
              />
            </SectionCard>
            <SectionCard eyebrow={t.home.join} title={t.home.enterInviteCode}>
              <JoinGroupForm
                labels={{
                  ...t.groupForms,
                  noGroupsYet: t.common.noGroupsYet,
                  noGroupsCopy: t.common.noGroupsCopy,
                  openGroup: t.common.openGroup,
                }}
              />
            </SectionCard>
          </div>
        </div>
      </section>

      <section
        id="foundation"
        className="mx-auto max-w-7xl px-6 pb-8 pt-8 lg:px-10"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard eyebrow={t.home.users} title={t.home.usersTitle}>
            {t.home.usersCopy}
          </SectionCard>
          <SectionCard eyebrow={t.home.predictions} title={t.home.predictionsTitle}>
            {t.home.predictionsCopy}
          </SectionCard>
          <SectionCard eyebrow={t.home.scoring} title={t.home.scoringTitle}>
            {t.home.scoringCopy}
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-ink/10 bg-white/70 p-8 shadow-glow backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              {t.home.scoring}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {t.home.scoringModel}
            </h2>
            <div className="mt-6 space-y-4">
              {scoringRules.map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-black/5 bg-sand/50 p-4"
                >
                  <div>
                    <p className="font-semibold text-ink">{rule.label}</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {rule.description}
                    </p>
                  </div>
                  <div className="rounded-full bg-pitch-700 px-3 py-1 text-sm font-semibold text-white">
                    {formatPoints(rule.points)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="leaderboard"
            className="rounded-[2rem] border border-ink/10 bg-[#fffdf8] p-8 shadow-glow"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              {t.groupPage.leaderboard}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {t.home.sampleStandings}
            </h2>
            <div className="mt-6 overflow-hidden rounded-3xl border border-black/5">
              <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                <span>#</span>
                <span>{t.groupPage.player}</span>
                <span>{t.groupPage.exact}</span>
                <span>{t.groupPage.outcome}</span>
                <span>{t.groupPage.total}</span>
              </div>
              {sampleLeaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-center border-t border-black/5 bg-white px-4 py-4 text-sm text-slate-800"
                >
                  <span className="font-semibold">#{index + 1}</span>
                  <span className="font-medium">{entry.name}</span>
                  <span>{entry.exact}</span>
                  <span>{entry.outcomes}</span>
                  <span className="font-semibold text-pitch-700">
                    {entry.points}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-700">
              {t.home.leaderboardCopy}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-2 lg:px-10">
        <div className="rounded-[2rem] border border-ink/10 bg-[#0d1f17] p-8 text-white shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-200">
            {t.home.nextTarget}
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            {t.home.nextTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            {t.home.nextCopy}
          </p>
          {memberships[0] ? (
            <Link
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100"
              href={`/groups/${memberships[0].group.id}`}
            >
              {t.common.openGroup} {memberships[0].group.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
