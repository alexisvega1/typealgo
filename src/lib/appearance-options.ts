export type CodeFontId = "geist-mono" | "jetbrains-mono" | "fira-code" | "ibm-plex-mono" | "source-code-pro";

export type ThemeId = "typealgo-dark" | "light" | "nord" | "dracula";

export interface CodeFontOption {
  id: CodeFontId;
  label: string;
  /** CSS font-family stack — first entry is a Next.js font CSS variable when loaded. */
  stack: string;
}

export interface ThemeOption {
  id: ThemeId;
  label: string;
  /** Preview swatch colors for the settings picker. */
  swatch: { bg: string; accent: string; fg: string };
}

export const CODE_FONTS: readonly CodeFontOption[] = [
  {
    id: "geist-mono",
    label: "Geist Mono",
    stack: "var(--font-geist-mono), ui-monospace, monospace",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    stack: "var(--font-jetbrains-mono), ui-monospace, monospace",
  },
  {
    id: "fira-code",
    label: "Fira Code",
    stack: "var(--font-fira-code), ui-monospace, monospace",
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    stack: "var(--font-ibm-plex-mono), ui-monospace, monospace",
  },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    stack: "var(--font-source-code-pro), ui-monospace, monospace",
  },
] as const;

export const THEMES: readonly ThemeOption[] = [
  {
    id: "typealgo-dark",
    label: "TypeAlgo Dark",
    swatch: { bg: "#0a0a0c", accent: "#e2b714", fg: "#ececef" },
  },
  {
    id: "light",
    label: "Paper Light",
    swatch: { bg: "#f4f4f5", accent: "#ca8a04", fg: "#18181b" },
  },
  {
    id: "nord",
    label: "Nord",
    swatch: { bg: "#2e3440", accent: "#88c0d0", fg: "#eceff4" },
  },
  {
    id: "dracula",
    label: "Dracula",
    swatch: { bg: "#282a36", accent: "#bd93f9", fg: "#f8f8f2" },
  },
] as const;

export function codeFontStack(id: CodeFontId): string {
  return CODE_FONTS.find((f) => f.id === id)?.stack ?? CODE_FONTS[0].stack;
}
