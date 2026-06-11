import type { NextRequest } from "next/server";
import { syncLiveWorldCupMatches } from "@/lib/match-sync";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncLiveWorldCupMatches();
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Live sync failed",
      },
      { status: 500 },
    );
  }
}
