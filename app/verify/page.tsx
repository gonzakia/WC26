import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { VerifyCodeForm } from "@/components/auth-forms";
import { SectionCard } from "@/components/section-card";
import { getCurrentUser } from "@/lib/auth";

type VerifyPageProps = {
  searchParams: Promise<{
    email?: string;
    devCode?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const { email = "", devCode } = await searchParams;

  if (!email) {
    redirect("/sign-in");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
              Verify sign-in
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              Enter the one-time code for {email}.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              The code expires after 15 minutes and can only be used once.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                href="/sign-in"
              >
                Request a new code
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <SectionCard eyebrow="Code" title="Finish signing in">
            <VerifyCodeForm devCode={devCode} email={email} />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              In production, you would normally receive this code by email.
            </p>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
