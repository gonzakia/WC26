"use client";

import { useEffect, useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import { getCountryLabel } from "@/lib/country-labels";
import { formatKickoff } from "@/lib/date";
import { normalizeStageLabel } from "@/lib/tournament";

type UpcomingMatch = {
  id: string;
  kickoffAt: string;
  stage: string;
  venue: string | null;
  homeTeam: string;
  awayTeam: string;
};

type NormalizedUpcomingMatch = Omit<UpcomingMatch, "kickoffAt"> & {
  kickoffAt: Date;
};

type UpcomingMatchesSnapshotProps = {
  matches: UpcomingMatch[];
  locale: string;
  labels: {
    snapshot: string;
    upcomingMatches: string;
    snapshotCopy: string;
    today: string;
    tomorrow: string;
    venueTbd: string;
    open: string;
    noUpcomingMatches: string;
  };
};

function getLocalDateKey(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getDayLabel(
  date: Date,
  now: Date,
  locale: string,
  labels: UpcomingMatchesSnapshotProps["labels"],
  timeZone: string,
) {
  const todayKey = getLocalDateKey(now, timeZone);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = getLocalDateKey(tomorrow, timeZone);
  const dateKey = getLocalDateKey(date, timeZone);

  if (dateKey === todayKey) {
    return labels.today;
  }

  if (dateKey === tomorrowKey) {
    return labels.tomorrow;
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}

export function UpcomingMatchesSnapshot({
  matches,
  locale,
  labels,
}: UpcomingMatchesSnapshotProps) {
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const now = new Date();
  const normalizedMatches = matches.map((match) => ({
    ...match,
    kickoffAt: new Date(match.kickoffAt),
  }));
  const todayKey = getLocalDateKey(now, timeZone);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = getLocalDateKey(tomorrow, timeZone);

  const dayWindowMatches = normalizedMatches.filter((match) => {
    const matchKey = getLocalDateKey(match.kickoffAt, timeZone);
    return matchKey === todayKey || matchKey === tomorrowKey;
  });

  const futureMatches =
    dayWindowMatches.length > 0
      ? dayWindowMatches
      : normalizedMatches.filter((match) => match.kickoffAt >= now).slice(0, 6);

  const groupedMatches = futureMatches.reduce<
    Array<{ label: string; matches: NormalizedUpcomingMatch[] }>
  >((groups, match) => {
    const label = getDayLabel(match.kickoffAt, now, locale, labels, timeZone);
    const existing = groups[groups.length - 1];

    if (existing && existing.label === label) {
      existing.matches.push(match);
      return groups;
    }

    groups.push({ label, matches: [match] });
    return groups;
  }, []);

  return (
    <section className="rounded-[2rem] border border-white/60 bg-[#0d1f17] p-6 text-white shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-200">
            {labels.snapshot}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{labels.upcomingMatches}</h2>

        </div>

        <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-pitch-100">
          {futureMatches.length}
        </div>
      </div>

      <div className="mt-5 max-h-[30rem] space-y-5 overflow-y-auto pr-1">
        {groupedMatches.length ? (
          groupedMatches.map((group) => (
            <div key={group.label}>
              <div className="sticky top-0 z-10 rounded-full bg-[#0d1f17]/95 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-pitch-100">
                {group.label}
              </div>
              <div className="mt-3 space-y-3">
                {group.matches.map((match) => (
                  <article
                    key={match.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-pitch-200">
                          {normalizeStageLabel(match.stage, locale.startsWith("es") ? "es" : "en")}
                        </p>
                        <h3 className="mt-2 text-base font-semibold leading-snug text-white">
                          {getCountryLabel(match.homeTeam, locale)} vs{" "}
                          {getCountryLabel(match.awayTeam, locale)}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatKickoff(
                              match.kickoffAt,
                              locale === "es" ? "es-ES" : "en-US",
                              timeZone,
                            )}
                          </span>
                          {/*<span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {match.venue ?? labels.venueTbd}
                          </span>*/}
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-pitch-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pitch-100">
                        {labels.open}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            {labels.noUpcomingMatches}
          </div>
        )}
      </div>
    </section>
  );
}
