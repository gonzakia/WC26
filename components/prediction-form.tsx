"use client";

import { savePrediction } from "@/app/actions";

type PredictionFormProps = {
  groupId: string;
  matchId: string;
  defaultHome?: number;
  defaultAway?: number;
  locked: boolean;
};

export function PredictionForm({
  groupId,
  matchId,
  defaultHome,
  defaultAway,
  locked,
}: PredictionFormProps) {
  return (
    <form action={savePrediction} className="flex flex-wrap items-end gap-3">
      <input name="groupId" type="hidden" value={groupId} />
      <input name="matchId" type="hidden" value={matchId} />

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Home
        </label>
        <input
          className="mt-2 w-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
          defaultValue={defaultHome ?? ""}
          min={0}
          name="predictedHome"
          required
          type="number"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Away
        </label>
        <input
          className="mt-2 w-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
          defaultValue={defaultAway ?? ""}
          min={0}
          name="predictedAway"
          required
          type="number"
        />
      </div>

      <button
        className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={locked}
        type="submit"
      >
        {locked ? "Locked" : "Save pick"}
      </button>
    </form>
  );
}
