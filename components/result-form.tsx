import { confirmMatchResult } from "@/app/actions";
import { getCountryLabel } from "@/lib/country-labels";
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
  labels: {
    venueTbd: string;
    confirmed: string;
    pending: string;
    homeScore: string;
    awayScore: string;
    updateResult: string;
    confirmResult: string;
  };
  locale: string;
};

export function ResultForm({ match, labels, locale }: ResultFormProps) {
  const homeTeam = getCountryLabel(match.homeTeam, locale);
  const awayTeam = getCountryLabel(match.awayTeam, locale);

  return (
    <form action={confirmMatchResult} className="rounded-[1.75rem] border border-black/5 bg-sand/45 p-5">
      <input name="matchId" type="hidden" value={match.id} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-700">
            {match.stage}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            {homeTeam} vs {awayTeam}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {formatKickoff(match.kickoffAt, locale)} · {match.venue ?? labels.venueTbd}
          </p>
        </div>

        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          {match.resultConfirmed ? labels.confirmed : labels.pending}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {labels.homeScore}
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
            {labels.awayScore}
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
          {match.resultConfirmed ? labels.updateResult : labels.confirmResult}
        </button>
      </div>
    </form>
  );
}
