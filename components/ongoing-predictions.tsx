"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { getCountryLabel } from "@/lib/country-labels";
import { formatKickoff } from "@/lib/date";
import { getMatchOutcome } from "@/lib/scoring";
import { normalizeStageLabel } from "@/lib/tournament";
import type { Locale } from "@/lib/i18n";
import { LiveScoreRefresher } from "@/components/live-score-refresher";

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

type OngoingMember = {
  id: string;
  displayName: string | null;
  user: {
    displayName: string;
    predictions: {
      matchId: string;
      predictedHome: number;
      predictedAway: number;
    }[];
  };
};

type OngoingPredictionsLabels = {
  eyebrow: string;
  title: string;
  copy: string;
  currentScore: string;
  noScore: string;
  noPick: string;
  exact: string;
  outcome: string;
};

type OngoingPredictionsProps = {
  matches: OngoingMatch[];
  members: OngoingMember[];
  locale: Locale;
  labels: OngoingPredictionsLabels;
};

function getPredictionStatus(
  prediction: { predictedHome: number; predictedAway: number } | undefined,
  match: OngoingMatch,
): "exact" | "outcome" | null {
  if (
    !prediction ||
    match.homeScore === null ||
    match.awayScore === null
  ) {
    return null;
  }

  if (
    prediction.predictedHome === match.homeScore &&
    prediction.predictedAway === match.awayScore
  ) {
    return "exact";
  }

  return getMatchOutcome({
    homeScore: prediction.predictedHome,
    awayScore: prediction.predictedAway,
  }) ===
    getMatchOutcome({
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    })
    ? "outcome"
    : null;
}

function getPredictionClass(status: "exact" | "outcome" | null) {
  if (status === "exact") {
    return "border-emerald-400 bg-emerald-200 text-emerald-950";
  }

  if (status === "outcome") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  return "border-black/5 bg-white text-slate-800";
}

function getStatusRank(status: "exact" | "outcome" | null) {
  if (status === "exact") {
    return 0;
  }

  if (status === "outcome") {
    return 1;
  }

  return 2;
}

function getPredictionOutcomeRank(
  prediction: { predictedHome: number; predictedAway: number } | undefined,
) {
  if (!prediction) {
    return 3;
  }

  if (prediction.predictedHome === prediction.predictedAway) {
    return 0;
  }

  return prediction.predictedHome > prediction.predictedAway ? 1 : 2;
}

function comparePredictions(
  first: { predictedHome: number; predictedAway: number } | undefined,
  second: { predictedHome: number; predictedAway: number } | undefined,
) {
  if (!first && !second) {
    return 0;
  }

  if (!first) {
    return 1;
  }

  if (!second) {
    return -1;
  }

  const outcomeDifference =
    getPredictionOutcomeRank(first) - getPredictionOutcomeRank(second);

  if (outcomeDifference !== 0) {
    return outcomeDifference;
  }

  if (first.predictedAway !== second.predictedAway) {
    return first.predictedAway - second.predictedAway;
  }

  if (first.predictedHome !== second.predictedHome) {
    return first.predictedHome - second.predictedHome;
  }

  return 0;
}

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
          const orderedMembers = members
            .map((member) => {
              const prediction = member.user.predictions.find(
                (candidate) => candidate.matchId === match.id,
              );
              const status = getPredictionStatus(prediction, match);
              const memberName =
                member.displayName?.trim() || member.user.displayName;

              return {
                member,
                memberName,
                prediction,
                status,
              };
            })
            .sort((first, second) => {
              const statusDifference =
                getStatusRank(first.status) - getStatusRank(second.status);

              if (statusDifference !== 0) {
                return statusDifference;
              }

              const predictionDifference = comparePredictions(
                first.prediction,
                second.prediction,
              );

              if (predictionDifference !== 0) {
                return predictionDifference;
              }

              return first.memberName.localeCompare(second.memberName);
            });

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
                    ? `${labels.currentScore}: ${match.homeScore}-${match.awayScore}`
                    : labels.noScore}
                </div>
              </div>

              <div className="mt-4 grid max-w-4xl gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {orderedMembers.map(({ member, memberName, prediction, status }) => {
                  return (
                    <div
                      className={`rounded-2xl border px-3 py-2 text-sm transition ${getPredictionClass(status)}`}
                      key={member.id}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="min-w-0 truncate font-semibold">{memberName}</p>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-base font-semibold">
                            {prediction
                              ? `${prediction.predictedHome}-${prediction.predictedAway}`
                              : labels.noPick}
                          </span>
                          {status ? (
                            <span className="rounded-full bg-white/65 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
                              {status === "exact" ? labels.exact : labels.outcome}
                            </span>
                          ) : null}
                        </div>
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
