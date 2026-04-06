"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, createSession, requireCurrentUser } from "@/lib/auth";
import { scorePrediction } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/invite-code";

function parseScore(value: FormDataEntryValue | null) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error("Scores must be whole numbers greater than or equal to zero.");
  }

  return parsed;
}

function parseText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function signInOrCreateUser(formData: FormData) {
  const email = parseText(formData.get("email")).toLowerCase();
  const displayName = parseText(formData.get("displayName"));

  if (!email) {
    throw new Error("Email is required.");
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    if (!displayName) {
      throw new Error("Display name is required when creating a new account.");
    }

    user = await prisma.user.create({
      data: {
        email,
        displayName,
      },
    });
  }

  await createSession(user.id);
  redirect("/");
}

export async function signOut() {
  await clearSession();
  redirect("/sign-in");
}

export async function createGroup(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    throw new Error("Group name is required.");
  }

  let inviteCode = generateInviteCode();

  while (await prisma.group.findUnique({ where: { inviteCode } })) {
    inviteCode = generateInviteCode();
  }

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode,
      creatorId: currentUser.id,
      members: {
        create: {
          userId: currentUser.id,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/");
  redirect(`/groups/${group.id}`);
}

export async function joinGroup(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const rawInviteCode = formData.get("inviteCode");
  const inviteCode =
    typeof rawInviteCode === "string" ? rawInviteCode.trim().toUpperCase() : "";

  if (!inviteCode) {
    throw new Error("Invite code is required.");
  }

  const group = await prisma.group.findUnique({
    where: { inviteCode },
  });

  if (!group) {
    throw new Error("No group was found with that invite code.");
  }

  await prisma.groupMember.upsert({
    where: {
      userId_groupId: {
        userId: currentUser.id,
        groupId: group.id,
      },
    },
    update: {},
    create: {
      userId: currentUser.id,
      groupId: group.id,
    },
  });

  revalidatePath("/");
  redirect(`/groups/${group.id}`);
}

export async function savePrediction(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const groupId = String(formData.get("groupId") ?? "");
  const matchId = String(formData.get("matchId") ?? "");

  if (!groupId || !matchId) {
    throw new Error("Group and match are required.");
  }

  const [membership, match] = await Promise.all([
    prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: currentUser.id,
          groupId,
        },
      },
    }),
    prisma.match.findUnique({
      where: { id: matchId },
    }),
  ]);

  if (!membership) {
    throw new Error("You are not a member of this group.");
  }

  if (!match) {
    throw new Error("Match not found.");
  }

  if (match.kickoffAt <= new Date()) {
    throw new Error("Predictions are locked after kickoff.");
  }

  const predictedHome = parseScore(formData.get("predictedHome"));
  const predictedAway = parseScore(formData.get("predictedAway"));

  await prisma.prediction.upsert({
    where: {
      userId_groupId_matchId: {
        userId: currentUser.id,
        groupId,
        matchId,
      },
    },
    update: {
      predictedHome,
      predictedAway,
      lockedAt: match.kickoffAt,
    },
    create: {
      predictedHome,
      predictedAway,
      lockedAt: match.kickoffAt,
      userId: currentUser.id,
      groupId,
      matchId,
    },
  });

  revalidatePath(`/groups/${groupId}`);
}

export async function confirmMatchResult(formData: FormData) {
  const matchId = String(formData.get("matchId") ?? "");

  if (!matchId) {
    throw new Error("Match is required.");
  }

  const homeScore = parseScore(formData.get("homeScore"));
  const awayScore = parseScore(formData.get("awayScore"));

  await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      resultConfirmed: true,
    },
  });

  const predictions = await prisma.prediction.findMany({
    where: { matchId },
  });

  const affectedGroupIds = [...new Set(predictions.map((prediction) => prediction.groupId))];

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

  revalidatePath("/");
  revalidatePath("/admin/results");
  affectedGroupIds.forEach((groupId) => {
    revalidatePath(`/groups/${groupId}`);
  });
}
