import type { Locale } from "@/lib/i18n";

type LocalizedVenueName = {
  en: string;
  es: string;
};

type MatchVenueLookupInput = {
  stage: string;
  kickoffAt: Date | string | number;
  homeTeam: string;
  awayTeam: string;
  venue?: string | null;
};

type MatchIdentity = {
  stage: string;
  kickoffAt: number;
  homeTeam: string;
  awayTeam: string;
};

/*
 * Add venues here when football-data.org does not provide them:
 *
 * 1. Add each stadium once in `venues`.
 * 2. Match each game id to a stadium id in `matchVenueIds`.
 *
 * Game ids are created from the official schedule order, not from database ids
 * or football-data.org ids:
 *
 *   gs-1..gs-72, r32-1..r32-16, r16-1..r16-8, qf-1..qf-4,
 *   sf-1..sf-2, third, final
 *
 * The `gameIds` table below connects each manual id to a match by stage,
 * kickoff time, and teams. That keeps the venue mapping stable even if local DB
 * ids, slugs, or external provider ids change.
 */
export const venues: Record<string, LocalizedVenueName> = {
  mexico: {
     en: "Estadio Azteca, Mexico City, Mexico",
     es: "Estadio Azteca, Ciudad de México, México",
 }, guadalajara: {
      en: "Estadio Akron, Guadalajara, Mexico",
      es: "Estadio Akron, Guadalajara, México",
 }, monterrey: {
      en: "Estadio BBVA, Monterrey, Mexico",
      es: "Estadio BBVA, Monterrey, México",
 }, atlanta: {
      en: "Mercedes-Benz Stadium, Atlanta, Georgia",
      es: "Mercedes-Benz Stadium, Atlanta, Georgia",
 }, boston: {
      en: "Gillette Stadium, Foxborough, Massachusetts",
      es: "Gillette Stadium, Foxborough, Massachusetts",
 }, dallas: {
      en: "AT&T Stadium, Arlington, Texas",
      es: "AT&T Stadium, Arlington, Texas",
 }, houston: {
      en: "NRG Stadium, Houston, Texas",
      es: "NRG Stadium, Houston, Texas",
 }, kansas: {
      en: "Arrowhead Stadium, Kansas City, Missouri",
      es: "Arrowhead Stadium, Kansas City, Missouri",
 }, la: {
      en: "SoFi Stadium, Inglewood, California",
      es: "SoFi Stadium, Inglewood, California",
 }, miami: {
      en: "Hard Rock Stadium, Miami Gardens, Florida",
      es: "Hard Rock Stadium, Miami Gardens, Florida",
 }, nynj: {
      en: "MetLife Stadium, East Rutherford, New Jersey",
      es: "MetLife Stadium, East Rutherford, Nueva Jersey",
 }, philadelphia: {
      en: "Lincoln Financial Field, Philadelphia, Pennsylvania",
      es: "Lincoln Financial Field, Philadelphia, Pennsylvania",
 }, sf: {
      en: "Levi's Stadium, Santa Clara, California",
      es: "Levi's Stadium, Santa Clara, California",
 }, seattle: {
      en: "Lumen Field, Seattle, Washington",
      es: "Lumen Field, Seattle, Washington",
 }, toronto: {
      en: "BMO Field, Toronto, Canada",
      es: "BMO Field, Toronto, Canadá",
 }, vancouver: {
      en: "BC Place, Vancouver, Canada",
      es: "Estadio BC Place, Vancouver, Canadá",
 },
};

