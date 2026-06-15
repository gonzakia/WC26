import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist } from "next/font/google";
import { AppMenu } from "@/components/app-menu";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getTranslations } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import {
  defaultThemeColor,
  defaultThemeMode,
  isThemeColor,
  isThemeMode,
  themeColorCookieName,
  themeModeCookieName,
} from "@/lib/themes";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "WC26 Predictions",
  description: "Create private groups, predict World Cup matches, and compete on a live leaderboard.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const currentUser = await getCurrentUser();
  const cookieStore = await cookies();
  const themeColorCookie = cookieStore.get(themeColorCookieName)?.value;
  const themeModeCookie = cookieStore.get(themeModeCookieName)?.value;
  const themeColor = isThemeColor(themeColorCookie)
    ? themeColorCookie
    : defaultThemeColor;
  const themeMode = isThemeMode(themeModeCookie)
    ? themeModeCookie
    : defaultThemeMode;
  const memberships = currentUser
    ? await prisma.groupMember.findMany({
        where: { userId: currentUser.id },
        include: {
          group: true,
        },
        orderBy: {
          group: {
            createdAt: "desc",
          },
        },
      })
    : [];

  return (
    <html data-mode={themeMode} data-theme={themeColor} lang={locale}>
      <body className={geist.variable}>
        <div className="min-h-screen">
          <AppMenu
            currentLocale={locale}
            groups={memberships.map((membership) => ({
              id: membership.group.id,
              name: membership.group.name,
            }))}
            isSignedIn={Boolean(currentUser)}
            labels={t.appMenu}
          />
          {children}
          <footer className="border-t border-black/5 bg-white/60 px-6 py-4 text-center text-xs text-slate-500 backdrop-blur">
            {t.footer}
          </footer>
        </div>
      </body>
    </html>
  );
}
