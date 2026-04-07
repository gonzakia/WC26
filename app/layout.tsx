import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "WC26 Predictions",
  description: "Create private groups, predict World Cup matches, and compete on a live leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <div className="min-h-screen">
          {children}
          <footer className="border-t border-black/5 bg-white/60 px-6 py-4 text-center text-xs text-slate-500 backdrop-blur">
            Data provided by football-data.org
          </footer>
        </div>
      </body>
    </html>
  );
}
