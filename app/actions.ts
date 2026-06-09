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

  redirect(redirectTo);
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

  if (!email || !code) {
    throw new Error("Email and verification code are required.");
  }

  const loginCode = await consumeLoginCode(email, code);

  if (!loginCode) {
    throw new Error("That code is invalid or expired.");
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
  redirect(localizePath("/", await getLocale()));
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

export async function savePrediction(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const groupId = String(formData.get("groupId") ?? "");
  const matchId = String(formData.get("matchId") ?? "");

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

  revalidatePath(`/groups/${groupId}`);
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
