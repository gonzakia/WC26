import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignOutButton } from "@/components/auth-forms";
import { SettingsMenu } from "@/components/settings-menu";
import { SectionCard } from "@/components/section-card";
import {
  CreateGroupForm,
  EmptyGroupsState,
  GroupLink,
  JoinGroupForm,
} from "@/components/group-forms";
import { UpcomingMatchesSnapshot } from "@/components/upcoming-matches-snapshot";
import { getDashboardData } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getTranslations, localizePath } from "@/lib/i18n";

export default async function Home() {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:42px_42px] opacity-15" />
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-8 lg:px-10">
          <div className="flex justify-end">
            <SettingsMenu currentLocale={locale} labels={t.settings} />
          </div>

          <div className="flex flex-1 items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
                {t.home.appName}
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-tight text-ink sm:text-6xl">
                {t.home.appSummary}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
                {t.home.appIntro}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-slate-800"
                  href={localizePath("/register", locale)}
                >
                  {t.home.register}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                  href={localizePath("/sign-in", locale)}
                >
                  {t.home.login}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { currentUser, memberships, matches } = await getDashboardData();
  const upcomingMatches = matches.filter(
    (match) => match.kickoffAt >= new Date(),
  );

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
              {t.home.appName}
            </p>
            <p className="mt-2 text-sm text-slate-600">{t.home.appIntro}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SettingsMenu currentLocale={locale} labels={t.settings} />
            <div className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
              {t.common.signedInAs} {currentUser.displayName}
            </div>
            <SignOutButton label={t.common.signOut} />
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section
            className="scroll-mt-8 rounded-[2rem] border border-ink/10 bg-white/75 p-8 shadow-glow backdrop-blur"
            id="rules"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
              {t.home.rulesEyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              {t.home.rulesTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {t.home.rulesIntro}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [t.home.exactScoreRule, t.home.exactScoreRuleCopy],
                [t.home.outcomeRule, t.home.outcomeRuleCopy],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-black/5 bg-white/70 p-4"
                >
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {copy}
                  </p>
                </div>
              ))}
              {[
                [t.home.deadlineRule, t.home.deadlineRuleCopy],
                [t.home.separateGroupsRule, t.home.separateGroupsRuleCopy],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-black/5 bg-white/70 p-4"
                >
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                href="#dashboard"
              >
                {t.home.openDashboard}
              </a>
              {/* Uncomment this to update results manually
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
                href={localizePath("/admin/results", locale)}
              >
                {t.home.enterResults}
              </Link>
              */}
            </div>


          </section>

          <div className="scroll-mt-8" id="matchday-snapshot">
            <UpcomingMatchesSnapshot
              matchHeightToId="rules"
              matches={matches.map((match) => ({
                ...match,
                kickoffAt: match.kickoffAt.toISOString(),
              }))}
              locale={locale}
              labels={{
                snapshot: t.home.snapshot,
                upcomingMatches: t.home.upcomingMatches,
                snapshotCopy: t.home.snapshotCopy,
                today: t.home.today,
                tomorrow: t.home.tomorrow,
                venueTbd: t.common.venueTbd,
                live: t.home.live,
                finished: t.home.finished,
                upcoming: t.home.upcoming,
                noUpcomingMatches: t.home.noUpcomingMatches,
              }}
            />
          </div>
        </div>

        <section
          id="dashboard"
          className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div
            className="scroll-mt-8 rounded-[2rem] border border-ink/10 bg-white/75 p-8 shadow-glow backdrop-blur"
            id="my-groups"
          >
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
                    <GroupLink
                      groupId={membership.group.id}
                      href={localizePath(`/groups/${membership.group.id}`, locale)}
                      label={t.common.openGroup}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="scroll-mt-8" id="create-group">
              <SectionCard eyebrow={t.home.create} title={t.home.startPrivateGroup}>
                <CreateGroupForm
                  defaultDisplayName={currentUser.displayName}
                  displayNameFieldId="create-group-display-name"
                  labels={{
                    ...t.groupForms,
                    noGroupsYet: t.common.noGroupsYet,
                    noGroupsCopy: t.common.noGroupsCopy,
                    openGroup: t.common.openGroup,
                  }}
                />
              </SectionCard>
            </div>
            <div className="scroll-mt-8" id="join-group">
              <SectionCard eyebrow={t.home.join} title={t.home.enterInviteCode}>
                <JoinGroupForm
                  defaultDisplayName={currentUser.displayName}
                  displayNameFieldId="join-group-display-name"
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
      </section>
    </main>
  );
}
