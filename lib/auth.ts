import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { canSendEmail, sendSignInCodeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "wc26_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashCode(email: string, code: string) {
  return createHash("sha256")
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

export async function createLoginCode(email: string, displayNameHint?: string) {
  const normalizedEmail = email.toLowerCase();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashCode(normalizedEmail, code);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await prisma.loginCode.deleteMany({
    where: {
      email: normalizedEmail,
      OR: [
        { usedAt: null },
        {
          expiresAt: {
            lt: new Date(),
          },
        },
      ],
    },
  });

  await prisma.loginCode.create({
    data: {
      email: normalizedEmail,
      codeHash,
      displayNameHint: displayNameHint?.trim() || null,
      expiresAt,
    },
  });

  let emailSent = false;

  if (canSendEmail()) {
    try {
      await sendSignInCodeEmail({
        email: normalizedEmail,
        code,
        expiresInMinutes: 15,
      });
      emailSent = true;
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw error;
      }

      console.warn("Falling back to development sign-in code:", error);
    }
  }

  return {
    code,
    expiresAt,
    emailSent,
  };
}

export async function consumeLoginCode(email: string, code: string) {
  const normalizedEmail = email.toLowerCase();
  const normalizedCode = code.replace(/\D/g, "");
  const codeHash = hashCode(normalizedEmail, normalizedCode);

  const loginCode = await prisma.loginCode.findUnique({
    where: { codeHash },
  });

  if (!loginCode) {
    return null;
  }

  if (loginCode.email !== normalizedEmail) {
    return null;
  }

  if (loginCode.usedAt || loginCode.expiresAt <= new Date()) {
    return null;
  }

  const consumed = await prisma.loginCode.update({
    where: { id: loginCode.id },
    data: { usedAt: new Date() },
  });

  return consumed;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      tokenHash,
      expiresAt,
      userId,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    return null;
  }

  return session.user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
