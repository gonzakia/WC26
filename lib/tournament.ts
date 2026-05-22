import { formatCalendarDate, getDateKey } from "@/lib/date";

type MatchLike = {
  id: string;
  kickoffAt: Date;
  stage: string;
  groupName?: string | null;
};

const STAGE_LABELS: Record<string, { en: string; es: string }> = {
  GROUP_STAGE: { en: "Group stage", es: "Fase de grupos" },
  LAST_32: { en: "Round of 32", es: "Dieciseisavos" },
  ROUND_OF_32: { en: "Round of 32", es: "Dieciseisavos" },
  ROUND_32: { en: "Round of 32", es: "Dieciseisavos" },
  LAST_16: { en: "Round of 16", es: "Octavos" },
  ROUND_OF_16: { en: "Round of 16", es: "Octavos" },
  ROUND_16: { en: "Round of 16", es: "Octavos" },
  QUARTER_FINALS: { en: "Quarter-finals", es: "Cuartos de final" },
  QUARTER_FINAL: { en: "Quarter-finals", es: "Cuartos de final" },
  SEMI_FINALS: { en: "Semi-finals", es: "Semifinales" },
  SEMI_FINAL: { en: "Semi-finals", es: "Semifinales" },
  THIRD_PLACE: { en: "Third-place play-off", es: "Partido por el tercer puesto" },
  FINAL: { en: "Final", es: "Final" },
};

export function normalizeStageLabel(stage: string, locale: "en" | "es" = "en") {
  const direct = STAGE_LABELS[stage];

  if (direct) {
    return direct[locale];
  }

  return stage.replaceAll("_", " ");
}

export function normalizeRoleLabel(role: string, locale: "en" | "es" = "en") {
  const normalized = role.toUpperCase();

  if (normalized === "OWNER") {
    return locale === "es" ? "Dueno" : "Owner";
  }

  if (normalized === "MEMBER") {
    return locale === "es" ? "Miembro" : "Member";
  }

  return role;
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

export function groupMatchesByDate<T extends MatchLike>(matches: T[], locale = "en-US") {
  const map = new Map<string, { label: string; matches: T[] }>();

  for (const match of matches) {
    const key = getDateKey(match.kickoffAt);
    const existing = map.get(key);

    if (existing) {
      existing.matches.push(match);
      continue;
    }

    map.set(key, {
      label: formatCalendarDate(match.kickoffAt, locale),
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
