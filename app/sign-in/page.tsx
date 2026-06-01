import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthForm } from "@/components/auth-forms";
import { SectionCard } from "@/components/section-card";
import { SettingsMenu } from "@/components/settings-menu";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getTranslations } from "@/lib/i18n";

export default async function SignInPage() {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const t = getTranslations(locale);

  if (user) {
    redirect("/");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-6 flex justify-end">
              <SettingsMenu currentLocale={locale} labels={t.settings} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
              {t.auth.appName}
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              {t.auth.signInTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              {t.auth.signInCopy}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
                {t.auth.localAuth}
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                href="/"
              >
                {t.common.backHome}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <SectionCard eyebrow={t.auth.authEyebrow} title={t.auth.authCardTitle}>
            <AuthForm
              labels={{
                email: t.auth.email,
                emailPlaceholder: t.auth.emailPlaceholder,
                displayName: t.auth.displayName,
                displayNamePlaceholder: t.auth.displayNamePlaceholder,
                sendCode: t.auth.sendCode,
                verificationCode: t.auth.verificationCode,
                verificationCodePlaceholder: t.auth.verificationCodePlaceholder,
                developmentCode: t.auth.developmentCode,
                verifyAndSignIn: t.auth.verifyAndSignIn,
              }}
            />
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {t.auth.authCardCopy}
            </p>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
