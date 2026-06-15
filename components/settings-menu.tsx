"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe, Moon, Palette, Settings, Sun } from "lucide-react";
import { setLanguage } from "@/app/actions";
import type { Locale } from "@/lib/i18n";
import {
  defaultThemeColor,
  defaultThemeMode,
  isThemeColor,
  isThemeMode,
  themeColorCookieName,
  themeColors,
  themeModeCookieName,
  type ThemeColor,
  type ThemeMode,
} from "@/lib/themes";

type SettingsMenuProps = {
  currentLocale: Locale;
  labels: {
    title: string;
    language: string;
    english: string;
    spanish: string;
    theme: string;
    appearance: string;
    lightMode: string;
    darkMode: string;
    themeGreen: string;
    themeBlue: string;
    themeRed: string;
    themePurple: string;
    themeOrange: string;
    themeYellow: string;
  };
};

const themeLabels: Record<ThemeColor, keyof SettingsMenuProps["labels"]> = {
  green: "themeGreen",
  blue: "themeBlue",
  red: "themeRed",
  purple: "themePurple",
  orange: "themeOrange",
  yellow: "themeYellow",
};

const themeSwatches: Record<ThemeColor, string> = {
  green: "bg-[#3f9938]",
  blue: "bg-[#3b82f6]",
  red: "bg-[#f43f5e]",
  purple: "bg-[#8b5cf6]",
  orange: "bg-[#f97316]",
  yellow: "bg-[#eab308]",
};

function stripLocalePrefix(pathname: string) {
  if (pathname === "/en" || pathname === "/es") {
    return "/";
  }

  if (pathname.startsWith("/en/")) {
    return pathname.slice(3) || "/";
  }

  if (pathname.startsWith("/es/")) {
    return pathname.slice(3) || "/";
  }

  return pathname;
}

function localizePath(pathname: string, locale: Locale) {
  const stripped = stripLocalePrefix(pathname);

  return stripped === "/" ? `/${locale}` : `/${locale}${stripped}`;
}

export function SettingsMenu({ currentLocale, labels }: SettingsMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [currentThemeColor, setCurrentThemeColor] =
    useState<ThemeColor>(defaultThemeColor);
  const [currentThemeMode, setCurrentThemeMode] =
    useState<ThemeMode>(defaultThemeMode);

  useEffect(() => {
    const storedColor = window.localStorage.getItem(themeColorCookieName);
    const storedMode = window.localStorage.getItem(themeModeCookieName);
    const documentColor = document.documentElement.dataset.theme;
    const documentMode = document.documentElement.dataset.mode;
    let initialColor: ThemeColor = defaultThemeColor;
    let initialMode: ThemeMode = defaultThemeMode;

    if (isThemeColor(storedColor ?? undefined)) {
      initialColor = storedColor as ThemeColor;
    } else if (isThemeColor(documentColor ?? undefined)) {
      initialColor = documentColor as ThemeColor;
    }

    if (isThemeMode(storedMode ?? undefined)) {
      initialMode = storedMode as ThemeMode;
    } else if (isThemeMode(documentMode ?? undefined)) {
      initialMode = documentMode as ThemeMode;
    }

    setCurrentThemeColor(initialColor);
    setCurrentThemeMode(initialMode);
    document.documentElement.dataset.theme = initialColor;
    document.documentElement.dataset.mode = initialMode;
  }, []);

  function chooseThemeColor(themeColor: ThemeColor) {
    setCurrentThemeColor(themeColor);
    document.documentElement.dataset.theme = themeColor;
    window.localStorage.setItem(themeColorCookieName, themeColor);
    document.cookie = `${themeColorCookieName}=${themeColor}; path=/; max-age=31536000; samesite=lax`;
  }

  function chooseThemeMode(themeMode: ThemeMode) {
    setCurrentThemeMode(themeMode);
    document.documentElement.dataset.mode = themeMode;
    window.localStorage.setItem(themeModeCookieName, themeMode);
    document.cookie = `${themeModeCookieName}=${themeMode}; path=/; max-age=31536000; samesite=lax`;
  }

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
        <div className="fixed inset-x-4 top-20 z-20 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-glow sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-72">
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

          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Palette className="h-4 w-4" />
              {labels.theme}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {themeColors.map((themeColor) => (
                <button
                  className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium transition ${
                    currentThemeColor === themeColor
                      ? "bg-pitch-50 text-pitch-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  key={themeColor}
                  onClick={() => chooseThemeColor(themeColor)}
                  type="button"
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border border-black/10 ${themeSwatches[themeColor]}`}
                  />
                  <span className="min-w-0 truncate">
                    {labels[themeLabels[themeColor]]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Sun className="h-4 w-4" />
              {labels.appearance}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {([
                ["light", labels.lightMode, Sun],
                ["dark", labels.darkMode, Moon],
              ] as const).map(([mode, label, Icon]) => (
                <button
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    currentThemeMode === mode
                      ? "bg-pitch-50 text-pitch-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  key={mode}
                  onClick={() => chooseThemeMode(mode)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
