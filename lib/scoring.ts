export type MatchOutcome = "HOME_WIN" | "AWAY_WIN" | "DRAW";

export type Scoreline = {
  homeScore: number;
  awayScore: number;
};

export const EXACT_SCORE_POINTS = 3;
export const CORRECT_OUTCOME_POINTS = 1;

const DOUBLE_POINTS_STAGES = new Set([
  "LAST_16",
  "ROUND_OF_16",
  "ROUND_16",
  "LAST_8",
  "ROUND_OF_8",
  "ROUND_8",
  "QUARTER_FINAL",
  "QUARTER_FINALS",
]);

const TRIPLE_POINTS_STAGES = new Set([
  "SEMI_FINAL",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL",
]);

export function getMatchOutcome(score: Scoreline): MatchOutcome {
  if (score.homeScore > score.awayScore) {
    return "HOME_WIN";
  }

  if (score.homeScore < score.awayScore) {
    return "AWAY_WIN";
  }

  return "DRAW";
}

export function getPredictionMultiplier(stage?: string | null) {
  const normalizedStage = stage?.toUpperCase();

  if (!normalizedStage) {
    return 1;
  }

  if (TRIPLE_POINTS_STAGES.has(normalizedStage)) {
    return 3;
  }

  if (DOUBLE_POINTS_STAGES.has(normalizedStage)) {
    return 2;
  }

  return 1;
}

export function getBasePredictionPoints(prediction: Scoreline, result: Scoreline) {
  if (
    prediction.homeScore === result.homeScore &&
    prediction.awayScore === result.awayScore
  ) {
    return EXACT_SCORE_POINTS;
  }

  return getMatchOutcome(prediction) === getMatchOutcome(result)
    ? CORRECT_OUTCOME_POINTS
    : 0;
}

export function scorePrediction(
  prediction: Scoreline,
  result: Scoreline,
  _stage?: string | null,
) {
  return getBasePredictionPoints(prediction, result);
}
