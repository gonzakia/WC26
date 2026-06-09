import { isGroupStageMatch } from "@/lib/tournament";

type MatchWithDeadlineFields = {
  id: string;
  kickoffAt: Date;
  stage: string;
  groupName?: string | null;
};

export function getPredictionDeadline<T extends MatchWithDeadlineFields>(
  match: T,
  matches: T[],
) {
  if (!isGroupStageMatch(match) || !match.groupName?.trim()) {
    return match.kickoffAt;
  }

  const groupName = match.groupName.trim();
  const groupMatches = matches.filter(
    (candidate) =>
      isGroupStageMatch(candidate) &&
      candidate.groupName?.trim() === groupName,
  );

  return groupMatches.reduce(
    (deadline, candidate) =>
      candidate.kickoffAt < deadline ? candidate.kickoffAt : deadline,
    match.kickoffAt,
  );
}

export function isPredictionLocked<T extends MatchWithDeadlineFields>(
  match: T,
  matches: T[],
  now = new Date(),
) {
  return getPredictionDeadline(match, matches) <= now;
}
