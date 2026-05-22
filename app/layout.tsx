import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getLocale, getTranslations } from "@/lib/i18n";
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

  return (
    <html lang={locale}>
      <body className={geist.variable}>
        <div className="min-h-screen">
          {children}
          <footer className="border-t border-black/5 bg-white/60 px-6 py-4 text-center text-xs text-slate-500 backdrop-blur">
            {t.footer}
          </footer>
        </div>
      </body>
    </html>
  );
}
