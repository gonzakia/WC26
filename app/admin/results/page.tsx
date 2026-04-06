import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ResultForm } from "@/components/result-form";
import { prisma } from "@/lib/prisma";

export default async function AdminResultsPage() {
  const matches = await prisma.match.findMany({
    orderBy: { kickoffAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf5ea_0%,#f0e6d3_100%)] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-ink"
          href="/"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-glow backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pitch-700">
            Admin
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Enter final match scores
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            This is the simplest admin workflow for now. Confirm a score here and
            the app will store awarded points for every prediction on that match.
          </p>

          <div className="mt-8 space-y-5">
            {matches.map((match) => (
              <ResultForm key={match.id} match={match} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
