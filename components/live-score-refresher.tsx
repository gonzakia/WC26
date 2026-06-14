"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LiveScoreRefresher() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function refreshLiveScores() {
      try {
        const response = await fetch("/api/live-scores", {
          cache: "no-store",
        });

        if (active && response.ok) {
          router.refresh();
        }
      } catch {
        // The next interval will retry. Avoid interrupting the live page.
      }
    }

    refreshLiveScores();
    const interval = window.setInterval(refreshLiveScores, 30 * 1000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [router]);

  return null;
}
