import { getCurrentUser } from "@/lib/auth";
import { syncLiveWorldCupMatches } from "@/lib/match-sync";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
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
