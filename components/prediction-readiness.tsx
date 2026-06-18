"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, CircleDashed } from "lucide-react";
import { getCountryLabel } from "@/lib/country-labels";
import { formatKickoff } from "@/lib/date";
import type { Locale } from "@/lib/i18n";
import { normalizeStageLabel } from "@/lib/tournament";
import type { GroupPredictionMember } from "@/components/group-prediction-list";

type ReadinessMatch = {
  id: string;
  stage: string;
  groupName?: string | null;
  kickoffAt: Date | string;
  homeTeam: string;
  awayTeam: string;
};

type PredictionReadinessLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  ready: string;
  pending: string;
};

type PredictionReadinessProps = {
  labels: PredictionReadinessLabels;
  locale: Locale;
  matches: ReadinessMatch[];
  members: GroupPredictionMember[];
};

export function PredictionReadiness({
  labels,
  locale,
  matches,
  members,
}: PredictionReadinessProps) {
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  if (matches.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-pitch-300 bg-white/85 p-6 shadow-glow backdrop-blur lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
            {labels.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">{labels.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {labels.copy}
          </p>
        </div>
        <Clock3 className="h-6 w-6 text-pitch-700" />
      </div>

      <div className="mt-6 space-y-5">
        {matches.map((match) => {
          const homeTeam = getCountryLabel(match.homeTeam, locale);
          const awayTeam = getCountryLabel(match.awayTeam, locale);
          const kickoffAt = new Date(match.kickoffAt);

          return (
            <div
              className="rounded-3xl border border-black/5 bg-slate-50 p-4"
              key={match.id}
            >
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

              <div className="mt-4 grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member) => {
                  const hasPrediction = member.user.predictions.some(
                    (prediction) => prediction.matchId === match.id,
                  );
                  const memberName =
                    member.displayName?.trim() || member.user.displayName;

                  return (
                    <div
                      className={`min-w-0 rounded-2xl border px-2.5 py-2 text-[0.8rem] transition sm:px-3 sm:text-sm ${
                        hasPrediction
                          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                          : "border-amber-200 bg-white text-slate-800"
                      }`}
                      key={member.id}
                    >
                      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                        <p className="min-w-0 overflow-hidden break-words font-semibold [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                          {memberName}
                        </p>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${
                            hasPrediction
                              ? "bg-emerald-200 text-emerald-950"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {hasPrediction ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <CircleDashed className="h-3.5 w-3.5" />
                          )}
                          {hasPrediction ? labels.ready : labels.pending}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
