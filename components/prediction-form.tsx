"use client";

import type { KeyboardEvent } from "react";
import { useActionState, useEffect, useState } from "react";
import { savePredictionWithFeedback } from "@/app/actions";
import { getCountryFlag, getCountryLabel } from "@/lib/country-labels";

type PredictionFormProps = {
  groupId: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  copyTargets?: Array<{
    id: string;
    name: string;
  }>;
  locale?: string;
  defaultHome?: number;
  defaultAway?: number;
  locked: boolean;
  variant?: "default" | "compact";
  labels: {
    home: string;
    away: string;
    savePick: string;
    savingPick?: string;
    savedPick?: string;
    copyPrompt?: string;
    copyToSelected?: string;
    copiedPick?: string;
    locked: string;
  };
};

export function PredictionForm({
  groupId,
  matchId,
  homeTeam,
  awayTeam,
  copyTargets = [],
  locale = "en-US",
  defaultHome,
  defaultAway,
  locked,
  variant = "default",
  labels,
}: PredictionFormProps) {
  const [state, formAction, isPending] = useActionState(savePredictionWithFeedback, {
    savedAt: 0,
    copiedGroupIds: [],
  });
  const [hasSavedPrediction, setHasSavedPrediction] = useState(
    defaultHome !== undefined && defaultAway !== undefined,
  );
  const homeLabel = getCountryLabel(homeTeam, locale);
  const awayLabel = getCountryLabel(awayTeam, locale);
  const homeInputId = `${matchId}-predicted-home`;
  const awayInputId = `${matchId}-predicted-away`;
  const visibleCopyTargets = copyTargets.filter(
    (target) => !state.copiedGroupIds.includes(target.id),
  );
  const showCopyPrompt =
    variant !== "compact" &&
    hasSavedPrediction &&
    !isPending &&
    !locked &&
    visibleCopyTargets.length > 0;

  useEffect(() => {
    if (state.savedAt) {
      setHasSavedPrediction(true);
    }
  }, [state.savedAt]);

  function moveBetweenCompactInputs(event: KeyboardEvent<HTMLInputElement>) {
    if (variant !== "compact") {
      return;
    }

    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -2,
      ArrowDown: 2,
    };
    const offset = offsets[event.key];

    if (!offset) {
      return;
    }

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>("[data-score-grid-input='true']"),
    );
    const currentIndex = inputs.indexOf(event.currentTarget);
    const nextInput = inputs[currentIndex + offset];

    if (!nextInput) {
      return;
    }

    event.preventDefault();
    nextInput.focus();
    nextInput.select();
  }

  return (
    <form
      action={formAction}
      className={
        variant === "compact"
          ? "flex min-w-max items-center gap-1"
          : "flex flex-wrap items-end gap-3"
      }
    >
      <input name="groupId" type="hidden" value={groupId} />
      <input name="matchId" type="hidden" value={matchId} />

      <div
        className={
          variant === "compact"
            ? "flex items-center bg-white"
            : "contents"
        }
      >
      <div>
        <label
          aria-label={`${homeLabel} ${labels.home}`}
          className={variant === "compact" ? "sr-only" : "block text-center"}
          htmlFor={homeInputId}
          title={`${homeLabel} ${labels.home}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {getCountryFlag(homeTeam)}
          </span>
        </label>
        <input
          className={
            variant === "compact"
              ? "h-7 w-10 rounded-none border-0 bg-transparent px-1 text-center text-xs font-semibold text-ink outline-none ring-0 focus:bg-pitch-50 sm:h-8 sm:w-12"
              : "mt-2 w-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
          }
          data-score-grid-input={variant === "compact" ? "true" : undefined}
          defaultValue={defaultHome ?? ""}
          id={homeInputId}
          min={0}
          name="predictedHome"
          onKeyDown={moveBetweenCompactInputs}
          required
          type="number"
        />
      </div>

        {variant === "compact" ? (
          <span className="text-xs font-semibold text-slate-300">-</span>
        ) : null}

      <div>
        <label
          aria-label={`${awayLabel} ${labels.away}`}
          className={variant === "compact" ? "sr-only" : "block text-center"}
          htmlFor={awayInputId}
          title={`${awayLabel} ${labels.away}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {getCountryFlag(awayTeam)}
          </span>
        </label>
        <input
          className={
            variant === "compact"
              ? "h-7 w-10 rounded-none border-0 bg-transparent px-1 text-center text-xs font-semibold text-ink outline-none ring-0 focus:bg-pitch-50 sm:h-8 sm:w-12"
              : "mt-2 w-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
          }
          data-score-grid-input={variant === "compact" ? "true" : undefined}
          defaultValue={defaultAway ?? ""}
          id={awayInputId}
          min={0}
          name="predictedAway"
          onKeyDown={moveBetweenCompactInputs}
          required
          type="number"
        />
      </div>
      </div>

      <button
        className={
          variant === "compact"
            ? "inline-flex rounded-sm bg-ink px-2 py-1 text-[0.68rem] font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:px-3"
            : "inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        }
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
        className={`rounded-full bg-pitch-50 text-xs font-semibold text-pitch-900 shadow-sm transition ${
          variant === "compact" ? "px-2 py-1" : "px-3 py-2"
        } ${
          !isPending && (hasSavedPrediction || state.savedAt)
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {labels.savedPick ?? "Saved"}
      </span>
      {showCopyPrompt ? (
        <div className="basis-full rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-white">
          <p className="font-semibold">
            {labels.copyPrompt ?? "Copy this prediction to other groups?"}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {visibleCopyTargets.map((target) => (
              <label
                className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm"
                key={target.id}
              >
                <input
                  className="h-4 w-4 accent-[rgb(var(--color-pitch-500))]"
                  name="copyGroupIds"
                  type="checkbox"
                  value={target.id}
                />
                <span>{target.name}</span>
              </label>
            ))}
          </div>
          <button
            className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:bg-pitch-50"
            disabled={isPending}
            type="submit"
          >
            {labels.copyToSelected ?? "Copy to selected"}
          </button>
        </div>
      ) : null}
      {!isPending && state.copiedGroupIds.length > 0 ? (
        <span className="basis-full text-xs font-semibold text-pitch-100">
          {labels.copiedPick ?? "Copied to selected groups"}
        </span>
      ) : null}
    </form>
  );
}
