import { PredictionForm } from "@/components/prediction-form";
import { formatKickoff } from "@/lib/date";

type MatchCardProps = {
  match: {
    id: string;
    stage: string;
    groupName?: string | null;
    kickoffAt: Date;
    venue: string | null;
    homeTeam: string;
    awayTeam: string;
    resultConfirmed: boolean;
    homeScore: number | null;
    awayScore: number | null;
  };
  groupId: string;
  prediction?: {
    predictedHome: number;
    predictedAway: number;
  };
};

export function MatchCard({ match, groupId, prediction }: MatchCardProps) {
  const locked = match.kickoffAt <= new Date();

  return (
    <div className="rounded-[1.75rem] border border-black/5 bg-sand/50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-700">
              {match.stage.replaceAll("_", " ")}
            </p>
            {match.groupName ? (
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {match.groupName}
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-ink">
            {match.homeTeam} vs {match.awayTeam}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {formatKickoff(match.kickoffAt)} · {match.venue ?? "Venue TBD"}
          </p>
          {match.resultConfirmed ? (
            <p className="mt-3 text-sm font-medium text-pitch-800">
              Final score: {match.homeScore} - {match.awayScore}
            </p>
          ) : null}
        </div>

        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          {locked ? "Locked" : "Open"}
        </div>
      </div>

      <div className="mt-5">
        <PredictionForm
          defaultAway={prediction?.predictedAway}
          defaultHome={prediction?.predictedHome}
          groupId={groupId}
          locked={locked}
          matchId={match.id}
        />
      </div>
    </div>
  );
}
