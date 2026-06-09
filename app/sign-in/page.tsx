import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthForm } from "@/components/auth-forms";
import { SectionCard } from "@/components/section-card";
import { SettingsMenu } from "@/components/settings-menu";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, getTranslations, localizePath } from "@/lib/i18n";

type SignInPageProps = {
  searchParams: Promise<{
    mode?: string;
    email?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const user = await getCurrentUser();
  const locale = await getLocale();
  const t = getTranslations(locale);
  const { mode, email = "", error } = await searchParams;
  const authMode = mode === "register" ? "register" : "login";
  const hasNoAccountError = error === "no_account";
  const hasAccountExistsError = error === "account_exists";

  if (user) {
    redirect(localizePath("/", locale));
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:42px_42px] opacity-15" />
      <section className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-8 lg:px-10">
        <div className="w-full">
          <div className="mb-8 flex justify-end">
            <SettingsMenu currentLocale={locale} labels={t.settings} />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="pt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pitch-700">
                {authMode === "register" ? t.auth.registerEyebrow : t.auth.loginEyebrow}
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-tight text-ink sm:text-6xl">
                {authMode === "register" ? t.auth.registerTitle : t.auth.loginTitle}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
                {authMode === "register" ? t.auth.registerCopy : t.auth.loginCopy}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
                  href={localizePath("/", locale)}
                >
                  {t.common.backHome}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <SectionCard eyebrow={t.auth.authEyebrow} title={t.auth.authCardTitle}>
              {hasNoAccountError ? (
                <div className="mb-4 rounded-2xl border border-black/5 bg-white p-4 text-sm leading-6 text-slate-700">
                  <p className="font-semibold text-ink">{t.auth.noAccountTitle}</p>
                  <p className="mt-1">{t.auth.noAccountCopy}</p>
                  <div className="mt-3">
                    <Link
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      href={`${localizePath("/register", locale)}?email=${encodeURIComponent(email)}`}
                    >
                      {t.auth.registerNow}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : null}

              {hasAccountExistsError ? (
                <div className="mb-4 rounded-2xl border border-black/5 bg-white p-4 text-sm leading-6 text-slate-700">
                  <p className="font-semibold text-ink">{t.auth.accountExistsTitle}</p>
                  <p className="mt-1">{t.auth.accountExistsCopy}</p>
                  <div className="mt-3">
                    <Link
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      href={`${localizePath("/sign-in", locale)}?email=${encodeURIComponent(email)}`}
                    >
                      {t.auth.login}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : null}

              <AuthForm
                labels={{
                  email: t.auth.email,
                  emailPlaceholder: t.auth.emailPlaceholder,
                  username: t.auth.username,
                  usernamePlaceholder: t.auth.usernamePlaceholder,
                  sendCode: t.auth.sendCode,
                  verificationCode: t.auth.verificationCode,
                  verificationCodePlaceholder: t.auth.verificationCodePlaceholder,
                  developmentCode: t.auth.developmentCode,
                  verifyAndSignIn: t.auth.verifyAndSignIn,
                }}
                mode={authMode}
                defaultEmail={email}
              />
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {authMode === "register" ? t.auth.registerCopy : t.auth.loginCopy}
              </p>
              <div className="mt-4">
                <Link
                  className="text-sm font-medium text-pitch-800 underline underline-offset-4"
                  href={
                    authMode === "register"
                      ? localizePath("/sign-in", locale)
                      : localizePath("/register", locale)
                  }
                >
                  {authMode === "register" ? t.auth.switchToLogin : t.auth.switchToRegister}
                </Link>
              </div>
            </SectionCard>
          </div>
        </div>
      </section>
    </main>
  );
}
