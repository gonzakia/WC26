"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Flag,
  GitBranch,
} from "lucide-react";
import { PredictionForm } from "@/components/prediction-form";
import {
  getKnockoutStageOrder,
  groupKnockoutMatchesByRound,
  groupMatchesByDate,
  groupStageMatchesByGroup,
  normalizeStageLabel,
} from "@/lib/tournament";

type BrowserMatch = {
  id: string;
  stage: string;
  groupName?: string | null;
  kickoffAt: string;
  venue: string | null;
  homeTeam: string;
  awayTeam: string;
  resultConfirmed: boolean;
  homeScore: number | null;
  awayScore: number | null;
};

type BrowserPrediction = {
  predictedHome: number;
  predictedAway: number;
};

type MatchBrowserProps = {
  groupId: string;
  matches: BrowserMatch[];
  predictionsByMatchId: Record<string, BrowserPrediction>;
};

const FLAG_EMOJIS: Record<string, string> = {
  Algeria: "🇩🇿",
  Argentina: "🇦🇷",
  Australia: "🇦🇺",
  Austria: "🇦🇹",
  Belgium: "🇧🇪",
  "Bosnia-Herzegovina": "🇧🇦",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  "Cape Verde": "🇨🇻",
  Colombia: "🇨🇴",
  "Congo DR": "🇨🇩",
  Croatia: "🇭🇷",
  Curaçao: "🇨🇼",
  Czechia: "🇨🇿",
  Ecuador: "🇪🇨",
  Egypt: "🇪🇬",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Ghana: "🇬🇭",
  Haiti: "🇭🇹",
  Iran: "🇮🇷",
  Iraq: "🇮🇶",
  Ivory: "🇨🇮",
  Japan: "🇯🇵",
  Jordan: "🇯🇴",
  Mexico: "🇲🇽",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  "New Zealand": "🇳🇿",
  Norway: "🇳🇴",
  Panama: "🇵🇦",
  Paraguay: "🇵🇾",
  Portugal: "🇵🇹",
  Qatar: "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Senegal: "🇸🇳",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Spain: "🇪🇸",
  Sweden: "🇸🇪",
  Switzerland: "🇨🇭",
  Tunisia: "🇹🇳",
  Turkey: "🇹🇷",
  Uruguay: "🇺🇾",
  "United States": "🇺🇸",
  Uzbekistan: "🇺🇿",
};

