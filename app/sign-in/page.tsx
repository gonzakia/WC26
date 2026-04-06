import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthForm } from "@/components/auth-forms";
import { SectionCard } from "@/components/section-card";
import { getCurrentUser } from "@/lib/auth";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
              WC26 Predictions
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              Sign in and start building your own World Cup prediction league.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              This project now uses a simple cookie session backed by Prisma so
              you can learn how real users, groups, and predictions fit together.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
                Local auth, no provider required
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                href="/"
              >
                Back home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <SectionCard eyebrow="Auth" title="Use any email to sign in">
            <AuthForm />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              If the email already exists, you will sign in. If it does not,
              the app creates a new user with the display name you provide.
            </p>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