export const gameIds: Record<string, MatchIdentity> = {
  "gs-1": { stage: "GROUP_STAGE", kickoffAt: 1781204400000, homeTeam: "Mexico", awayTeam: "South Africa" },
  "gs-2": { stage: "GROUP_STAGE", kickoffAt: 1781229600000, homeTeam: "South Korea", awayTeam: "Czechia" },
  "gs-3": { stage: "GROUP_STAGE", kickoffAt: 1781290800000, homeTeam: "Canada", awayTeam: "Bosnia-Herzegovina" },
  "gs-4": { stage: "GROUP_STAGE", kickoffAt: 1781312400000, homeTeam: "United States", awayTeam: "Paraguay" },
  "gs-5": { stage: "GROUP_STAGE", kickoffAt: 1781377200000, homeTeam: "Qatar", awayTeam: "Switzerland" },
  "gs-6": { stage: "GROUP_STAGE", kickoffAt: 1781388000000, homeTeam: "Brazil", awayTeam: "Morocco" },
  "gs-7": { stage: "GROUP_STAGE", kickoffAt: 1781398800000, homeTeam: "Haiti", awayTeam: "Scotland" },
  "gs-8": { stage: "GROUP_STAGE", kickoffAt: 1781409600000, homeTeam: "Australia", awayTeam: "Turkey" },
  "gs-9": { stage: "GROUP_STAGE", kickoffAt: 1781456400000, homeTeam: "Germany", awayTeam: "Curaçao" },
  "gs-10": { stage: "GROUP_STAGE", kickoffAt: 1781467200000, homeTeam: "Netherlands", awayTeam: "Japan" },
  "gs-11": { stage: "GROUP_STAGE", kickoffAt: 1781478000000, homeTeam: "Ivory Coast", awayTeam: "Ecuador" },
  "gs-12": { stage: "GROUP_STAGE", kickoffAt: 1781488800000, homeTeam: "Sweden", awayTeam: "Tunisia" },
  "gs-13": { stage: "GROUP_STAGE", kickoffAt: 1781539200000, homeTeam: "Spain", awayTeam: "Cape Verde Islands" },
  "gs-14": { stage: "GROUP_STAGE", kickoffAt: 1781550000000, homeTeam: "Belgium", awayTeam: "Egypt" },
  "gs-15": { stage: "GROUP_STAGE", kickoffAt: 1781560800000, homeTeam: "Saudi Arabia", awayTeam: "Uruguay" },
  "gs-16": { stage: "GROUP_STAGE", kickoffAt: 1781571600000, homeTeam: "Iran", awayTeam: "New Zealand" },
  "gs-17": { stage: "GROUP_STAGE", kickoffAt: 1781636400000, homeTeam: "France", awayTeam: "Senegal" },
  "gs-18": { stage: "GROUP_STAGE", kickoffAt: 1781647200000, homeTeam: "Iraq", awayTeam: "Norway" },
  "gs-19": { stage: "GROUP_STAGE", kickoffAt: 1781658000000, homeTeam: "Argentina", awayTeam: "Algeria" },
  "gs-20": { stage: "GROUP_STAGE", kickoffAt: 1781668800000, homeTeam: "Austria", awayTeam: "Jordan" },
  "gs-21": { stage: "GROUP_STAGE", kickoffAt: 1781715600000, homeTeam: "Portugal", awayTeam: "Congo DR" },
  "gs-22": { stage: "GROUP_STAGE", kickoffAt: 1781726400000, homeTeam: "England", awayTeam: "Croatia" },
  "gs-23": { stage: "GROUP_STAGE", kickoffAt: 1781737200000, homeTeam: "Ghana", awayTeam: "Panama" },
  "gs-24": { stage: "GROUP_STAGE", kickoffAt: 1781748000000, homeTeam: "Uzbekistan", awayTeam: "Colombia" },
  "gs-25": { stage: "GROUP_STAGE", kickoffAt: 1781798400000, homeTeam: "Czechia", awayTeam: "South Africa" },
  "gs-26": { stage: "GROUP_STAGE", kickoffAt: 1781809200000, homeTeam: "Switzerland", awayTeam: "Bosnia-Herzegovina" },
  "gs-27": { stage: "GROUP_STAGE", kickoffAt: 1781820000000, homeTeam: "Canada", awayTeam: "Qatar" },
  "gs-28": { stage: "GROUP_STAGE", kickoffAt: 1781830800000, homeTeam: "Mexico", awayTeam: "South Korea" },
  "gs-29": { stage: "GROUP_STAGE", kickoffAt: 1781895600000, homeTeam: "United States", awayTeam: "Australia" },
  "gs-30": { stage: "GROUP_STAGE", kickoffAt: 1781906400000, homeTeam: "Scotland", awayTeam: "Morocco" },
  "gs-31": { stage: "GROUP_STAGE", kickoffAt: 1781915400000, homeTeam: "Brazil", awayTeam: "Haiti" },
  "gs-32": { stage: "GROUP_STAGE", kickoffAt: 1781924400000, homeTeam: "Turkey", awayTeam: "Paraguay" },
  "gs-33": { stage: "GROUP_STAGE", kickoffAt: 1781974800000, homeTeam: "Netherlands", awayTeam: "Sweden" },
  "gs-34": { stage: "GROUP_STAGE", kickoffAt: 1781985600000, homeTeam: "Germany", awayTeam: "Ivory Coast" },
  "gs-35": { stage: "GROUP_STAGE", kickoffAt: 1782000000000, homeTeam: "Ecuador", awayTeam: "Curaçao" },
  "gs-36": { stage: "GROUP_STAGE", kickoffAt: 1782014400000, homeTeam: "Tunisia", awayTeam: "Japan" },
  "gs-37": { stage: "GROUP_STAGE", kickoffAt: 1782057600000, homeTeam: "Spain", awayTeam: "Saudi Arabia" },
  "gs-38": { stage: "GROUP_STAGE", kickoffAt: 1782068400000, homeTeam: "Belgium", awayTeam: "Iran" },
  "gs-39": { stage: "GROUP_STAGE", kickoffAt: 1782079200000, homeTeam: "Uruguay", awayTeam: "Cape Verde Islands" },
  "gs-40": { stage: "GROUP_STAGE", kickoffAt: 1782090000000, homeTeam: "New Zealand", awayTeam: "Egypt" },
  "gs-41": { stage: "GROUP_STAGE", kickoffAt: 1782147600000, homeTeam: "Argentina", awayTeam: "Austria" },
  "gs-42": { stage: "GROUP_STAGE", kickoffAt: 1782162000000, homeTeam: "France", awayTeam: "Iraq" },
  "gs-43": { stage: "GROUP_STAGE", kickoffAt: 1782172800000, homeTeam: "Norway", awayTeam: "Senegal" },
  "gs-44": { stage: "GROUP_STAGE", kickoffAt: 1782183600000, homeTeam: "Jordan", awayTeam: "Algeria" },
  "gs-45": { stage: "GROUP_STAGE", kickoffAt: 1782234000000, homeTeam: "Portugal", awayTeam: "Uzbekistan" },
  "gs-46": { stage: "GROUP_STAGE", kickoffAt: 1782244800000, homeTeam: "England", awayTeam: "Ghana" },
  "gs-47": { stage: "GROUP_STAGE", kickoffAt: 1782255600000, homeTeam: "Panama", awayTeam: "Croatia" },
  "gs-48": { stage: "GROUP_STAGE", kickoffAt: 1782266400000, homeTeam: "Colombia", awayTeam: "Congo DR" },
  "gs-49": { stage: "GROUP_STAGE", kickoffAt: 1782327600000, homeTeam: "Bosnia-Herzegovina", awayTeam: "Qatar" },
  "gs-50": { stage: "GROUP_STAGE", kickoffAt: 1782327600000, homeTeam: "Switzerland", awayTeam: "Canada" },
  "gs-51": { stage: "GROUP_STAGE", kickoffAt: 1782338400000, homeTeam: "Morocco", awayTeam: "Haiti" },
  "gs-52": { stage: "GROUP_STAGE", kickoffAt: 1782338400000, homeTeam: "Scotland", awayTeam: "Brazil" },
  "gs-53": { stage: "GROUP_STAGE", kickoffAt: 1782349200000, homeTeam: "Czechia", awayTeam: "Mexico" },
  "gs-54": { stage: "GROUP_STAGE", kickoffAt: 1782349200000, homeTeam: "South Africa", awayTeam: "South Korea" },
  "gs-55": { stage: "GROUP_STAGE", kickoffAt: 1782417600000, homeTeam: "Curaçao", awayTeam: "Ivory Coast" },
  "gs-56": { stage: "GROUP_STAGE", kickoffAt: 1782417600000, homeTeam: "Ecuador", awayTeam: "Germany" },
  "gs-57": { stage: "GROUP_STAGE", kickoffAt: 1782428400000, homeTeam: "Japan", awayTeam: "Sweden" },
  "gs-58": { stage: "GROUP_STAGE", kickoffAt: 1782428400000, homeTeam: "Tunisia", awayTeam: "Netherlands" },
  "gs-59": { stage: "GROUP_STAGE", kickoffAt: 1782439200000, homeTeam: "Paraguay", awayTeam: "Australia" },
  "gs-60": { stage: "GROUP_STAGE", kickoffAt: 1782439200000, homeTeam: "Turkey", awayTeam: "United States" },
  "gs-61": { stage: "GROUP_STAGE", kickoffAt: 1782500400000, homeTeam: "Norway", awayTeam: "France" },
  "gs-62": { stage: "GROUP_STAGE", kickoffAt: 1782500400000, homeTeam: "Senegal", awayTeam: "Iraq" },
  "gs-63": { stage: "GROUP_STAGE", kickoffAt: 1782518400000, homeTeam: "Cape Verde Islands", awayTeam: "Saudi Arabia" },
  "gs-64": { stage: "GROUP_STAGE", kickoffAt: 1782518400000, homeTeam: "Uruguay", awayTeam: "Spain" },
  "gs-65": { stage: "GROUP_STAGE", kickoffAt: 1782529200000, homeTeam: "Egypt", awayTeam: "Iran" },
  "gs-66": { stage: "GROUP_STAGE", kickoffAt: 1782529200000, homeTeam: "New Zealand", awayTeam: "Belgium" },
  "gs-67": { stage: "GROUP_STAGE", kickoffAt: 1782594000000, homeTeam: "Croatia", awayTeam: "Ghana" },
  "gs-68": { stage: "GROUP_STAGE", kickoffAt: 1782594000000, homeTeam: "Panama", awayTeam: "England" },
  "gs-69": { stage: "GROUP_STAGE", kickoffAt: 1782603000000, homeTeam: "Colombia", awayTeam: "Portugal" },
  "gs-70": { stage: "GROUP_STAGE", kickoffAt: 1782603000000, homeTeam: "Congo DR", awayTeam: "Uzbekistan" },
  "gs-71": { stage: "GROUP_STAGE", kickoffAt: 1782612000000, homeTeam: "Algeria", awayTeam: "Austria" },
  "gs-72": { stage: "GROUP_STAGE", kickoffAt: 1782612000000, homeTeam: "Jordan", awayTeam: "Argentina" },
  "r32-1": { stage: "LAST_32", kickoffAt: 1782673200000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-2": { stage: "LAST_32", kickoffAt: 1782752400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-3": { stage: "LAST_32", kickoffAt: 1782765000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-4": { stage: "LAST_32", kickoffAt: 1782781200000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-5": { stage: "LAST_32", kickoffAt: 1782838800000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-6": { stage: "LAST_32", kickoffAt: 1782853200000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-7": { stage: "LAST_32", kickoffAt: 1782867600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-8": { stage: "LAST_32", kickoffAt: 1782921600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-9": { stage: "LAST_32", kickoffAt: 1782936000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-10": { stage: "LAST_32", kickoffAt: 1782950400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-11": { stage: "LAST_32", kickoffAt: 1783018800000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-12": { stage: "LAST_32", kickoffAt: 1783033200000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-13": { stage: "LAST_32", kickoffAt: 1783047600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-14": { stage: "LAST_32", kickoffAt: 1783101600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-15": { stage: "LAST_32", kickoffAt: 1783116000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r32-16": { stage: "LAST_32", kickoffAt: 1783128600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-1": { stage: "LAST_16", kickoffAt: 1783184400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-2": { stage: "LAST_16", kickoffAt: 1783198800000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-3": { stage: "LAST_16", kickoffAt: 1783281600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-4": { stage: "LAST_16", kickoffAt: 1783296000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-5": { stage: "LAST_16", kickoffAt: 1783364400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-6": { stage: "LAST_16", kickoffAt: 1783382400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-7": { stage: "LAST_16", kickoffAt: 1783440000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "r16-8": { stage: "LAST_16", kickoffAt: 1783454400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "qf-1": { stage: "QUARTER_FINALS", kickoffAt: 1783627200000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "qf-2": { stage: "QUARTER_FINALS", kickoffAt: 1783710000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "qf-3": { stage: "QUARTER_FINALS", kickoffAt: 1783803600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "qf-4": { stage: "QUARTER_FINALS", kickoffAt: 1783818000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "sf-1": { stage: "SEMI_FINALS", kickoffAt: 1784055600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  "sf-2": { stage: "SEMI_FINALS", kickoffAt: 1784142000000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  third: { stage: "THIRD_PLACE", kickoffAt: 1784408400000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
  final: { stage: "FINAL", kickoffAt: 1784487600000, homeTeam: "TBD Home", awayTeam: "TBD Away" },
};

export const matchVenueIds: Record<string, keyof typeof venues | ""> = {
  "gs-1": "mexico",
  "gs-2": "guadalajara",
  "gs-3": "toronto",
  "gs-4": "la",
  "gs-5": "sf",
  "gs-6": "nynj",
  "gs-7": "boston",
  "gs-8": "vancouver",
  "gs-9": "houston",
  "gs-10": "dallas",
  "gs-11": "philadelphia",
  "gs-12": "monterrey",
  "gs-13": "atlanta",
  "gs-14": "seattle",
  "gs-15": "miami",
  "gs-16": "la",
  "gs-17": "nynj",
  "gs-18": "boston",
  "gs-19": "kansas",
  "gs-20": "sf",
  "gs-21": "houston",
  "gs-22": "dallas",
  "gs-23": "toronto",
  "gs-24": "mexico",
  "gs-25": "atlanta",
  "gs-26": "la",
  "gs-27": "vancouver",
  "gs-28": "guadalajara",
  "gs-29": "philadelphia",
  "gs-30": "boston",
  "gs-31": "sf",
  "gs-32": "seattle",
  "gs-33": "toronto",
  "gs-34": "kansas",
  "gs-35": "houston",
  "gs-36": "monterrey",
  "gs-37": "miami",
  "gs-38": "atlanta",
  "gs-39": "la",
  "gs-40": "vancouver",
  "gs-41": "nynj",
  "gs-42": "philadelphia",
  "gs-43": "dallas",
  "gs-44": "sf",
  "gs-45": "houston",
  "gs-46": "boston",
  "gs-47": "toronto",
  "gs-48": "guadalajara",
  "gs-49": "seattle",
  "gs-50": "vancouver",
  "gs-51": "atlanta",
  "gs-52": "miami",
  "gs-53": "mexico",
  "gs-54": "monterrey",
  "gs-55": "philadelphia",
  "gs-56": "nynj",
  "gs-57": "dallas",
  "gs-58": "kansas",
  "gs-59": "sf",
  "gs-60": "la",
  "gs-61": "boston",
  "gs-62": "toronto",
  "gs-63": "houston",
  "gs-64": "guadalajara",
  "gs-65": "seattle",
  "gs-66": "vancouver",
  "gs-67": "philadelphia",
  "gs-68": "nynj",
  "gs-69": "miami",
  "gs-70": "atlanta",
  "gs-71": "kansas",
  "gs-72": "dallas",
  "r32-1": "la",
  "r32-2": "houston",
  "r32-3": "boston",
  "r32-4": "monterrey",
  "r32-5": "dallas",
  "r32-6": "nynj",
  "r32-7": "mexico",
  "r32-8": "atlanta",
  "r32-9": "seattle",
  "r32-10": "sf",
  "r32-11": "la",
  "r32-12": "toronto",
  "r32-13": "vancouver",
  "r32-14": "dallas",
  "r32-15": "miami",
  "r32-16": "kansas",
  "r16-1": "houston",
  "r16-2": "philadelphia",
  "r16-3": "nynj",
  "r16-4": "mexico",
  "r16-5": "dallas",
  "r16-6": "seattle",
  "r16-7": "atlanta",
  "r16-8": "vancouver",
  "qf-1": "boston",
  "qf-2": "la",
  "qf-3": "miami",
  "qf-4": "kansas",
  "sf-1": "dallas",
  "sf-2": "atlanta",
  "third": "miami",
  "final": "nynj",
};

function getKickoffTime(kickoffAt: MatchVenueLookupInput["kickoffAt"]) {
  if (typeof kickoffAt === "number") {
    return kickoffAt;
  }

  if (/^\d+$/.test(kickoffAt.toString())) {
    return Number(kickoffAt);
  }

  const date = kickoffAt instanceof Date ? kickoffAt : new Date(kickoffAt);

  return date.getTime();
}

export function getManualGameId(match: MatchVenueLookupInput) {
  const kickoffAt = getKickoffTime(match.kickoffAt);
  const stageKickoffMatches = Object.entries(gameIds).filter(([, game]) => {
    return game.stage === match.stage && game.kickoffAt === kickoffAt;
  });

  if (stageKickoffMatches.length === 1) {
    return stageKickoffMatches[0][0];
  }

  return (
    stageKickoffMatches.find(([, game]) => {
      return (
        game.homeTeam === match.homeTeam &&
        game.awayTeam === match.awayTeam
      );
    })?.[0] ?? null
  );
}

export function getMatchVenue(match: MatchVenueLookupInput, locale: Locale | string) {
  const gameId = getManualGameId(match);
  const venueId = gameId ? matchVenueIds[gameId] : null;
  const manualVenue = venueId ? venues[venueId] : null;

  if (manualVenue) {
    return locale.startsWith("es") ? manualVenue.es : manualVenue.en;
  }

  return match.venue?.trim() || null;
}