function formatKickoff(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getFlagEmoji(teamName: string) {
  const direct = FLAG_EMOJIS[teamName];

  if (direct) {
    return direct;
  }

  const matchedKey = Object.keys(FLAG_EMOJIS).find((key) =>
    teamName.toLowerCase().includes(key.toLowerCase()),
  );

  return matchedKey ? FLAG_EMOJIS[matchedKey] : "🏳️";
}

function getGroupId(groupName: string) {
  return groupName.toLowerCase().replace(/\s+/g, "-");
}

function MatchItem({
  match,
  groupId,
  prediction,
}: {
  match: BrowserMatch;
  groupId: string;
  prediction?: BrowserPrediction;
}) {
  const kickoff = new Date(match.kickoffAt);
  const locked = kickoff <= new Date();

  return (
    <div className="rounded-[1.75rem] border border-black/5 bg-pitch-200/100 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0d1f17]">
              {normalizeStageLabel(match.stage)}
            </p>
            {match.groupName ? (
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {match.groupName.replace('_', ' ')}
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

        <div className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
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

export function MatchBrowser({
  groupId,
  matches,
  predictionsByMatchId,
}: MatchBrowserProps) {
  const matchesWithDate = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        kickoffAt: new Date(match.kickoffAt),
      })),
    [matches],
  );

  const dates = groupMatchesByDate(matchesWithDate);
  const groups = groupStageMatchesByGroup(matchesWithDate);
  const knockoutRounds = Object.entries(groupKnockoutMatchesByRound(matchesWithDate))
    .sort(([a], [b]) => getKnockoutStageOrder(a) - getKnockoutStageOrder(b))
    .map(([stage, roundMatches]) => ({
      stage,
      label: normalizeStageLabel(stage),
      matches: roundMatches,
    }));

  const [openPrimary, setOpenPrimary] = useState<"date" | "stage">("date");
  const [openDateKey, setOpenDateKey] = useState<string | null>(dates[0]?.key ?? null);
  const [stageMode, setStageMode] = useState<"group" | "knockout">("group");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeRound, setActiveRound] = useState<string | null>(
    knockoutRounds[0]?.stage ?? null,
  );

  return (
    <div className="mt-6 space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-[#0d1f17] text-white">
        <button
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() => setOpenPrimary(openPrimary === "date" ? "stage" : "date")}
          type="button"
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-pitch-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                Toggle Menu
              </p>
              <h3 className="mt-1 text-xl font-semibold">Search matches by date</h3>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition ${openPrimary === "date" ? "rotate-180" : ""}`}
          />
        </button>

        {openPrimary === "date" ? (
          <div className="border-t border-white/10 px-5 pb-5 pt-4">
            <div className="flex flex-wrap gap-3">
              {dates.map((section) => (
                <button
                  key={section.key}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    openDateKey === section.key
                      ? "bg-white text-ink"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  onClick={() => setOpenDateKey(section.key)}
                  type="button"
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-5">
              {dates
                .filter((section) => section.key === openDateKey)
                .map((section) =>
                  section.matches.map((match) => (
                    <MatchItem
                      key={match.id}
                      groupId={groupId}
                      match={{ ...match, kickoffAt: match.kickoffAt.toISOString() }}
                      prediction={predictionsByMatchId[match.id]}
                    />
                  )),
                )}
            </div>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-[#10261b] text-white">
        <button
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() => setOpenPrimary(openPrimary === "stage" ? "date" : "stage")}
          type="button"
        >
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-pitch-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                Toggle Menu
              </p>
              <h3 className="mt-1 text-xl font-semibold">Search matches by stage</h3>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition ${openPrimary === "stage" ? "rotate-180" : ""}`}
          />
        </button>

        {openPrimary === "stage" ? (
          <div className="border-t border-white/10 px-5 pb-5 pt-4">
            <div className="flex gap-3">
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  stageMode === "group"
                    ? "bg-white text-ink"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={() => setStageMode("group")}
                type="button"
              >
                Group stage
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  stageMode === "knockout"
                    ? "bg-white text-ink"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={() => setStageMode("knockout")}
                type="button"
              >
                Knockout bracket
              </button>
            </div>

            {stageMode === "group" ? (
              <div className="mt-5">
                {activeGroup ? (
                  <div>
                    <button
                      className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                      onClick={() => setActiveGroup(null)}
                      type="button"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to groups
                    </button>

                    {groups
                      .filter((section) => section.groupName === activeGroup)
                      .map((section) => (
                        <div key={section.groupName}>
                          <h4 className="text-2xl font-semibold">{section.groupName.replace('_', ' ')}</h4>
                          <div className="mt-5 space-y-5">
                            {section.matches.map((match) => (
                              <MatchItem
                                key={match.id}
                                groupId={groupId}
                                match={{
                                  ...match,
                                  kickoffAt: match.kickoffAt.toISOString(),
                                }}
                                prediction={predictionsByMatchId[match.id]}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {groups.map((section) => {
                      const countries = Array.from(
                        new Set(
                          section.matches.flatMap((match) => [
                            match.homeTeam,
                            match.awayTeam,
                          ]),
                        ),
                      ).sort((a, b) => a.localeCompare(b));

                      return (
                        <button
                          key={section.groupName}
                          className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                          onClick={() => setActiveGroup(section.groupName)}
                          type="button"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                            Group
                          </p>
                          <h4 className="mt-2 text-xl font-semibold text-white">
                            {section.groupName.replace('_', ' ')}
                          </h4>
                          <div className="mt-4 space-y-2">
                            {countries.map((country) => (
                              <div
                                key={country}
                                className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100"
                              >
                                <span className="text-lg">{getFlagEmoji(country)}</span>
                                <span>{country}</span>
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5">
                <div className="overflow-x-auto pb-2">
                  <div className="flex min-w-max items-start gap-6">
                    {knockoutRounds.map((round, index) => (
                      <button
                        key={round.stage}
                        className={`w-56 rounded-[1.5rem] border p-4 text-left transition ${
                          activeRound === round.stage
                            ? "border-white bg-white text-ink shadow-glow"
                            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                        onClick={() => setActiveRound(round.stage)}
                        type="button"
                      >
                        <p
                          className={`text-xs font-semibold uppercase tracking-[0.24em] ${
                            activeRound === round.stage ? "text-pitch-700" : "text-pitch-200"
                          }`}
                        >
                          {index === knockoutRounds.length - 1 ? "Cup" : "Round"}
                        </p>
                        <h4 className="mt-2 text-lg font-semibold">{round.label}</h4>
                        <div className="mt-4 space-y-3">
                          {round.matches.slice(0, 4).map((match) => (
                            <div
                              key={match.id}
                              className={`rounded-xl border px-3 py-3 text-sm ${
                                activeRound === round.stage
                                  ? "border-slate-200 bg-slate-50 text-slate-700"
                                  : "border-white/10 bg-white/5 text-slate-200"
                              }`}
                            >
                              <p className="font-medium">{match.homeTeam}</p>
                              <p className="mt-1 font-medium">{match.awayTeam}</p>
                            </div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  {knockoutRounds
                    .filter((round) => round.stage === activeRound)
                    .map((round) => (
                      <div key={round.stage}>
                        <h4 className="text-2xl font-semibold">{round.label}</h4>
                        <div className="mt-5 space-y-5">
                          {round.matches.map((match) => (
                            <MatchItem
                              key={match.id}
                              groupId={groupId}
                              match={{ ...match, kickoffAt: match.kickoffAt.toISOString() }}
                              prediction={predictionsByMatchId[match.id]}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
