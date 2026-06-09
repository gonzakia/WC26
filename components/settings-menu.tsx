"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Globe, Settings } from "lucide-react";
import { setLanguage } from "@/app/actions";
import type { Locale } from "@/lib/i18n";

type SettingsMenuProps = {
  currentLocale: Locale;
  labels: {
    title: string;
    language: string;
    english: string;
    spanish: string;
  };
};

function stripLocalePrefix(pathname: string) {
  if (pathname === "/es") {
    return "/";
  }

  if (pathname.startsWith("/es/")) {
    return pathname.slice(3) || "/";
  }

  return pathname;
}

function localizePath(pathname: string, locale: Locale) {
  const stripped = stripLocalePrefix(pathname);

  if (locale === "en") {
    return stripped;
  }

  return stripped === "/" ? "/es" : `/es${stripped}`;
}

export function SettingsMenu({ currentLocale, labels }: SettingsMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Settings className="h-4 w-4" />
        {labels.title}
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-3 w-64 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-glow">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Globe className="h-4 w-4" />
            {labels.language}
          </div>

          <div className="mt-3 space-y-2">
            {([
              ["en", labels.english],
              ["es", labels.spanish],
            ] as const).map(([locale, label]) => (
              <form action={setLanguage} key={locale}>
                <input name="locale" type="hidden" value={locale} />
                <input name="redirectTo" type="hidden" value={localizePath(pathname, locale)} />
                <button
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    currentLocale === locale
                      ? "bg-pitch-50 text-pitch-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  type="submit"
                >
                  <span>{label}</span>
                  {currentLocale === locale ? (
                    <span className="text-xs uppercase tracking-[0.18em]">OK</span>
                  ) : null}
                </button>
              </form>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
