"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearSession,
  consumeLoginCode,
  createLoginCode,
  createSession,
  requireCurrentUser,
} from "@/lib/auth";
import { canSendEmail } from "@/lib/email";
import { syncWorldCupMatches } from "@/lib/match-sync";
import { getPredictionDeadline } from "@/lib/prediction-deadlines";
import { scorePrediction } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/invite-code";
import {
  getLocale,
  getLocaleCookieName,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n";

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

export async function setLanguage(formData: FormData) {
  const locale = parseText(formData.get("locale"));
  const redirectTo = parseText(formData.get("redirectTo")) || "/";

  if (!locales.includes(locale as Locale)) {
    throw new Error("Unsupported language.");
  }

  const cookieStore = await cookies();
  cookieStore.set(getLocaleCookieName(), locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect(localizePath(redirectTo, locale as Locale));
}

export async function signInOrCreateUser(formData: FormData) {
  const email = parseText(formData.get("email")).toLowerCase();
  const displayName = parseText(formData.get("displayName"));
  const intent = parseText(formData.get("intent"));
  const locale = await getLocale();

  if (!email) {
    throw new Error("Email is required.");
  }

  if (intent === "register" && !displayName) {
    throw new Error("Username is required.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (intent === "login" && !existingUser) {
    redirect(
      `${localizePath("/sign-in", locale)}?email=${encodeURIComponent(email)}&error=no_account`,
    );
  }

  if (intent === "register" && existingUser) {
    redirect(
      `${localizePath("/register", locale)}?email=${encodeURIComponent(email)}&error=account_exists`,
    );
  }

  const { code, emailSent } = await createLoginCode(email, displayName);

  const params = new URLSearchParams({
    email,
    mode: intent === "register" ? "register" : "login",
  });

  if (!emailSent || !canSendEmail()) {
    params.set("devCode", code);
  }

  redirect(`${localizePath("/verify", locale)}?${params.toString()}`);
}

export async function verifySignInCode(formData: FormData) {
  const email = parseText(formData.get("email")).toLowerCase();
  const code = parseText(formData.get("code"));
  const mode = parseText(formData.get("mode")) === "register" ? "register" : "login";
  const locale = await getLocale();

  if (!email || !code) {
    throw new Error("Email and verification code are required.");
  }

  const loginCode = await consumeLoginCode(email, code);

  if (!loginCode) {
    const params = new URLSearchParams({
      email,
      mode,
      error: "invalid_code",
    });

    redirect(`${localizePath("/verify", locale)}?${params.toString()}`);
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const displayName =
      loginCode.displayNameHint?.trim() || email.split("@")[0] || "Player";

    user = await prisma.user.create({
      data: {
        email,
        displayName,
      },
    });
  }

  await createSession(user.id);
  redirect(localizePath("/", locale));
}

export async function signOut() {
  await clearSession();
  redirect(localizePath("/sign-in", await getLocale()));
}

export async function createGroup(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const rawName = formData.get("name");
  const rawDisplayName = formData.get("displayName");
  const name = typeof rawName === "string" ? rawName.trim() : "";
  const displayName =
    typeof rawDisplayName === "string" ? rawDisplayName.trim() : "";

  if (!name) {
    throw new Error("Group name is required.");
  }

  if (!displayName) {
    throw new Error("Display name is required.");
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
          displayName,
        },
      },
    },
  });

  revalidatePath("/");
  redirect(localizePath(`/groups/${group.id}`, await getLocale()));
}

export async function joinGroup(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const rawInviteCode = formData.get("inviteCode");
  const rawDisplayName = formData.get("displayName");
  const inviteCode =
    typeof rawInviteCode === "string" ? rawInviteCode.trim().toUpperCase() : "";
  const displayName =
    typeof rawDisplayName === "string" ? rawDisplayName.trim() : "";

  if (!inviteCode) {
    throw new Error("Invite code is required.");
  }

  if (!displayName) {
    throw new Error("Display name is required.");
  }

  const group = await prisma.group.findUnique({
    where: { inviteCode },
  });

  if (!group) {
    throw new Error("No group was found with that invite code.");
  }

  const takenName = await prisma.groupMember.findFirst({
    where: {
      groupId: group.id,
      displayName,
    },
  });

  if (takenName && takenName.userId !== currentUser.id) {
    throw new Error("That display name is already taken in this group.");
  }

  await prisma.groupMember.upsert({
    where: {
      userId_groupId: {
        userId: currentUser.id,
        groupId: group.id,
      },
    },
    update: {
      displayName,
    },
    create: {
      userId: currentUser.id,
      groupId: group.id,
      displayName,
    },
  });

  revalidatePath("/");
  revalidatePath(`/groups/${group.id}`);
  redirect(localizePath(`/groups/${group.id}`, await getLocale()));
}

async function requireGroupOwner(groupId: string, userId: string) {
  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });

  if (membership?.role !== "OWNER") {
    throw new Error("Only the group owner can manage members.");
  }

  return membership;
}

export async function removeGroupMember(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const groupId = parseText(formData.get("groupId"));
  const targetUserId = parseText(formData.get("targetUserId"));

  if (!groupId || !targetUserId) {
    throw new Error("Group and member are required.");
  }

  await requireGroupOwner(groupId, currentUser.id);

  if (targetUserId === currentUser.id) {
    throw new Error("Use the leave group action to leave your own group.");
  }

  const targetMembership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: targetUserId,
        groupId,
      },
    },
  });

  if (!targetMembership) {
    throw new Error("That member is not in this group.");
  }

  await prisma.$transaction([
    prisma.prediction.deleteMany({
      where: {
        groupId,
        userId: targetUserId,
      },
    }),
    prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: targetUserId,
          groupId,
        },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath(`/groups/${groupId}`);
}

