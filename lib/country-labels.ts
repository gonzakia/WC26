const COUNTRY_LABELS_ES: Record<string, string> = {
  algeria: "Argelia",
  argentina: "Argentina",
  australia: "Australia",
  austria: "Austria",
  belgium: "Bélgica",
  "bosnia-herzegovina": "Bosnia y Herzegovina",
  "bosnia and herzegovina": "Bosnia y Herzegovina",
  brazil: "Brasil",
  canada: "Canadá",
  "cape verde islands": "Cabo Verde",
  colombia: "Colombia",
  "congo dr": "RD Congo",
  croatia: "Croacia",
  curaçao: "Curaçao",
  czechia: "Chequia",
  ecuador: "Ecuador",
  egypt: "Egipto",
  england: "Inglaterra",
  france: "Francia",
  germany: "Alemania",
  ghana: "Ghana",
  haiti: "Haití",
  iran: "Irán",
  iraq: "Irak",
  "ivory coast": "Costa de Marfil",
  "cote d'ivoire": "Costa de Marfil",
  "côte d'ivoire": "Costa de Marfil",
  japan: "Japón",
  jordan: "Jordania",
  mexico: "México",
  morocco: "Marruecos",
  netherlands: "Países Bajos",
  "new zealand": "Nueva Zelanda",
  norway: "Noruega",
  panama: "Panamá",
  paraguay: "Paraguay",
  portugal: "Portugal",
  qatar: "Catar",
  "saudi arabia": "Arabia Saudita",
  scotland: "Escocia",
  senegal: "Senegal",
  "south africa": "Sudáfrica",
  "south korea": "Corea del Sur",
  spain: "España",
  sweden: "Suecia",
  switzerland: "Suiza",
  tunisia: "Túnez",
  turkey: "Turquía",
  uruguay: "Uruguay",
  "united states": "Estados Unidos",
  "united states of america": "Estados Unidos",
  usa: "Estados Unidos",
  uzbekistan: "Uzbekistán",
};

const FLAG_EMOJIS: Record<string, string> = {
  algeria: "🇩🇿",
  argentina: "🇦🇷",
  australia: "🇦🇺",
  austria: "🇦🇹",
  belgium: "🇧🇪",
  "bosnia-herzegovina": "🇧🇦",
  "bosnia and herzegovina": "🇧🇦",
  brazil: "🇧🇷",
  canada: "🇨🇦",
  "cape verde": "🇨🇻",
  "cape verde islands": "🇨🇻",
  colombia: "🇨🇴",
  "congo dr": "🇨🇩",
  croatia: "🇭🇷",
  curaçao: "🇨🇼",
  czechia: "🇨🇿",
  ecuador: "🇪🇨",
  egypt: "🇪🇬",
  england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  france: "🇫🇷",
  germany: "🇩🇪",
  ghana: "🇬🇭",
  haiti: "🇭🇹",
  iran: "🇮🇷",
  iraq: "🇮🇶",
  "ivory coast": "🇨🇮",
  "cote d'ivoire": "🇨🇮",
  "côte d'ivoire": "🇨🇮",
  japan: "🇯🇵",
  jordan: "🇯🇴",
  mexico: "🇲🇽",
  morocco: "🇲🇦",
  netherlands: "🇳🇱",
  "new zealand": "🇳🇿",
  norway: "🇳🇴",
  panama: "🇵🇦",
  paraguay: "🇵🇾",
  portugal: "🇵🇹",
  qatar: "🇶🇦",
  "saudi arabia": "🇸🇦",
  scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  senegal: "🇸🇳",
  "south africa": "🇿🇦",
  "south korea": "🇰🇷",
  spain: "🇪🇸",
  sweden: "🇸🇪",
  switzerland: "🇨🇭",
  tunisia: "🇹🇳",
  turkey: "🇹🇷",
  uruguay: "🇺🇾",
  "united states": "🇺🇸",
  "united states of america": "🇺🇸",
  usa: "🇺🇸",
  uzbekistan: "🇺🇿",
};

function normalizeCountryName(teamName: string) {
  return teamName.trim().toLowerCase();
}

export function getCountryLabel(teamName: string, locale: string) {
  if (!locale.startsWith("es")) {
    return teamName;
  }

  const normalized = normalizeCountryName(teamName);
  return COUNTRY_LABELS_ES[normalized] ?? teamName;
}

export function getCountryFlag(teamName: string) {
  const normalized = normalizeCountryName(teamName);

  if (FLAG_EMOJIS[normalized]) {
    return FLAG_EMOJIS[normalized];
  }

  const matchedKey = Object.keys(FLAG_EMOJIS).find((key) =>
    normalized.includes(key),
  );

  return matchedKey ? FLAG_EMOJIS[matchedKey] : "🏳️";
}
