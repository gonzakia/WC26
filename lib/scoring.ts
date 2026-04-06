export type MatchOutcome = "HOME_WIN" | "AWAY_WIN" | "DRAW";

export type Scoreline = {
  homeScore: number;
  awayScore: number;
};

export const EXACT_SCORE_POINTS = 3;
export const CORRECT_OUTCOME_POINTS = 1;

export function getMatchOutcome(score: Scoreline): MatchOutcome {
  if (score.homeScore > score.awayScore) {
    return "HOME_WIN";
  }

  if (score.homeScore < score.awayScore) {
    return "AWAY_WIN";
  }

  return "DRAW";
}

export function scorePrediction(prediction: Scoreline, result: Scoreline) {
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
