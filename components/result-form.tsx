import { confirmMatchResult } from "@/app/actions";
import { formatKickoff } from "@/lib/date";

type ResultFormProps = {
  match: {
    id: string;
    stage: string;
    kickoffAt: Date;
    homeTeam: string;
    awayTeam: string;
    venue: string | null;
    homeScore: number | null;
    awayScore: number | null;
    resultConfirmed: boolean;
  };
};

export function ResultForm({ match }: ResultFormProps) {
  return (
    <form action={confirmMatchResult} className="rounded-[1.75rem] border border-black/5 bg-sand/45 p-5">
      <input name="matchId" type="hidden" value={match.id} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-700">
            {match.stage}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {formatKickoff(match.kickoffAt)} · {match.venue ?? "Venue TBD"}
          </p>
        </div>

        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          {match.resultConfirmed ? "Confirmed" : "Pending"}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Home score
          </label>
          <input
            className="mt-2 w-24 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
            defaultValue={match.homeScore ?? ""}
            min={0}
            name="homeScore"
            required
            type="number"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Away score
          </label>
          <input
            className="mt-2 w-24 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-base font-semibold text-ink outline-none focus:border-pitch-500"
            defaultValue={match.awayScore ?? ""}
            min={0}
            name="awayScore"
            required
            type="number"
          />
        </div>

        <button
          className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="submit"
        >
          {match.resultConfirmed ? "Update result" : "Confirm result"}
        </button>
      </div>
    </form>
  );
}
