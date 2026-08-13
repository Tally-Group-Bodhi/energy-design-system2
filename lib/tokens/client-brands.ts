/**
 * Client brand tokens for the C&I Portal demo pages.
 *
 * Tally brands live in `lib/tokens/colors.ts` and `lib/tokens/surface-colours.ts`.
 * This file holds the *client* brands we skin the C&I Portal with, so a new
 * client demo page only needs one entry here plus its logo assets in
 * `public/foundation/clients/<key>/`.
 *
 * These values mirror the `sec-*` Tailwind theme tokens in `app/globals.css`.
 * Use the Tailwind utilities (`bg-sec-purple-950`) for markup; use this object
 * where a JS value is unavoidable, such as Recharts series props.
 */

import type { NavActiveColors } from "@/components/NavigationBar/NavigationBar";

export interface ClientBrandColours {
  /** Headings, primary button, and the deepest brand tone. */
  primary: string;
  /** The app bar and other branded chrome. Lighter than `primary`, so the
   *  orange lockup and white labels both clear contrast on it. */
  primaryStrong: string;
  /** Secondary text, lead paragraphs, links. */
  primaryMuted: string;
  /** Tinted card background. */
  primaryTint: string;
  /** Page wash. */
  primaryWash: string;
  /** Accent for icon fills, chart marks and borders — never text, and never
   *  behind white text. */
  accent: string;
  /** The accent tone that is readable as text on a primary surface. */
  accentOnPrimary: string;
  /** Callout / info box background. */
  accentTint: string;
  /** Body text. */
  text: string;
  /** Muted / metadata text. */
  textMuted: string;
  /** Card hairline border. */
  border: string;
  /** Page background. */
  surface: string;
  danger: string;
}

export interface ClientBrandChart {
  /** Fixed series order — never reorder, never cycle. */
  series: string[];
  /** Dash pattern per series, so meaning never rests on colour alone. */
  seriesDash: string[];
  grid: string;
  axis: string;
}

/** Spreads straight into `next/image`, so intrinsic size travels with the src. */
export interface ClientBrandLogo {
  src: string;
  width: number;
  height: number;
}

export interface ClientBrandLogos {
  /** The primary lockup: light backgrounds and the branded app bar. */
  standard: ClientBrandLogo;
  /** All-white, for dark surfaces that aren't the brand colour. */
  reversed: ClientBrandLogo;
}

export interface ClientBrand {
  key: string;
  name: string;
  /** Short label for compact chrome (e.g. collapsed nav, tab titles). */
  shortName: string;
  /**
   * Font stack for the client's pages. Licensed client faces are not bundled,
   * so this defaults to the design system's own font; point it at a webfont in
   * `public/fonts/` once a licence is in place.
   */
  fontFamily: string;
  colours: ClientBrandColours;
  logos: ClientBrandLogos;
  /** Pane surface class from `app/globals.css`. */
  surfaceClass: string;
  /** Active nav row colours passed to `NavigationBar` via `activeColors`. */
  navActiveColors: NavActiveColors;
  chart: ClientBrandChart;
}

/**
 * SEC Victoria — deep purple and orange, per the SEC brand guidance.
 * `purple-950` and `orange-600` are the fixed anchors, identical across web and
 * print. SEC's own face is PP Mori, which needs a commercial webfont licence,
 * so these pages stay on the design system's Inter.
 */
const secVictoria: ClientBrand = {
  key: "sec-victoria",
  name: "SEC Victoria",
  shortName: "SEC",
  fontFamily: "var(--font-inter)",
  colours: {
    primary: "#390A56",
    primaryStrong: "#4E236E",
    primaryMuted: "#7E4EA5",
    primaryTint: "#F4EBFF",
    primaryWash: "#FBF7FF",
    accent: "#F66800",
    accentOnPrimary: "#FBB480",
    accentTint: "#FEF6EE",
    text: "#1C2024",
    textMuted: "#60646C",
    border: "#E8E8E8",
    surface: "#FCFCFC",
    danger: "#CC0000",
  },
  logos: {
    standard: {
      src: "/foundation/clients/sec-victoria/SECVictoriaLogo.png",
      width: 150,
      height: 56,
    },
    reversed: {
      src: "/foundation/clients/sec-victoria/SECVictoriaLogoReversed.png",
      width: 300,
      height: 112,
    },
  },
  surfaceClass: "surface-sec-victoria",
  navActiveColors: {
    bg: "bg-sec-purple-50",
    text: "text-sec-purple-950",
    darkBg: "dark:bg-sec-purple-800/30",
    darkText: "dark:text-sec-purple-100",
  },
  chart: {
    series: ["#F66800", "#7E4EA5", "#390A56", "#C18FEC", "#60646C"],
    seriesDash: ["0", "6 3", "0", "2 3", "8 4"],
    grid: "#E8E8E8",
    axis: "#60646C",
  },
};

/**
 * Ampol — blue and red, per ampol.com.au theme-color (#18249C) and the Ampol
 * colour reference. Red is both brand accent and the universal error signal, so
 * semantic danger is the darker #B90905 (not red-600). Never put red-600 on
 * Ampol blue (2.63:1). Use red-300 on blue surfaces instead.
 */
