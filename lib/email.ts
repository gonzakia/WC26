import { getOptionalEnv, getRequiredEnv } from "@/lib/env";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function canSendEmail() {
  return Boolean(getOptionalEnv("RESEND_API_KEY") && getOptionalEnv("EMAIL_FROM"));
}

export async function sendSignInCodeEmail({
  code,
  email,
  expiresInMinutes,
}: {
  code: string;
  email: string;
  expiresInMinutes: number;
}) {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const from = getRequiredEnv("EMAIL_FROM");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your WC26 Predictions sign-in code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #101828;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">WC26 Predictions</h1>
          <p>Use this one-time sign-in code to access your account:</p>
          <p style="font-size: 32px; font-weight: 700; letter-spacing: 0.24em; margin: 24px 0;">
            ${escapeHtml(code)}
          </p>
          <p>This code expires in ${expiresInMinutes} minutes and can only be used once.</p>
          <p>If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${errorText}`);
  }
}
