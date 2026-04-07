import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { scorePrediction } from "@/lib/scoring";
import { getRequiredEnv } from "@/lib/env";

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
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
};

type FootballDataResponse = {
  matches: FootballDataMatch[];
};

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

function isFinished(status: string, home: number | null, away: number | null) {
  return ["FINISHED", "AWARDED"].includes(status) && home !== null && away !== null;
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

export async function syncWorldCupMatches() {
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

  for (const remoteMatch of payload.matches ?? []) {
    const slug = buildSlug(remoteMatch);
    const remoteId = String(remoteMatch.id);
    const homeTeam = safeTeamName(remoteMatch.homeTeam.name, "TBD Home");
    const awayTeam = safeTeamName(remoteMatch.awayTeam.name, "TBD Away");
    const finished = isFinished(
      remoteMatch.status,
      remoteMatch.score.fullTime.home,
      remoteMatch.score.fullTime.away,
    );

    const existing =
      (await prisma.match.findUnique({
        where: { externalMatchId: remoteId },
      })) ??
      (await prisma.match.findUnique({
        where: { slug },
      }));

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
      homeScore: finished ? remoteMatch.score.fullTime.home : null,
      awayScore: finished ? remoteMatch.score.fullTime.away : null,
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
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/results");

  const groups = await prisma.group.findMany({
    select: { id: true },
  });

  groups.forEach((group) => {
    revalidatePath(`/groups/${group.id}`);
  });

  return {
    created,
    updated,
    completed,
    total: payload.matches?.length ?? 0,
    syncedAt,
    provider: "football-data.org",
  };
}
