import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyDocumentColorTheme,
  COLOR_PALETTES,
  COLOR_THEME_STORAGE_KEY,
  DEFAULT_COLOR_PALETTE,
  isColorPaletteId,
  type ColorPaletteId,
} from "@/shared/theme/colorPalettes";

type ColorThemeContextValue = {
  colorTheme: ColorPaletteId;
  setColorTheme: (palette: ColorPaletteId) => void;
  palettes: typeof COLOR_PALETTES;
};

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

function readStoredColorTheme(): ColorPaletteId {
  if (typeof window === "undefined") return DEFAULT_COLOR_PALETTE;
  const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY);
  return isColorPaletteId(stored) ? stored : DEFAULT_COLOR_PALETTE;
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] =
    useState<ColorPaletteId>(readStoredColorTheme);

  useLayoutEffect(() => {
    applyDocumentColorTheme(colorTheme);
  }, [colorTheme]);

  const setColorTheme = useCallback((palette: ColorPaletteId) => {
    setColorThemeState(palette);
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, palette);
    applyDocumentColorTheme(palette);
  }, []);

  const value = useMemo(
    () => ({
      colorTheme,
      setColorTheme,
      palettes: COLOR_PALETTES,
    }),
    [colorTheme, setColorTheme]
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within ColorThemeProvider");
  }
  return context;
}
