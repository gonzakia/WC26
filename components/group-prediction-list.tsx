"use client";

import { getMatchOutcome } from "@/lib/scoring";

export type GroupPredictionMatch = {
  id: string;
  homeScore: number | null;
  awayScore: number | null;
};

export type GroupPredictionMember = {
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

type GroupPredictionListLabels = {
  noPick: string;
  exact: string;
  outcome: string;
};

type PredictionStatus = "exact" | "outcome" | null;

function getPredictionStatus(
  prediction: { predictedHome: number; predictedAway: number } | undefined,
  match: GroupPredictionMatch,
): PredictionStatus {
  if (!prediction || match.homeScore === null || match.awayScore === null) {
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

function getPredictionClass(status: PredictionStatus) {
  if (status === "exact") {
    return "border-emerald-400 bg-emerald-200 text-emerald-950";
  }

  if (status === "outcome") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  return "border-black/5 bg-white text-slate-800";
}

function getStatusRank(status: PredictionStatus) {
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

export function GroupPredictionList({
  labels,
  match,
  members,
}: {
  labels: GroupPredictionListLabels;
  match: GroupPredictionMatch;
  members: GroupPredictionMember[];
}) {
  const orderedMembers = members
    .map((member) => {
      const prediction = member.user.predictions.find(
        (candidate) => candidate.matchId === match.id,
      );
      const status = getPredictionStatus(prediction, match);
      const memberName = member.displayName?.trim() || member.user.displayName;

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
    <div className="grid max-w-4xl gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {orderedMembers.map(({ member, memberName, prediction, status }) => (
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
      ))}
    </div>
  );
}
