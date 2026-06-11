"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import {
  GroupPredictionList,
  type GroupPredictionMember,
} from "@/components/group-prediction-list";
import { LiveScoreRefresher } from "@/components/live-score-refresher";
import { getCountryLabel } from "@/lib/country-labels";
import { formatKickoff } from "@/lib/date";
import type { Locale } from "@/lib/i18n";
import { normalizeStageLabel } from "@/lib/tournament";

type OngoingMatch = {
  id: string;
  stage: string;
  groupName?: string | null;
  kickoffAt: Date | string;
  status: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
};

type OngoingPredictionsLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  currentScore: string;
  finalScore: string;
  noScore: string;
  noPick: string;
  exact: string;
  outcome: string;
};

type OngoingPredictionsProps = {
  matches: OngoingMatch[];
  members: GroupPredictionMember[];
  locale: Locale;
  labels: OngoingPredictionsLabels;
};

const FINISHED_MATCH_STATUSES = new Set(["FINISHED", "AWARDED"]);

export function OngoingPredictions({
  matches,
  members,
  locale,
  labels,
}: OngoingPredictionsProps) {
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  if (matches.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-emerald-200 bg-white/85 p-6 shadow-glow backdrop-blur lg:p-8">
      <LiveScoreRefresher />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            {labels.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{labels.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {labels.copy}
          </p>
        </div>
        <Clock3 className="h-6 w-6 text-emerald-700" />
      </div>

      <div className="mt-6 space-y-5">
        {matches.map((match) => {
          const homeTeam = getCountryLabel(match.homeTeam, locale);
          const awayTeam = getCountryLabel(match.awayTeam, locale);
          const hasScore = match.homeScore !== null && match.awayScore !== null;
          const kickoffAt = new Date(match.kickoffAt);
          const scoreLabel = FINISHED_MATCH_STATUSES.has(match.status)
            ? labels.finalScore
            : labels.currentScore;

          return (
            <div
              className="rounded-3xl border border-black/5 bg-slate-50 p-4"
              key={match.id}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {match.groupName ?? normalizeStageLabel(match.stage, locale)}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">
                    {homeTeam} vs {awayTeam}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatKickoff(
                      kickoffAt,
                      locale === "es" ? "es-ES" : "en-US",
                      timeZone,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink">
                  {hasScore
                    ? `${scoreLabel}: ${match.homeScore}-${match.awayScore}`
                    : labels.noScore}
                </div>
              </div>

              <div className="mt-4">
                <GroupPredictionList
                  labels={labels}
                  match={match}
                  members={members}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
