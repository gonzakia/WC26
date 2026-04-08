import { formatCalendarDate, getDateKey } from "@/lib/date";

type MatchLike = {
  id: string;
  kickoffAt: Date;
  stage: string;
  groupName?: string | null;
};

const KNOCKOUT_STAGE_LABELS: Record<string, string> = {
  LAST_32: "Round of 32",
  ROUND_OF_32: "Round of 32",
  ROUND_32: "Round of 32",
  LAST_16: "Round of 16",
  ROUND_OF_16: "Round of 16",
  ROUND_16: "Round of 16",
  QUARTER_FINALS: "Quarter-finals",
  QUARTER_FINAL: "Quarter-finals",
  SEMI_FINALS: "Semi-finals",
  SEMI_FINAL: "Semi-finals",
  THIRD_PLACE: "Third-place play-off",
  FINAL: "Final",
};

export function normalizeStageLabel(stage: string) {
  return KNOCKOUT_STAGE_LABELS[stage] ?? stage.replaceAll("_", " ");
}

export function isGroupStageMatch(match: MatchLike) {
  return (
    match.stage === "GROUP_STAGE" ||
    match.stage.toLowerCase().includes("group") ||
    Boolean(match.groupName)
  );
}

export function getKnockoutStageOrder(stage: string) {
  const normalized = stage.toUpperCase();

  switch (normalized) {
    case "LAST_16":
    case "ROUND_OF_16":
    case "ROUND_16":
      return 1;
    case "QUARTER_FINAL":
    case "QUARTER_FINALS":
      return 2;
    case "SEMI_FINAL":
    case "SEMI_FINALS":
      return 3;
    case "THIRD_PLACE":
      return 4;
    case "FINAL":
      return 5;
    default:
      return 0;
  }
}

export function groupMatchesByDate<T extends MatchLike>(matches: T[]) {
  const map = new Map<string, { label: string; matches: T[] }>();

  for (const match of matches) {
    const key = getDateKey(match.kickoffAt);
    const existing = map.get(key);

    if (existing) {
      existing.matches.push(match);
      continue;
    }

    map.set(key, {
      label: formatCalendarDate(match.kickoffAt),
      matches: [match],
    });
  }

  return Array.from(map.entries()).map(([key, value]) => ({
    key,
    label: value.label,
    matches: value.matches,
  }));
}

export function groupStageMatchesByGroup<T extends MatchLike>(matches: T[]) {
  const grouped = matches.filter(isGroupStageMatch);
  const map = new Map<string, T[]>();

  for (const match of grouped) {
    const key = match.groupName?.trim() || "Other";
    const existing = map.get(key);

    if (existing) {
      existing.push(match);
      continue;
    }

    map.set(key, [match]);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, groupMatches]) => ({
      groupName,
      matches: groupMatches,
    }));
}

export function groupKnockoutMatchesByRound<T extends MatchLike>(matches: T[]) {
  return matches
    .filter((match) => !isGroupStageMatch(match))
    .reduce<Record<string, T[]>>((acc, match) => {
      const key = match.stage;
      acc[key] ??= [];
      acc[key].push(match);
      return acc;
    }, {});
}
