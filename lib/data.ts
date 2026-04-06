import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { buildLeaderboard } from "@/lib/leaderboard";

export async function getDashboardData() {
  const currentUser = await requireCurrentUser();

  const [memberships, matches] = await Promise.all([
    prisma.groupMember.findMany({
      where: { userId: currentUser.id },
      include: {
        group: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        group: {
          createdAt: "desc",
        },
      },
    }),
    prisma.match.findMany({
      orderBy: { kickoffAt: "asc" },
      take: 8,
    }),
  ]);

  return { currentUser, memberships, matches };
}

export async function getGroupPageData(groupId: string) {
  const currentUser = await requireCurrentUser();

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: currentUser.id,
        groupId,
      },
    },
  });

  if (!membership) {
    return null;
  }

  const [group, members, currentUserPredictions, matches] = await Promise.all([
    prisma.group.findUnique({
      where: { id: groupId },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    }),
    prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          include: {
            predictions: {
              where: { groupId },
              include: {
                match: true,
              },
            },
          },
        },
      },
    }),
    prisma.prediction.findMany({
      where: {
        groupId,
        userId: currentUser.id,
      },
    }),
    prisma.match.findMany({
      orderBy: { kickoffAt: "asc" },
    }),
  ]);

  if (!group) {
    return null;
  }

  const predictionsByMatchId = new Map(
    currentUserPredictions.map((prediction) => [prediction.matchId, prediction]),
  );

  const leaderboard = buildLeaderboard(
    members.map((member) => ({
      id: member.id,
      role: member.role,
      user: {
        displayName: member.user.displayName,
      },
      predictions: member.user.predictions,
    })),
  );

  return {
    currentUser,
    membership,
    group: {
      ...group,
      members,
    },
    matches,
    leaderboard,
    predictionsByMatchId,
  };
}
