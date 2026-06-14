import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { scorePrediction } from "@/lib/scoring";
import { getRequiredEnv } from "@/lib/env";

type FootballDataScoreSection = {
  home?: number | null;
  away?: number | null;
  homeTeam?: number | null;
  awayTeam?: number | null;
};

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group: string | null;
  venue: string | null;
  lastUpdated?: string;
  homeTeam: {
    name: string | null;
  };
  awayTeam: {
    name: string | null;
  };
  score: {
    fullTime?: FootballDataScoreSection | null;
    regularTime?: FootballDataScoreSection | null;
  };
};

type FootballDataResponse = {
  matches: FootballDataMatch[];
};

type SyncWorldCupMatchesOptions = {
  onlyLocalMatchIds?: Set<string>;
};

const LIVE_MATCH_STATUSES = new Set(["LIVE", "IN_PLAY", "PAUSED"]);
const LIVE_SYNC_BEFORE_KICKOFF_MS = 15 * 60 * 1000;
const LIVE_SYNC_AFTER_KICKOFF_MS = 4 * 60 * 60 * 1000;
const LIVE_SYNC_THROTTLE_MS = 20 * 1000;

function slugifyPart(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function safeTeamName(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

function buildSlug(match: FootballDataMatch) {
  const homeTeam = safeTeamName(match.homeTeam.name, `home-${match.id}`);
  const awayTeam = safeTeamName(match.awayTeam.name, `away-${match.id}`);

  return [
    slugifyPart(homeTeam),
    "vs",
    slugifyPart(awayTeam),
    match.utcDate.slice(0, 10),
  ].join("-");
}

function readScoreValue(
  section: FootballDataScoreSection | undefined | null,
  side: "home" | "away",
) {
  if (!section) {
    return null;
  }

  const legacyKey = side === "home" ? "homeTeam" : "awayTeam";
  const value = section[side] ?? section[legacyKey];

  return typeof value === "number" ? value : null;
}

function getAvailableScore(match: FootballDataMatch) {
  const sections = [match.score.fullTime, match.score.regularTime];

  for (const section of sections) {
    const home = readScoreValue(section, "home");
    const away = readScoreValue(section, "away");

    if (home !== null && away !== null) {
      return { home, away };
    }
  }

  return null;
}

function isFinished(status: string, home: number | null, away: number | null) {
  return ["FINISHED", "AWARDED"].includes(status) && home !== null && away !== null;
}

function revalidateAppPath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("static generation store missing")
    ) {
      return;
    }

    throw error;
  }
}

async function updatePredictionScores(matchId: string, homeScore: number, awayScore: number) {
  const predictions = await prisma.prediction.findMany({
    where: { matchId },
  });

  await Promise.all(
    predictions.map((prediction) =>
      prisma.prediction.update({
        where: { id: prediction.id },
        data: {
          awardedPoints: scorePrediction(
            {
              homeScore: prediction.predictedHome,
              awayScore: prediction.predictedAway,
            },
            {
              homeScore,
              awayScore,
            },
          ),
        },
      }),
    ),
  );
}

