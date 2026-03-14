import colorMap from "@/data/categoryColors.json";
import { normalizeTaxonomyValue } from "@/lib/tools";

export interface CategoryColor {
  accent: string; bg: string; border: string;
  glow: string; text: string; emoji: string;
}

const map = colorMap as Record<string, CategoryColor>;
const normalizedMap = Object.fromEntries(
  Object.entries(map).map(([key, value]) => [normalizeTaxonomyValue(key), value])
) as Record<string, CategoryColor>;

function getActiveTheme(): string {
  if (typeof document === "undefined") {
    return "dark";
  }
  return document.documentElement.getAttribute("data-theme") ?? "dark";
}

function isLightFamilyTheme(theme: string): boolean {
  return theme === "light" || theme === "notebook" || theme === "sepia";
}

function parseHexColor(value: string): [number, number, number] | null {
  const hex = value.trim();
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function mixWithBase(hex: string, base: [number, number, number], weight: number): string {
  const rgb = parseHexColor(hex);
  if (!rgb) return hex;

  const mix = (fg: number, bg: number) => Math.round(fg * (1 - weight) + bg * weight);
  return toHex(mix(rgb[0], base[0]), mix(rgb[1], base[1]), mix(rgb[2], base[2]));
}

function relativeLuminance(hex: string): number {
  const rgb = parseHexColor(hex);
  if (!rgb) return 0;

  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };

  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function toRgba(hex: string, alpha: number): string {
  const rgb = parseHexColor(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function makeAccessibleInLightTheme(color: CategoryColor): CategoryColor {
  const lum = relativeLuminance(color.accent);
  const shouldDarken = lum > 0.22;
  const darkenedAccent = shouldDarken
    ? mixWithBase(color.accent, [18, 32, 40], Math.min(0.72, 0.34 + lum * 0.28))
    : color.accent;

  return {
    ...color,
    accent: darkenedAccent,
    text: darkenedAccent,
    border: toRgba(darkenedAccent, 0.42),
    bg: toRgba(darkenedAccent, 0.1),
    glow: `0 0 12px ${toRgba(darkenedAccent, 0.28)}`,
  };
}

export function getCategoryColor(category: string, theme = getActiveTheme()): CategoryColor {
  const base = map[category] ?? normalizedMap[normalizeTaxonomyValue(category)] ?? map["__default__"];

  if (!isLightFamilyTheme(theme)) {
    return base;
  }

  return makeAccessibleInLightTheme(base);
}

export function getCategoryVars(category: string, theme = getActiveTheme()): React.CSSProperties {
  const c = getCategoryColor(category, theme);
  return {
    "--cat-accent": c.accent, "--cat-bg": c.bg,
    "--cat-border": c.border, "--cat-glow": c.glow,
    "--cat-text": c.text,
  } as React.CSSProperties;
}
