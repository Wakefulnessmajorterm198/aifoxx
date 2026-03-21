import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, BookOpen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Brand from "@/lib/brand";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "zh", label: "ZH", flag: "🇨🇳" },
  { code: "hi", label: "HI", flag: "🇮🇳" },
];

export function NavBar() {
  const { theme, cycleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : BookOpen;
  const nextThemeLabel = theme === "dark" ? t("nav.themeNext.softLight") : theme === "light" ? t("nav.themeNext.notebook") : t("nav.themeNext.darkTerminal");

  return (
    <header className="sticky top-0 z-40 bg-bg-surface border-b border-border-default">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center justify-center w-7 h-7 border border-border-default rounded-[4px] transition-colors duration-150 hover:shadow-glow">
                  <Menu size={16} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-bg-surface p-0">
                <SheetTitle className="sr-only">Categories</SheetTitle>
                <div className="p-4">
                  <Sidebar onMobileClose={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex items-center gap-2">
            <img
              src="/aifoxx.png"
              alt="AIFOXX Logo"
              className="w-6 h-6 select-none pointer-events-none"
            />
            <span className="font-display font-black tracking-widest text-text-primary text-lg">
              {Brand.nav.logo_text}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Select value={i18n.language.slice(0, 2)} onValueChange={(code) => i18n.changeLanguage(code)}>
            <SelectTrigger className="h-7 w-[72px] font-mono text-xs border-border-default bg-transparent rounded-[4px] px-2 focus:ring-0 focus:ring-offset-0">
              <SelectValue>
                {LANGUAGES.find((l) => l.code === i18n.language.slice(0, 2))?.flag ?? "🌐"}{" "}
                {(i18n.language.slice(0, 2)).toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="font-mono text-xs">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="font-mono text-xs">
                  {lang.flag} {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={cycleTheme}
            className="flex items-center justify-center w-7 h-7 border border-border-default rounded-[4px] transition-colors duration-150 hover:shadow-glow"
            aria-label={`Switch theme (next: ${nextThemeLabel})`}
            title={`Theme: ${theme.toUpperCase()} (next: ${nextThemeLabel})`}
          >
            <ThemeIcon size={14} />
          </button>

          <Link
            to="/skills"
            className={cn(
              "hidden sm:inline-flex font-mono text-xs tracking-widest border px-3 py-1.5 rounded-[4px] transition-colors duration-150",
              pathname === "/skills"
                ? "bg-accent-green text-primary-foreground border-accent-green font-bold"
                : "border-border-default text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
            )}
          >
            SKILLS
          </Link>

          <Link
            to="/submit"
            className={cn(
              "hidden sm:inline-flex font-mono text-xs tracking-widest border px-3 py-1.5 rounded-[4px] transition-colors duration-150",
              pathname === "/submit"
                ? "bg-accent-green text-primary-foreground border-accent-green font-bold"
                : "border-accent-green text-accent-green hover:bg-accent-green hover:text-primary-foreground"
            )}
          >
            {t("nav.submitTool")}
          </Link>
        </div>
      </div>
    </header>
  );
}
