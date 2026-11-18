export const COLOR_THEME_STORAGE_KEY = "app-color-theme";

export const COLOR_PALETTES = [
  {
    id: "neutral",
    labelKey: "settings.color.neutral",
    swatch: "oklch(0.205 0 0)",
    swatchDark: "oklch(0.922 0 0)",
  },
  {
    id: "blue",
    labelKey: "settings.color.blue",
    swatch: "oklch(0.546 0.245 262.881)",
    swatchDark: "oklch(0.623 0.214 259.815)",
  },
  {
    id: "green",
    labelKey: "settings.color.green",
    swatch: "oklch(0.596 0.145 163.225)",
    swatchDark: "oklch(0.696 0.17 162.48)",
  },
  {
    id: "orange",
    labelKey: "settings.color.orange",
    swatch: "oklch(0.705 0.213 47.604)",
    swatchDark: "oklch(0.75 0.183 55.934)",
  },
  {
    id: "rose",
    labelKey: "settings.color.rose",
    swatch: "oklch(0.645 0.246 16.439)",
    swatchDark: "oklch(0.712 0.194 13.428)",
  },
  {
    id: "violet",
    labelKey: "settings.color.violet",
    swatch: "oklch(0.606 0.25 292.717)",
    swatchDark: "oklch(0.702 0.183 293.541)",
  },
  {
    id: "red",
    labelKey: "settings.color.red",
    swatch: "oklch(0.577 0.245 27.325)",
    swatchDark: "oklch(0.637 0.237 25.331)",
  },
  {
    id: "yellow",
    labelKey: "settings.color.yellow",
    swatch: "oklch(0.795 0.184 86.047)",
    swatchDark: "oklch(0.852 0.199 91.936)",
  },
] as const;

export type ColorPaletteId = (typeof COLOR_PALETTES)[number]["id"];

export const DEFAULT_COLOR_PALETTE: ColorPaletteId = "neutral";

export function isColorPaletteId(value: unknown): value is ColorPaletteId {
  return (
    typeof value === "string" &&
    COLOR_PALETTES.some((palette) => palette.id === value)
  );
}

export function applyDocumentColorTheme(palette: ColorPaletteId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.color = palette;
}
