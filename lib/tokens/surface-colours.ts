/**
 * Surface colour tokens for the main content area (Pane) per Tally brand.
 * Each brand uses a layered gradient (two layers, same opacity pattern as CRM):
 * Light: layer1 50%→70%, layer2 30%→50%. Dark: layer1 15%→25%, layer2 10%→20%.
 * Classes are defined in app/globals.css.
 */

export const SURFACE_NEUTRAL = "bg-[#F9F9FB] dark:bg-gray-900";

/** Surface class per brand (layered gradients in globals.css). */
export const surfaceColours = {
  /** Tally Group — layered slate/blue (navy). */
  "tally-group": "surface-tally-group",
  /** Tally+ — same as Tally Group. */
  "tally-plus": "surface-tally-group",
  /** Tally+ Small Market — layered teal/emerald. */
  "tally-plus-small-market": "surface-tally-plus-small-market",
  /** Tally Sales & Acquisition — layered violet/purple. */
  "tally-sales-acquisition": "surface-tally-sales-acquisition",
  /** Tally Digital — layered orange/amber. */
  "tally-digital": "surface-tally-digital",
  /** Tally CRM — layered sky/blue. */
  "tally-crm": "surface-crm",
  /** Tally Glass — same as Tally Group (navy). */
  "tally-glass": "surface-tally-group",
  /** Powered by Tally — neutral (no brand tint). */
  "powered-by-tally": SURFACE_NEUTRAL,
} as const;

export type SurfaceColourKey = keyof typeof surfaceColours;

/** Resolve surface class by brand key; falls back to neutral if unknown. */
export function getSurfaceClass(brand: SurfaceColourKey | undefined): string {
  if (!brand || !(brand in surfaceColours)) return SURFACE_NEUTRAL;
  return surfaceColours[brand as SurfaceColourKey];
}
