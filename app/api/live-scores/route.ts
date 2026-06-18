import { syncLiveWorldCupMatches } from "@/lib/match-sync";

export async function GET() {
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