const ampol: ClientBrand = {
  key: "ampol",
  name: "Ampol",
  shortName: "Ampol",
  fontFamily: "var(--font-inter)",
  colours: {
    primary: "#18249C",
    primaryStrong: "#11196D",
    primaryMuted: "#1860D8",
    primaryTint: "#EFF0F8",
    primaryWash: "#F8F8FC",
    accent: "#ED0C06",
    accentOnPrimary: "#F7928F",
    accentTint: "#FEF0F0",
    text: "#1C2024",
    textMuted: "#60646C",
    border: "#E8E8E8",
    surface: "#FCFCFC",
    danger: "#B90905",
  },
  logos: {
    standard: {
      src: "/foundation/clients/ampol/AmpolLogo.png",
      width: 172,
      height: 68,
    },
    reversed: {
      src: "/foundation/clients/ampol/AmpolLogoReversed.png",
      width: 172,
      height: 68,
    },
  },
  surfaceClass: "surface-ampol",
  navActiveColors: {
    bg: "bg-ampol-blue-50",
    text: "text-ampol-blue-700",
    darkBg: "dark:bg-ampol-blue-800/30",
    darkText: "dark:text-ampol-blue-100",
  },
  chart: {
    // Blue-only series — brand red stays on UI chrome (icons, tabs, marks),
    // not in data viz, so charts never read as error/negative.
    series: ["#0C1351", "#18249C", "#1860D8", "#979CD2", "#60646C"],
    seriesDash: ["0", "6 3", "2 3", "8 4", "2 2"],
    grid: "#E8E8E8",
    axis: "#60646C",
  },
};

/**
 * CleanCo Queensland — cyan and charcoal. Brand cyan (#64D0E4) is 1.80:1 on
 * white: large-area fills only, never text, icons, thin marks, or white-on-cyan.
 * On dark chrome cyan is readable (4.72:1 on charcoal). For links and UI accents
 * on white use cyan-700 (#326872). Neutrals are warm — don't mix in cool greys.
 */
const cleanco: ClientBrand = {
  key: "cleanco",
  name: "CleanCo Queensland",
  shortName: "CleanCo",
  fontFamily: "var(--font-inter)",
  colours: {
    primary: "#162E32",
    primaryStrong: "#264F57",
    primaryMuted: "#326872",
    primaryTint: "#E9F8FB",
    primaryWash: "#F6FCFD",
    accent: "#64D0E4",
    accentOnPrimary: "#64D0E4",
    accentTint: "#F3F2F3",
    text: "#2B2A2A",
    textMuted: "#4F4C4D",
    border: "#EDEDED",
    surface: "#FCFCFC",
    danger: "#B3261E",
  },
  logos: {
    standard: {
      src: "/foundation/clients/cleanco/CleanCoLogo.png",
      width: 1215,
      height: 374,
    },
    reversed: {
      src: "/foundation/clients/cleanco/CleanCoLogoReversed.png",
      width: 1215,
      height: 374,
    },
  },
  surfaceClass: "surface-cleanco",
  navActiveColors: {
    bg: "bg-cleanco-cyan-50",
    text: "text-cleanco-cyan-950",
    darkBg: "dark:bg-cleanco-cyan-800/30",
    darkText: "dark:text-cleanco-cyan-100",
  },
  chart: {
    // Sequential cyan ladder — one hue only. Dash patterns are mandatory.
    series: ["#162E32", "#326872", "#408592", "#64D0E4", "#4F4C4D"],
    seriesDash: ["0", "6 3", "2 3", "8 4", "2 2"],
    grid: "#EDEDED",
    axis: "#4F4C4D",
  },
};

/**
 * EnergyAustralia — deep green brand. Both anchors pass AA on white (#094C15
 * 10.21:1, #007D2F 5.28:1), so green-600 can carry body text — unusual in this
 * client set. Accent #008D36 is a brighter green (not a second hue): marks and
 * icon fills only, never text, and never on green-950 (2.37:1). Success is
 * deliberately teal (#005E7A) so it doesn't read as brand chrome.
 *
 * Hexes are from logo sampling, not a published brand guide — verify with client.
 */
const energyAustralia: ClientBrand = {
  key: "energy-australia",
  name: "EnergyAustralia",
  shortName: "EA",
  fontFamily: "var(--font-inter)",
  colours: {
    primary: "#094C15",
    primaryStrong: "#094C15",
    primaryMuted: "#006927",
    primaryTint: "#E8F3EC",
    primaryWash: "#F5FAF7",
    accent: "#008D36",
    accentOnPrimary: "#85C89F",
    accentTint: "#EDF7F1",
    text: "#1C2024",
    textMuted: "#60646C",
    border: "#E8E8E8",
    surface: "#FCFCFC",
    danger: "#B3261E",
  },
  logos: {
    standard: {
      src: "/foundation/clients/energy-australia/EnergyAustraliaLogo.png",
      width: 365,
      height: 80,
    },
    reversed: {
      src: "/foundation/clients/energy-australia/EnergyAustraliaLogoReversed.png",
      width: 365,
      height: 80,
    },
  },
  surfaceClass: "surface-energy-australia",
  navActiveColors: {
    bg: "bg-ea-green-50",
    text: "text-ea-green-950",
    darkBg: "dark:bg-ea-green-800/30",
    darkText: "dark:text-ea-green-100",
  },
  chart: {
    // Sequential green ladder — one hue. Dash patterns are mandatory.
    series: ["#094C15", "#007D2F", "#008D36", "#73B88D", "#60646C"],
    seriesDash: ["0", "6 3", "2 3", "8 4", "2 2"],
    grid: "#E8E8E8",
    axis: "#60646C",
  },
};

export const clientBrands = {
  "sec-victoria": secVictoria,
  ampol,
  cleanco,
  "energy-australia": energyAustralia,
} as const;

export type ClientBrandKey = keyof typeof clientBrands;

/** Resolve a client brand by key. */
export function getClientBrand(key: ClientBrandKey): ClientBrand {
  return clientBrands[key];
}