export async function syncWorldCupMatches(options: SyncWorldCupMatchesOptions = {}) {
  const token = getRequiredEnv("FOOTBALL_DATA_API_TOKEN");
  const season = process.env.WORLD_CUP_SEASON ?? "2026";

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/WC/matches?season=${season}`,
    {
      headers: {
        "X-Auth-Token": token,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `football-data.org sync failed: ${response.status} ${errorText}`,
    );
  }

  const payload = (await response.json()) as FootballDataResponse;
  const syncedAt = new Date();
  let created = 0;
  let updated = 0;
  let completed = 0;
  let liveUpdated = 0;
  let skipped = 0;

  for (const remoteMatch of payload.matches ?? []) {
    const slug = buildSlug(remoteMatch);
    const remoteId = String(remoteMatch.id);
    const homeTeam = safeTeamName(remoteMatch.homeTeam.name, "TBD Home");
    const awayTeam = safeTeamName(remoteMatch.awayTeam.name, "TBD Away");

    const existing =
      (await prisma.match.findUnique({
        where: { externalMatchId: remoteId },
      })) ??
      (await prisma.match.findUnique({
        where: { slug },
      }));

    if (
      options.onlyLocalMatchIds &&
      (!existing || !options.onlyLocalMatchIds.has(existing.id))
    ) {
      skipped += 1;
      continue;
    }

    const score = getAvailableScore(remoteMatch);
    const finished = isFinished(
      remoteMatch.status,
      score?.home ?? null,
      score?.away ?? null,
    );
    const keepExistingLiveScore =
      LIVE_MATCH_STATUSES.has(remoteMatch.status) && !score && existing;

    const baseData = {
      slug,
      externalMatchId: remoteId,
      source: "football-data.org",
      stage: remoteMatch.stage || "World Cup",
      groupName: remoteMatch.group,
      kickoffAt: new Date(remoteMatch.utcDate),
      homeTeam,
      awayTeam,
      venue: remoteMatch.venue,
      homeScore: score?.home ?? (keepExistingLiveScore ? existing.homeScore : null),
      awayScore: score?.away ?? (keepExistingLiveScore ? existing.awayScore : null),
      resultConfirmed: finished,
      status: remoteMatch.status,
      sourceUpdatedAt: remoteMatch.lastUpdated
        ? new Date(remoteMatch.lastUpdated)
        : null,
      syncedAt,
    };

    const localMatch = existing
      ? await prisma.match.update({
          where: { id: existing.id },
          data: baseData,
        })
      : await prisma.match.create({
          data: baseData,
        });

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }

    if (finished && localMatch.homeScore !== null && localMatch.awayScore !== null) {
      await updatePredictionScores(
        localMatch.id,
        localMatch.homeScore,
        localMatch.awayScore,
      );
      completed += 1;
    } else if (
      LIVE_MATCH_STATUSES.has(localMatch.status) &&
      localMatch.homeScore !== null &&
      localMatch.awayScore !== null
    ) {
      liveUpdated += 1;
    }
  }

  revalidateAppPath("/");
  revalidateAppPath("/admin/results");

  const groups = await prisma.group.findMany({
    select: { id: true },
  });

  groups.forEach((group) => {
    revalidateAppPath(`/groups/${group.id}`);
  });

  return {
    created,
    updated,
    completed,
    liveUpdated,
    skipped,
    total: payload.matches?.length ?? 0,
    syncedAt,
    provider: "football-data.org",
  };
}

export async function syncLiveWorldCupMatches() {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - LIVE_SYNC_THROTTLE_MS);
  const liveWindowStart = new Date(now.getTime() - LIVE_SYNC_AFTER_KICKOFF_MS);
  const liveWindowEnd = new Date(now.getTime() + LIVE_SYNC_BEFORE_KICKOFF_MS);
  const candidateMatches = await prisma.match.findMany({
    where: {
      OR: [
        {
          kickoffAt: {
            gte: liveWindowStart,
            lte: liveWindowEnd,
          },
        },
        {
          status: {
            in: Array.from(LIVE_MATCH_STATUSES),
          },
        },
      ],
    },
    select: {
      id: true,
      syncedAt: true,
    },
  });

  if (candidateMatches.length === 0) {
    return {
      skipped: true,
      reason: "No matches are close enough to kickoff for live sync.",
      syncedAt: now,
      provider: "football-data.org",
    };
  }

  const needsSync = candidateMatches.some(
    (match) => !match.syncedAt || match.syncedAt < staleBefore,
  );

  if (!needsSync) {
    return {
      skipped: true,
      reason: "Live matches were synced recently.",
      syncedAt: now,
      provider: "football-data.org",
    };
  }

  return syncWorldCupMatches({
    onlyLocalMatchIds: new Set(candidateMatches.map((match) => match.id)),
  });
}
