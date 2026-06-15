"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  LogIn,
  Menu,
  Plus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

type AppMenuGroup = {
  id: string;
  name: string;
};

type AppMenuProps = {
  currentLocale: Locale;
  groups: AppMenuGroup[];
  isSignedIn: boolean;
  labels: {
    title: string;
    rules: string;
    snapshot: string;
    myGroups: string;
    createGroup: string;
    joinGroup: string;
    noGroups: string;
    signIn: string;
    register: string;
  };
};

function localizePath(path: string, locale: Locale) {
  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path}`;
}

export function AppMenu({
  currentLocale,
  groups,
  isSignedIn,
  labels,
}: AppMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(true);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dashboardLinks = [
    {
      href: localizePath("/#rules", currentLocale),
      label: labels.rules,
      icon: BookOpen,
    },
    {
      href: localizePath("/#matchday-snapshot", currentLocale),
      label: labels.snapshot,
      icon: CalendarDays,
    },
    {
      href: localizePath("/#my-groups", currentLocale),
      label: labels.myGroups,
      icon: Users,
    },
    {
      href: localizePath("/#create-group", currentLocale),
      label: labels.createGroup,
      icon: Plus,
    },
    {
      href: localizePath("/#join-group", currentLocale),
      label: labels.joinGroup,
      icon: UserPlus,
    },
  ];

  return (
    <div className="fixed bottom-5 left-5 z-30">
      {open ? (
        <div className="mb-3 w-[min(calc(100vw-2.5rem),22rem)] overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white/95 shadow-glow backdrop-blur">
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
            <p className="text-sm font-semibold text-ink">{labels.title}</p>
            <button
              aria-label="Close menu"
              className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-ink"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-3">
            {isSignedIn ? (
              <>
                <div className="space-y-2">
                  {dashboardLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-pitch-50 hover:text-pitch-900"
                      href={href}
                      key={href}
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                <button
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-slate-50"
                  onClick={() => setGroupsOpen((value) => !value)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    {labels.myGroups}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition ${groupsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {groupsOpen ? (
                  <div className="mt-2 max-h-52 space-y-2 overflow-y-auto pl-2">
                    {groups.length > 0 ? (
                      groups.map((group) => (
                        <Link
                          className="block rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-pitch-50 hover:text-pitch-900"
                          href={localizePath(`/groups/${group.id}`, currentLocale)}
                          key={group.id}
                          onClick={() => setOpen(false)}
                        >
                          {group.name}
                        </Link>
                      ))
                    ) : (
                      <p className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {labels.noGroups}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
              </>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href={localizePath("/sign-in", currentLocale)}
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  {labels.signIn}
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
                  href={localizePath("/register", currentLocale)}
                  onClick={() => setOpen(false)}
                >
                  {labels.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <button
        className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-3 text-sm font-semibold text-ink shadow-glow backdrop-blur transition hover:bg-white"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Menu className="h-4 w-4" />
        {labels.title}
      </button>
    </div>
  );
}