export async function leaveGroup(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const groupId = parseText(formData.get("groupId"));
  const newOwnerUserId = parseText(formData.get("newOwnerUserId"));

  if (!groupId) {
    throw new Error("Group is required.");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: currentUser.id,
        groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this group.");
  }

  if (membership.role === "OWNER") {
    if (!newOwnerUserId || newOwnerUserId === currentUser.id) {
      throw new Error("Choose a new owner before leaving this group.");
    }

    const newOwnerMembership = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: newOwnerUserId,
          groupId,
        },
      },
    });

    if (!newOwnerMembership) {
      throw new Error("The new owner must be a member of this group.");
    }
  }

  await prisma.$transaction(async (tx) => {
    if (membership.role === "OWNER") {
      await tx.group.update({
        where: { id: groupId },
        data: { creatorId: newOwnerUserId },
      });
      await tx.groupMember.update({
        where: {
          userId_groupId: {
            userId: newOwnerUserId,
            groupId,
          },
        },
        data: { role: "OWNER" },
      });
    }

    await tx.prediction.deleteMany({
      where: {
        groupId,
        userId: currentUser.id,
      },
    });
    await tx.groupMember.delete({
      where: {
        userId_groupId: {
          userId: currentUser.id,
          groupId,
        },
      },
    });
  });

  revalidatePath("/");
  revalidatePath(`/groups/${groupId}`);
  redirect(localizePath("/", await getLocale()));
}

export async function deleteGroup(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const groupId = parseText(formData.get("groupId"));

  if (!groupId) {
    throw new Error("Group is required.");
  }

  await requireGroupOwner(groupId, currentUser.id);

  await prisma.$transaction([
    prisma.prediction.deleteMany({ where: { groupId } }),
    prisma.groupMember.deleteMany({ where: { groupId } }),
    prisma.group.delete({ where: { id: groupId } }),
  ]);

  revalidatePath("/");
  redirect(localizePath("/", await getLocale()));
}

export async function savePrediction(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const groupId = String(formData.get("groupId") ?? "");
  const matchId = String(formData.get("matchId") ?? "");
  const copyGroupIds = formData
    .getAll("copyGroupIds")
    .map((value) => String(value))
    .filter((value) => value && value !== groupId);

  if (!groupId || !matchId) {
    throw new Error("Group and match are required.");
  }

  const [membership, match, matches] = await Promise.all([
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
    prisma.match.findMany({
      orderBy: { kickoffAt: "asc" },
    }),
  ]);

  if (!membership) {
    throw new Error("You are not a member of this group.");
  }

  if (!match) {
    throw new Error("Match not found.");
  }

  const predictionDeadline = getPredictionDeadline(match, matches);

  if (predictionDeadline <= new Date()) {
    throw new Error("Predictions are locked after the prediction deadline.");
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
      lockedAt: predictionDeadline,
    },
    create: {
      predictedHome,
      predictedAway,
      lockedAt: predictionDeadline,
      userId: currentUser.id,
      groupId,
      matchId,
    },
  });

  let copiedGroupIds: string[] = [];

  if (copyGroupIds.length > 0) {
    const uniqueCopyGroupIds = [...new Set(copyGroupIds)];
    const [targetMemberships, existingPredictions] = await Promise.all([
      prisma.groupMember.findMany({
        where: {
          userId: currentUser.id,
          groupId: {
            in: uniqueCopyGroupIds,
          },
        },
        select: {
          groupId: true,
        },
      }),
      prisma.prediction.findMany({
        where: {
          userId: currentUser.id,
          matchId,
          groupId: {
            in: uniqueCopyGroupIds,
          },
        },
        select: {
          groupId: true,
        },
      }),
    ]);
    const existingGroupIds = new Set(
      existingPredictions.map((prediction) => prediction.groupId),
    );
    const targetGroupIds = targetMemberships
      .map((targetMembership) => targetMembership.groupId)
      .filter((targetGroupId) => !existingGroupIds.has(targetGroupId));

    if (targetGroupIds.length > 0) {
      await prisma.prediction.createMany({
        data: targetGroupIds.map((targetGroupId) => ({
          predictedHome,
          predictedAway,
          lockedAt: predictionDeadline,
          userId: currentUser.id,
          groupId: targetGroupId,
          matchId,
        })),
        skipDuplicates: true,
      });
      copiedGroupIds = targetGroupIds;
    }
  }

  revalidatePath(`/groups/${groupId}`);
  copiedGroupIds.forEach((targetGroupId) => {
    revalidatePath(`/groups/${targetGroupId}`);
  });

  return copiedGroupIds;
}

type PredictionSaveState = {
  savedAt: number;
  copiedGroupIds: string[];
};

export async function savePredictionWithFeedback(
  state: PredictionSaveState,
  formData: FormData,
) {
  const copiedGroupIds = await savePrediction(formData);

  return {
    savedAt: Date.now(),
    copiedGroupIds: [...new Set([...state.copiedGroupIds, ...copiedGroupIds])],
  };
}

export async function syncWorldCupData() {
  await requireCurrentUser();
  await syncWorldCupMatches();
  revalidatePath("/admin/results");
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
    include: {
      match: {
        select: {
          stage: true,
        },
      },
    },
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
            prediction.match.stage,
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
