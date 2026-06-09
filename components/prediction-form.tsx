"use client";

import { useActionState, useEffect, useState } from "react";
import { savePredictionWithFeedback } from "@/app/actions";
import { getCountryFlag, getCountryLabel } from "@/lib/country-labels";

type PredictionFormProps = {
  groupId: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  locale?: string;
  defaultHome?: number;
  defaultAway?: number;
  locked: boolean;
  labels: {
    home: string;
    away: string;
    savePick: string;
    savingPick?: string;
    savedPick?: string;
    locked: string;
  };
};

export function PredictionForm({
  groupId,
  matchId,
  homeTeam,
  awayTeam,
  locale = "en-US",
  defaultHome,
  defaultAway,
  locked,
  labels,
}: PredictionFormProps) {
  const [state, formAction, isPending] = useActionState(savePredictionWithFeedback, {
    savedAt: 0,
  });
  const [showSaved, setShowSaved] = useState(false);
  const homeLabel = getCountryLabel(homeTeam, locale);
  const awayLabel = getCountryLabel(awayTeam, locale);
  const homeInputId = `${matchId}-predicted-home`;
  const awayInputId = `${matchId}-predicted-away`;

  useEffect(() => {
    if (!state.savedAt) {
      return;
    }

    setShowSaved(true);
    const timer = window.setTimeout(() => {
      setShowSaved(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [state.savedAt]);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input name="groupId" type="hidden" value={groupId} />
      <input name="matchId" type="hidden" value={matchId} />

      <div>
        <label
          aria-label={`${homeLabel} ${labels.home}`}
          className="block text-center"
          htmlFor={homeInputId}
          title={`${homeLabel} ${labels.home}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {getCountryFlag(homeTeam)}
          </span>
        </label>
        <input
          className="mt-2 w-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
          defaultValue={defaultHome ?? ""}
          id={homeInputId}
          min={0}
          name="predictedHome"
          required
          type="number"
        />
      </div>

      <div>
        <label
          aria-label={`${awayLabel} ${labels.away}`}
          className="block text-center"
          htmlFor={awayInputId}
          title={`${awayLabel} ${labels.away}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {getCountryFlag(awayTeam)}
          </span>
        </label>
        <input
          className="mt-2 w-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
          defaultValue={defaultAway ?? ""}
          id={awayInputId}
          min={0}
          name="predictedAway"
          required
          type="number"
        />
      </div>

      <button
        className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={locked || isPending}
        type="submit"
      >
        {locked
          ? labels.locked
          : isPending
            ? labels.savingPick ?? "Saving..."
            : labels.savePick}
      </button>
      <span
        aria-live="polite"
        className={`rounded-full bg-pitch-50 px-3 py-2 text-xs font-semibold text-pitch-900 shadow-sm transition ${
          showSaved ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {labels.savedPick ?? "Saved"}
      </span>
    </form>
  );
}
