/**
 * Color tokens for the Energy Design System
 */

export type ColorToken = {
  name: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
};

export const colors = {
  primary: {
    name: "primary",
    hex: "#2C365D",
    rgb: { r: 44, g: 54, b: 93 },
  },
  hero: {
    name: "hero",
    hex: "#2C365D",
    rgb: { r: 44, g: 54, b: 93 },
  },
  neutral: {
    name: "neutral",
    hex: "#2C365D",
    rgb: { r: 44, g: 54, b: 93 },
  },
  heading: {
    name: "heading",
    hex: "#2C365D",
    rgb: { r: 44, g: 54, b: 93 },
  },
  text: {
    name: "text",
    hex: "#181B25",
    rgb: { r: 24, g: 27, b: 37 },
  },
  link: {
    name: "link",
    hex: "#2C365D",
    rgb: { r: 44, g: 54, b: 93 },
  },
  muted: {
    name: "muted",
    hex: "#595767",
    rgb: { r: 89, g: 87, b: 103 },
  },
  border: {
    name: "border",
    hex: "#DEDEE1",
    rgb: { r: 222, g: 222, b: 225 },
  },
  background: {
    name: "background",
    hex: "#F3F4F6",
    rgb: { r: 243, g: 244, b: 246 },
  },
  light: {
    name: "light",
    hex: "#F9F9FB",
    rgb: { r: 249, g: 249, b: 251 },
  },
} as const satisfies Record<string, ColorToken>;

export const secondaryColors = {
  turquoise: {
    name: "turquoise",
    hex: "#00D2A2",
    rgb: { r: 0, g: 210, b: 162 },
  },
} as const satisfies Record<string, ColorToken>;

export const semanticColors = {
  success: {
    name: "success",
    hex: "#008000",
    rgb: { r: 0, g: 128, b: 0 },
  },
  successLight: {
    name: "success light",
    hex: "#D1FAE5",
    rgb: { r: 209, g: 250, b: 229 },
  },
  warning: {
    name: "warning",
    hex: "#C53B00",
    rgb: { r: 197, g: 59, b: 0 },
  },
  warningLight: {
    name: "warning light",
    hex: "#FEF3C7",
    rgb: { r: 254, g: 243, b: 199 },
  },
  error: {
    name: "error",
    hex: "#C40000",
    rgb: { r: 196, g: 0, b: 0 },
  },
  errorLight: {
    name: "error light",
    hex: "#FEE2E2",
    rgb: { r: 254, g: 226, b: 226 },
  },
  info: {
    name: "info",
    hex: "#0074C4",
    rgb: { r: 0, g: 116, b: 196 },
  },
  infoLight: {
    name: "info light",
    hex: "#DBEAFE",
    rgb: { r: 219, g: 234, b: 254 },
  },
  system: {
    name: "system",
    hex: "#FFFF00",
    rgb: { r: 255, g: 255, b: 0 },
  },
} as const satisfies Record<string, ColorToken>;

export const dataVisualizationColors = {
  // Data A - Turquoise
  dataASolid: {
    name: "data-a-solid",
    hex: "#14B69D",
    rgb: { r: 20, g: 182, b: 157 },
  },
  dataAOpacity: {
    name: "data-a-opacity",
    hex: "#A1E2D8C4",
    rgb: { r: 161, g: 226, b: 216 },
  },
  dataATint: {
    name: "data-a-tint",
    hex: "#5BCCBA",
    rgb: { r: 91, g: 204, b: 186 },
  },
  // Data B - Navy
  dataBSolid: {
    name: "data-b-solid",
    hex: "#1F2933",
    rgb: { r: 31, g: 41, b: 51 },
  },
  dataBOpacity: {
    name: "data-b-opacity",
    hex: "#A5A9ADC4",
    rgb: { r: 165, g: 169, b: 173 },
  },
  dataBTint: {
    name: "data-b-tint",
    hex: "#626970",
    rgb: { r: 98, g: 105, b: 112 },
  },
  // Data C - Amber
  dataCSolid: {
    name: "data-c-solid",
    hex: "#F59E0B",
    rgb: { r: 245, g: 158, b: 11 },
  },
  dataCOpacity: {
    name: "data-c-opacity",
    hex: "#FBD89DC4",
    rgb: { r: 251, g: 216, b: 157 },
  },
  dataCTint: {
    name: "data-c-tint",
    hex: "#F8BB54",
    rgb: { r: 248, g: 187, b: 84 },
  },
  // Data D - Purple
  dataDSolid: {
    name: "data-d-solid",
    hex: "#8B5CF6",
    rgb: { r: 139, g: 92, b: 246 },
  },
  dataDOpacity: {
    name: "data-d-opacity",
    hex: "#D1BEFBC4",
    rgb: { r: 209, g: 190, b: 251 },
  },
  dataDTint: {
    name: "data-d-tint",
    hex: "#AE8DF9",
    rgb: { r: 174, g: 141, b: 249 },
  },
  // Data E - Emerald
  dataESolid: {
    name: "data-e-solid",
    hex: "#10B981",
    rgb: { r: 16, g: 185, b: 129 },
  },
  dataEOpacity: {
    name: "data-e-opacity",
    hex: "#9FE3CDC4",
    rgb: { r: 159, g: 227, b: 205 },
  },
  dataETint: {
    name: "data-e-tint",
    hex: "#58CEA7",
    rgb: { r: 88, g: 206, b: 167 },
  },
  // Data F - Blue
  dataFSolid: {
    name: "data-f-solid",
    hex: "#3B82F6",
    rgb: { r: 59, g: 130, b: 246 },
  },
  dataFOpacity: {
    name: "data-f-opacity",
    hex: "#B1CDFBC4",
    rgb: { r: 177, g: 205, b: 251 },
  },
  dataFTint: {
    name: "data-f-tint",
    hex: "#76A8F9",
    rgb: { r: 118, g: 168, b: 249 },
  },
} as const satisfies Record<string, ColorToken>;

export type Colors = typeof colors;
export type SecondaryColors = typeof secondaryColors;
export type SemanticColors = typeof semanticColors;
export type DataVisualizationColors = typeof dataVisualizationColors;

