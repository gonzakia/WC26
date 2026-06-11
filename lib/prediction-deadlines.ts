type MatchWithDeadlineFields = {
  id: string;
  kickoffAt: Date;
  stage: string;
  groupName?: string | null;
};

export function getPredictionDeadline<T extends MatchWithDeadlineFields>(
  match: T,
  _matches: T[],
) {
  return match.kickoffAt;
}

export function isPredictionLocked<T extends MatchWithDeadlineFields>(
  match: T,
  matches: T[],
  now = new Date(),
) {
  return getPredictionDeadline(match, matches) <= now;
}
