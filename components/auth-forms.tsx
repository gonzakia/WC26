import { signInOrCreateUser, signOut, verifySignInCode } from "@/app/actions";

type AuthLabels = {
  email: string;
  emailPlaceholder: string;
  displayName: string;
  displayNamePlaceholder: string;
  sendCode: string;
  verificationCode: string;
  verificationCodePlaceholder: string;
  developmentCode: string;
  verifyAndSignIn: string;
};

export function AuthForm({ labels }: { labels: AuthLabels }) {
  return (
    <form action={signInOrCreateUser} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          {labels.email}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-pitch-500"
          id="email"
          name="email"
          placeholder={labels.emailPlaceholder}
          required
          type="email"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="displayName">
          {labels.displayName}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-pitch-500"
          id="displayName"
          name="displayName"
          placeholder={labels.displayNamePlaceholder}
          type="text"
        />
      </div>

      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        {labels.sendCode}
      </button>
    </form>
  );
}

export function VerifyCodeForm({
  email,
  devCode,
  labels,
}: {
  email: string;
  devCode?: string;
  labels: AuthLabels;
}) {
  return (
    <form action={verifySignInCode} className="space-y-4">
      <input name="email" type="hidden" value={email} />

      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="code">
          {labels.verificationCode}
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-[0.3em] text-ink outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-pitch-500"
          id="code"
          inputMode="numeric"
          maxLength={6}
          name="code"
          placeholder={labels.verificationCodePlaceholder}
          required
          type="text"
        />
      </div>

      {devCode ? (
        <div className="rounded-2xl border border-dashed border-pitch-300 bg-pitch-50 p-4 text-sm text-pitch-900">
          {labels.developmentCode}: <span className="font-semibold">{devCode}</span>
        </div>
      ) : null}

      <button
        className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        {labels.verifyAndSignIn}
      </button>
    </form>
  );
}

export function SignOutButton({ label }: { label: string }) {
  return (
    <form action={signOut}>
      <button
        className="rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
