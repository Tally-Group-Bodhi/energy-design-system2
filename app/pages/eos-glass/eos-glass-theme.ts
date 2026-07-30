/**
 * EOS Glass theme tokens.
 *
 * The Glass Vision demos put the header/nav chrome on a dark navy. EOS Glass
 * keeps the same glass treatment on the content pane but renders the chrome as
 * iOS-style white: systemBackground for the bar, a tertiary fill for inset
 * controls, and a hairline separator. Dark mode falls back to the iOS dark
 * equivalents so the chrome flips with the theme switch.
 */

/** EOS navy — brand tint, used for active chrome states on the white bar */
export const EOS_NAVY = "#2C365D";
/** One step lighter than the navy — legacy inset colour */
export const EOS_NAVY_INSET = "#3B4775";
/** Turquoise accent — focus rings, positive states, dark-mode active nav */
export const EOS_ACCENT = "#00D2A2";

/**
 * iOS chrome surfaces. These are the raw values behind the class tokens below;
 * Tailwind can only see literal hex inside class strings, so anything that ends
 * up in `className` uses the `*_CLASS` constants instead of interpolating these.
 */
export const IOS_CHROME_LIGHT = "#FFFFFF";
export const IOS_CHROME_DARK = "#1C1C1E";

/** Header + side nav background. */
export const IOS_CHROME_CLASS = "bg-white dark:bg-[#1C1C1E]";
/** Search fields and other inset controls sitting on the chrome. */
export const IOS_CHROME_INSET_CLASS = "bg-[#E9E9EB] dark:bg-[#2C2C2E]";
/** Hairline separator (iOS systemGray4). */
export const IOS_CHROME_BORDER_CLASS = "border-[#D1D1D6] dark:border-white/10";
/** Primary label on the chrome. */
export const IOS_CHROME_TEXT_CLASS = "text-[#1C1C1E] dark:text-white";
/** Secondary label / resting icon colour (iOS systemGray, legible either way). */
export const IOS_CHROME_MUTED_CLASS = "text-[#8E8E93]";
/** Resting → hover treatment for icon-only chrome buttons. */
export const IOS_CHROME_ITEM_CLASS =
  "text-[#8E8E93] hover:bg-black/[0.06] hover:text-[#1C1C1E] dark:hover:bg-white/10 dark:hover:text-white";
/**
 * Nav rows that show a text label. iOS sidebars keep the label at full-contrast
 * `label` and de-emphasise the icon, so systemGray text would be too light here.
 */
export const IOS_CHROME_ROW_CLASS =
  "text-[#1C1C1E] hover:bg-black/[0.06] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white";
/** Icon tint to pair with IOS_CHROME_ROW_CLASS. */
export const IOS_CHROME_ROW_ICON_CLASS = "text-[#8E8E93]";
/** Selected nav item: tinted fill plus brand tint. */
export const IOS_CHROME_ACTIVE_CLASS =
  "bg-black/[0.06] text-[#2C365D] dark:bg-white/10 dark:text-[#00D2A2]";
/** Icon tint to pair with IOS_CHROME_ACTIVE_CLASS. */
export const IOS_CHROME_ACTIVE_ICON_CLASS = "text-[#2C365D] dark:text-[#00D2A2]";

export type EosGlassEnvironment = "residential" | "commercial";

export const EOS_ENVIRONMENTS: {
  id: EosGlassEnvironment;
  label: string;
  shortLabel: string;
  icon: string;
}[] = [
  { id: "residential", label: "Residential", shortLabel: "Res", icon: "home" },
  { id: "commercial", label: "C&I", shortLabel: "C&I", icon: "domain" },
];
