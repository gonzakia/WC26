import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SignOutButton } from "@/components/auth-forms";
import { requireCurrentUser } from "@/lib/auth";
import { ResultForm } from "@/components/result-form";
import { SettingsMenu } from "@/components/settings-menu";
import { SyncWorldCupButton } from "@/components/sync-controls";
import { getLocale, getTranslations, localizePath } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function AdminResultsPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);
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

        <section className="mt-6 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
            {t.admin.dataOps}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            {t.admin.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            {t.admin.copy}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[1.75rem] border border-black/5 bg-sand/45 p-5">
            <SyncWorldCupButton label={t.admin.syncNow} />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-ink">
                {latestSyncedMatch?.syncedAt
                  ? `${t.admin.lastSync}: ${latestSyncedMatch.syncedAt.toLocaleString()}`
                  : t.admin.noSync}
              </p>
              <p className="mt-1">
                {t.footer}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-ink">{t.admin.manualOverride}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {t.admin.manualCopy}
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {matches.map((match) => (
              <ResultForm
                key={match.id}
                labels={{
                  venueTbd: t.common.venueTbd,
                  confirmed: t.admin.confirmed,
                  pending: t.admin.pending,
                  homeScore: t.admin.homeScore,
                  awayScore: t.admin.awayScore,
                  updateResult: t.admin.updateResult,
                  confirmResult: t.admin.confirmResult,
                }}
                locale={locale === "es" ? "es-ES" : "en-US"}
                match={match}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
