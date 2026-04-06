import { scorePrediction } from "@/lib/scoring";

type LeaderboardPrediction = {
  awardedPoints: number | null;
  predictedHome: number;
  predictedAway: number;
  match: {
    resultConfirmed: boolean;
    homeScore: number | null;
    awayScore: number | null;
  };
};

type LeaderboardMember = {
  id: string;
  role: string;
  user: {
    displayName: string;
  };
  predictions: LeaderboardPrediction[];
};

export function buildLeaderboard(members: LeaderboardMember[]) {
  return members
    .map((member) => {
      let exact = 0;
      let outcomes = 0;
      let total = 0;

      for (const prediction of member.predictions) {
        const { match } = prediction;

        if (
          !match.resultConfirmed ||
          match.homeScore === null ||
          match.awayScore === null
        ) {
          continue;
        }

        const points =
          prediction.awardedPoints ??
          scorePrediction(
            {
              homeScore: prediction.predictedHome,
              awayScore: prediction.predictedAway,
            },
            {
              homeScore: match.homeScore,
              awayScore: match.awayScore,
            },
          );

        total += points;

        if (points === 3) {
          exact += 1;
        } else if (points === 1) {
          outcomes += 1;
        }
      }

      return {
        id: member.id,
        name: member.user.displayName,
        role: member.role,
        exact,
        outcomes,
        total,
      };
    })
    .sort((a, b) => b.total - a.total || b.exact - a.exact || a.name.localeCompare(b.name));
}
