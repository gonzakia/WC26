export const themeColors = ["green", "blue", "red", "purple", "orange", "yellow"] as const;
export const themeModes = ["light", "dark"] as const;

export type ThemeColor = (typeof themeColors)[number];
export type ThemeMode = (typeof themeModes)[number];

export const defaultThemeColor: ThemeColor = "green";
export const defaultThemeMode: ThemeMode = "light";

export const themeColorCookieName = "wc26_theme_color";
export const themeModeCookieName = "wc26_theme_mode";

export function isThemeColor(value: string | undefined): value is ThemeColor {
  return Boolean(value && themeColors.includes(value as ThemeColor));
}

export function isThemeMode(value: string | undefined): value is ThemeMode {
  return Boolean(value && themeModes.includes(value as ThemeMode));
}
