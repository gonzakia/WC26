"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  GitBranch,
  ListChecks,
  Table2,
} from "lucide-react";
import {
  GroupPredictionList,
  type GroupPredictionMember,
} from "@/components/group-prediction-list";
import { PredictionForm } from "@/components/prediction-form";
import { getCountryFlag, getCountryLabel } from "@/lib/country-labels";
import { getMatchVenue } from "@/lib/manual-venues";
import { isPredictionLocked } from "@/lib/prediction-deadlines";
import { getMatchOutcome } from "@/lib/scoring";
import {
  getKnockoutStageOrder,
  groupKnockoutMatchesByRound,
  groupMatchesByDate,
  groupStageMatchesByGroup,
  normalizeStageLabel,
} from "@/lib/tournament";

type BrowserMatch = {
  id: string;
  externalMatchId?: string | null;
  slug?: string;
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

type CopyTargetGroup = {
  id: string;
  name: string;
};

type MatchBrowserProps = {
  groupId: string;
  matches: BrowserMatch[];
  members: GroupPredictionMember[];
  predictionsByMatchId: Record<string, BrowserPrediction>;
  copyTargetsByMatchId: Record<string, CopyTargetGroup[]>;
  locale: string;
  labels: {
    common: {
      venueTbd: string;
      finalScore: string;
      home: string;
      away: string;
      savePick: string;
      savingPick: string;
      savedPick: string;
      copyPrompt: string;
      copyToSelected: string;
      copiedPick: string;
      locked: string;
      open: string;
    };
    matchBrowser: {
      toggleMenu: string;
      dateMenu: string;
      stageMenu: string;
      tableMenu: string;
      tableTime: string;
      tableHome: string;
      tableAway: string;
      tableResult: string;
      tableScore: string;
      groupStage: string;
      knockoutBracket: string;
      backToGroups: string;
      round: string;
      cup: string;
      match: string;
      matches: string;
      viewDetailedPredictions: string;
      hideDetailedPredictions: string;
    };
    predictionDetails: {
      noPick: string;
      exact: string;
      outcome: string;
    };
  };
};

const TEAM_ORDER = [
  // Group A
  "Mexico", "Canada", "Brazil", "United States",
  "Germany", "Netherlands", "Belgium", "Spain",
  "France", "Argentina", "Portugal", "England",
  "South Africa", "Bosnia-Herzegovina", "Morocco", "Paraguay",
  "Curaçao", "Japan", "Egypt", "Cape Verde",
  "Senegal", "Algeria", "Congo DR", "Croatia",
  "South Korea", "Qatar", "Haiti", "Australia",
  "Ivory Coast", "Sweden", "Iran", "Saudi Arabia",
  "Iraq", "Austria", "Uzbekistan", "Panama",
  "Czechia", "Switzerland", "Scotland", "Turkey",
  "Ecuador", "Tunisia", "New Zealand", "Uruguay",
  "Norway", "Jordan", "Colombia", "Panama"

  // Group B
  // add the countries here in correct order

  // Group C
  // add the countries here in correct order
];

const TEAM_ORDER_MAP = new Map(
  TEAM_ORDER.map((team, index) => [team, index]),
);

function getTeamOrder(teamName: string) {
  return TEAM_ORDER_MAP.get(teamName) ?? Number.MAX_SAFE_INTEGER;
}

const FLAG_EMOJIS: Record<string, string> = {
  Mexico: "🇲🇽",
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

function formatKickoff(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCompactKickoff(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const TEAM_CODES: Record<string, string> = {
  Algeria: "ALG",
  Argentina: "ARG",
  Australia: "AUS",
  Austria: "AUT",
  Belgium: "BEL",
  "Bosnia-Herzegovina": "BIH",
  Brazil: "BRA",
  Canada: "CAN",
  "Cape Verde": "CPV",
  "Cape Verde Islands": "CPV",
  Colombia: "COL",
  "Congo DR": "COD",
  Croatia: "CRO",
  Curaçao: "CUW",
  Czechia: "CZE",
  Ecuador: "ECU",
  Egypt: "EGY",
  England: "ENG",
  France: "FRA",
  Germany: "GER",
  Ghana: "GHA",
  Haiti: "HAI",
  Iran: "IRN",
  Iraq: "IRQ",
  "Ivory Coast": "CIV",
  Japan: "JPN",
  Jordan: "JOR",
  Mexico: "MEX",
  Morocco: "MAR",
  Netherlands: "NED",
  "New Zealand": "NZL",
  Norway: "NOR",
  Panama: "PAN",
  Paraguay: "PAR",
  Portugal: "POR",
  Qatar: "QAT",
  "Saudi Arabia": "KSA",
  Scotland: "SCO",
  Senegal: "SEN",
  "South Africa": "RSA",
  "South Korea": "KOR",
  Spain: "ESP",
  Sweden: "SWE",
  Switzerland: "SUI",
  Tunisia: "TUN",
  Turkey: "TUR",
  Uruguay: "URU",
  "United States": "USA",
  Uzbekistan: "UZB",
};

function getTeamCode(teamName: string) {
  return TEAM_CODES[teamName] ?? teamName.slice(0, 3).toUpperCase();
}

function getTablePredictionStatus(
  prediction: BrowserPrediction | undefined,
  match: { resultConfirmed: boolean; homeScore: number | null; awayScore: number | null },
) {
  if (
    !prediction ||
    !match.resultConfirmed ||
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

function getLocalDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getInitialDateKey(dates: Array<{ key: string }>) {
  const todayKey = getLocalDateKey(new Date());

  return dates.find((section) => section.key === todayKey)?.key ?? dates[0]?.key ?? null;
}

function MatchItem({
  match,
  groupId,
  prediction,
  labels,
  locale,
  matches,
  members,
  copyTargets,
}: {
  match: BrowserMatch;
  groupId: string;
  prediction?: BrowserPrediction;
  labels: MatchBrowserProps["labels"];
  locale: string;
  matches: BrowserMatch[];
  members: GroupPredictionMember[];
  copyTargets: CopyTargetGroup[];
}) {
  const [showDetailedPredictions, setShowDetailedPredictions] = useState(false);
  const language = locale.startsWith("es") ? "es" : "en";
  const deadlineMatches = matches.map((candidate) => ({
    ...candidate,
    kickoffAt: new Date(candidate.kickoffAt),
  }));
  const locked = isPredictionLocked(
    { ...match, kickoffAt: new Date(match.kickoffAt) },
    deadlineMatches,
  );
  const homeTeam = getCountryLabel(match.homeTeam, locale);
  const awayTeam = getCountryLabel(match.awayTeam, locale);
  const venue = getMatchVenue(match, locale);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
              {normalizeStageLabel(match.stage, language)}
            </p>
            {match.groupName ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                {match.groupName.replace('_', ' ')}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm font-medium text-slate-100">
            {formatKickoff(match.kickoffAt, locale)}
            {venue ? <> · {venue}</> : null}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {homeTeam} vs {awayTeam}
          </h3>
          
          {match.resultConfirmed &&
          match.homeScore !== null &&
          match.awayScore !== null ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-pitch-100">
                {labels.common.finalScore}: {match.homeScore} - {match.awayScore}
              </p>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                onClick={() => setShowDetailedPredictions((current) => !current)}
                type="button"
              >
                <ListChecks className="h-3.5 w-3.5" />
                {showDetailedPredictions
                  ? labels.matchBrowser.hideDetailedPredictions
                  : labels.matchBrowser.viewDetailedPredictions}
              </button>
            </div>
          ) : null}
        </div>

        <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
          {locked ? labels.common.locked : labels.common.open}
        </div>
      </div>

      <div className="mt-5">
        <PredictionForm
          awayTeam={match.awayTeam}
          defaultAway={prediction?.predictedAway}
          defaultHome={prediction?.predictedHome}
          groupId={groupId}
          homeTeam={match.homeTeam}
          locale={locale}
          locked={locked}
          labels={{
            home: labels.common.home,
            away: labels.common.away,
            savePick: labels.common.savePick,
            savingPick: labels.common.savingPick,
            savedPick: labels.common.savedPick,
            copyPrompt: labels.common.copyPrompt,
            copyToSelected: labels.common.copyToSelected,
            copiedPick: labels.common.copiedPick,
            locked: labels.common.locked,
          }}
          matchId={match.id}
          copyTargets={copyTargets}
        />
      </div>

      {showDetailedPredictions ? (
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          <GroupPredictionList
            labels={labels.predictionDetails}
            match={match}
            members={members}
            showStatusBadge={false}
          />
        </div>
      ) : null}
    </div>
  );
}

export function MatchBrowser({
  groupId,
  matches,
  members,
  predictionsByMatchId,
  copyTargetsByMatchId,
  locale,
  labels,
}: MatchBrowserProps) {
  const language = locale.startsWith("es") ? "es" : "en";
  const matchesWithDate = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        kickoffAt: new Date(match.kickoffAt),
      })),
    [matches],
  );

  const dates = groupMatchesByDate(matchesWithDate, locale);
  const groups = groupStageMatchesByGroup(matchesWithDate);
  const knockoutRounds = Object.entries(groupKnockoutMatchesByRound(matchesWithDate))
    .sort(([a], [b]) => getKnockoutStageOrder(a) - getKnockoutStageOrder(b))
    .map(([stage, roundMatches]) => ({
      stage,
      label: normalizeStageLabel(stage, language),
      matches: roundMatches,
    }));

  const [openPrimary, setOpenPrimary] =
    useState<"date" | "stage" | "table" | null>("date");
  const [openDateKey, setOpenDateKey] = useState<string | null>(() =>
    getInitialDateKey(dates),
  );
  const [stageMode, setStageMode] = useState<"group" | "knockout">("group");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeRound, setActiveRound] = useState<string | null>(
    knockoutRounds[0]?.stage ?? null,
  );
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const activeDateButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (openPrimary !== "date") {
      return;
    }

    activeDateButtonRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [openDateKey, openPrimary]);

  return (
    <div className="mt-6 min-w-0 space-y-6">
      <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-black/5 bg-[rgb(var(--color-panel-soft)/1)] text-white">
        <button
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() =>
            setOpenPrimary((current) => (current === "date" ? null : "date"))
          }
          type="button"
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-pitch-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                {labels.matchBrowser.toggleMenu}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{labels.matchBrowser.dateMenu}</h3>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition ${openPrimary === "date" ? "rotate-180" : ""}`}
          />
        </button>

        {openPrimary === "date" ? (
          <div className="min-w-0 border-t border-white/10 px-5 pb-5 pt-4">
            <div className="w-full min-w-0 overflow-x-auto pb-1" ref={dateScrollRef}>
              <div className="flex flex-nowrap gap-3">
                {dates.map((section) => (
                  <button
                    key={section.key}
                    ref={openDateKey === section.key ? activeDateButtonRef : null}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
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
            </div>

            <div className="mt-5 space-y-5">
              {dates
                .filter((section) => section.key === openDateKey)
                .map((section) =>
                  section.matches.map((match) => (
                    <MatchItem
                      key={match.id}
                      groupId={groupId}
                      labels={labels}
                      locale={locale}
                      matches={matches}
                      match={{ ...match, kickoffAt: match.kickoffAt.toISOString() }}
                      members={members}
                      prediction={predictionsByMatchId[match.id]}
                      copyTargets={copyTargetsByMatchId[match.id] ?? []}
                    />
                  )),
                )}
            </div>
          </div>
        ) : null}
      </section>

      <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-black/5 bg-[rgb(var(--color-panel-soft)/1)] text-white">
        <button
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() =>
            setOpenPrimary((current) => (current === "stage" ? null : "stage"))
          }
          type="button"
        >
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-pitch-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                {labels.matchBrowser.toggleMenu}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{labels.matchBrowser.stageMenu}</h3>
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
                {labels.matchBrowser.groupStage}
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
                {labels.matchBrowser.knockoutBracket}
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
                      {labels.matchBrowser.backToGroups}
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
                                labels={labels}
                                locale={locale}
                                matches={matches}
                                match={{
                                  ...match,
                                  kickoffAt: match.kickoffAt.toISOString(),
                                }}
                                members={members}
                                prediction={predictionsByMatchId[match.id]}
                                copyTargets={copyTargetsByMatchId[match.id] ?? []}
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
                        new Set<string>(
                          section.matches.flatMap((match) => [
                            match.homeTeam,
                            match.awayTeam,
                          ]),
                        ),
                      )
                        .map((country) => ({
                          original: country,
                          label: getCountryLabel(country, locale),
                        }))
                        .sort((a, b) => {
                          const aOrder = getTeamOrder(a.original);
                          const bOrder = getTeamOrder(b.original);

                          return aOrder - bOrder;
                        });

                      return (
                        <button
                          key={section.groupName}
                          className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                          onClick={() => setActiveGroup(section.groupName)}
                          type="button"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                            {labels.matchBrowser.groupStage}
                          </p>
                          <h4 className="mt-2 text-xl font-semibold text-white">
                            {section.groupName.replace('_', ' ')}
                          </h4>
                          <div className="mt-4 space-y-2">
                            {countries.map((country) => (
                              <div
                                key={country.original}
                                className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100"
                              >
                                <span className="text-lg">{getCountryFlag(country.original)}</span>
                                <span>{country.label}</span>
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
                          {index === knockoutRounds.length - 1
                            ? labels.matchBrowser.cup
                            : labels.matchBrowser.round}
                        </p>
                        <h4 className="mt-2 text-lg font-semibold">{round.label}</h4>
                        <p className="mt-1 text-sm opacity-80">
                          {round.matches.length}{" "}
                          {round.matches.length === 1
                            ? labels.matchBrowser.match
                            : labels.matchBrowser.matches}
                        </p>
                        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                          {round.matches.map((match) => (
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
                              labels={labels}
                              locale={locale}
                              matches={matches}
                              match={{ ...match, kickoffAt: match.kickoffAt.toISOString() }}
                              members={members}
                              prediction={predictionsByMatchId[match.id]}
                              copyTargets={copyTargetsByMatchId[match.id] ?? []}
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

      <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-black/5 bg-[rgb(var(--color-panel-soft)/1)] text-white">
        <button
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() =>
            setOpenPrimary((current) => (current === "table" ? null : "table"))
          }
          type="button"
        >
          <div className="flex items-center gap-3">
            <Table2 className="h-5 w-5 text-pitch-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pitch-200">
                {labels.matchBrowser.toggleMenu}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{labels.matchBrowser.tableMenu}</h3>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition ${openPrimary === "table" ? "rotate-180" : ""}`}
          />
        </button>

        {openPrimary === "table" ? (
          <div className="border-t border-white/10 px-5 pb-5 pt-4">
            <div className="score-grid overflow-x-auto border border-white/10 bg-white/5">
              <table className="w-auto border-collapse text-left text-xs">
                <colgroup>
                  <col className="w-[7.25rem] sm:w-[8.5rem]" />
                  <col className="w-[5.25rem] sm:w-[7.5rem]" />
                  <col className="w-[5.25rem] sm:w-[7.5rem]" />
                  <col className="w-[4.75rem] sm:w-[5.5rem]" />
                  <col className="w-[11rem] sm:w-[13.5rem]" />
                </colgroup>
                <thead className="bg-white/10 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-pitch-100">
                  <tr>
                    <th className="border border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">{labels.matchBrowser.tableTime}</th>
                    <th className="border border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">{labels.matchBrowser.tableHome}</th>
                    <th className="border border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">{labels.matchBrowser.tableAway}</th>
                    <th className="border border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">{labels.matchBrowser.tableResult}</th>
                    <th className="border border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">{labels.matchBrowser.tableScore}</th>
                  </tr>
                </thead>
                <tbody>
                  {matchesWithDate.map((match) => {
                    const locked = isPredictionLocked(match, matchesWithDate);
                    const prediction = predictionsByMatchId[match.id];
                    const predictionStatus = getTablePredictionStatus(prediction, match);
                    const isToday = getLocalDateKey(match.kickoffAt) === getLocalDateKey(new Date());
                    const rowClass = isToday ? "bg-pitch-400/15" : "";
                    const result =
                      match.homeScore !== null && match.awayScore !== null
                        ? `${match.homeScore}-${match.awayScore}`
                        : "-";

                    return (
                      <tr className={rowClass} key={match.id}>
                        <td className="whitespace-nowrap border border-white/10 px-2 py-1 text-slate-100 sm:px-3 sm:py-2">
                          {formatCompactKickoff(match.kickoffAt.toISOString(), locale)}
                        </td>
                        <td className="whitespace-nowrap border border-white/10 px-2 py-1 font-medium text-white sm:px-3 sm:py-2">
                          <span className="mr-2">{getCountryFlag(match.homeTeam)}</span>
                          {getTeamCode(match.homeTeam)}
                        </td>
                        <td className="whitespace-nowrap border border-white/10 px-2 py-1 font-medium text-white sm:px-3 sm:py-2">
                          <span className="mr-2">{getCountryFlag(match.awayTeam)}</span>
                          {getTeamCode(match.awayTeam)}
                        </td>
                        <td className="whitespace-nowrap border border-white/10 px-2 py-1 text-center font-semibold text-white sm:px-3 sm:py-2">
                          {result}
                        </td>
                        <td className="border border-white/10 px-1 py-0.5 sm:px-2 sm:py-1">
                          <PredictionForm
                            awayTeam={match.awayTeam}
                            defaultAway={prediction?.predictedAway}
                            defaultHome={prediction?.predictedHome}
                            groupId={groupId}
                            homeTeam={match.homeTeam}
                            locale={locale}
                            locked={locked}
                            labels={{
                              home: labels.common.home,
                              away: labels.common.away,
                              savePick: labels.common.savePick,
                              savingPick: labels.common.savingPick,
                              savedPick: labels.common.savedPick,
                              locked: labels.common.locked,
                            }}
                            matchId={match.id}
                            compactStatus={predictionStatus}
                            variant="compact"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
