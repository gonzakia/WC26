import {
  CORRECT_OUTCOME_POINTS,
  EXACT_SCORE_POINTS,
  getBasePredictionPoints,
  scorePrediction,
} from "@/lib/scoring";

type LeaderboardPrediction = {
  awardedPoints: number | null;
  predictedHome: number;
  predictedAway: number;
  match: {
    resultConfirmed: boolean;
    stage: string;
    homeScore: number | null;
    awayScore: number | null;
  };
};

type LeaderboardMember = {
  id: string;
  role: string;
  displayName: string | null;
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

        const predictedScore = {
          homeScore: prediction.predictedHome,
          awayScore: prediction.predictedAway,
        };
        const resultScore = {
          homeScore: match.homeScore,
          awayScore: match.awayScore,
        };
        const basePoints = getBasePredictionPoints(predictedScore, resultScore);
        const points =
          prediction.awardedPoints ??
          scorePrediction(predictedScore, resultScore, match.stage);

        total += points;

        if (basePoints === EXACT_SCORE_POINTS) {
          exact += 1;
        } else if (basePoints === CORRECT_OUTCOME_POINTS) {
          outcomes += 1;
        }
      }

      return {
        id: member.id,
        name: member.displayName?.trim() || member.user.displayName,
        role: member.role,
        exact,
        outcomes,
        total,
      };
    })
    .sort((a, b) => b.total - a.total || b.exact - a.exact || a.name.localeCompare(b.name));
}
