import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "es"] as const;
type Locale = (typeof locales)[number];
const localeCookieName = "wc26_locale";
const localeHeaderName = "x-wc26-locale";

function getLocaleFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as Locale) ? (segment as Locale) : null;
}

function stripLocale(pathname: string, locale: Locale) {
  const stripped = pathname.slice(locale.length + 1);
  return stripped || "/";
}

function rewriteRegister(pathname: string, search: string) {
  if (pathname !== "/register") {
    return `${pathname}${search}`;
  }

  const params = new URLSearchParams(search);
  params.set("mode", "register");
  return `/sign-in?${params.toString()}`;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathLocale = getLocaleFromPath(url.pathname);
  const locale = pathLocale ?? request.cookies.get(localeCookieName)?.value ?? "en";

  const headers = new Headers(request.headers);
  headers.set(localeHeaderName, locales.includes(locale as Locale) ? locale : "en");

  if (pathLocale) {
    url.pathname = stripLocale(url.pathname, pathLocale);
  }

  const rewritten = rewriteRegister(url.pathname, url.search);
  const target = new URL(rewritten, request.url);
  const shouldRewrite =
    pathLocale ||
    target.pathname !== request.nextUrl.pathname ||
    target.search !== request.nextUrl.search;
  const response = shouldRewrite
    ? NextResponse.rewrite(target, {
        request: {
          headers,
        },
      })
    : NextResponse.next({
        request: {
          headers,
        },
      });

  if (pathLocale) {
    response.cookies.set(localeCookieName, pathLocale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
