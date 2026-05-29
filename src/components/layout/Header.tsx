"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { TypeAlgoLogo } from "@/components/brand/TypeAlgoLogo";
import { UserSettingsModal } from "@/components/settings/UserSettingsModal";
import { EnglishBaselineModal } from "@/components/baseline/EnglishBaselineModal";
import {
  SaveProgressPrompt,
  useSaveProgressVisible,
} from "@/components/sync/SaveProgressPrompt";
import { SyncStatusIndicator } from "@/components/sync/SyncStatusIndicator";
import { TrainingModeToggle } from "@/components/typing/TrainingModeToggle";
import { useIsMobileLayout } from "@/hooks/use-device-class";
import { useUIStore } from "@/stores/ui-store";

const NAV = [
  { href: "/", label: "Type" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/stats", label: "Stats" },
];

export function Header() {
  const pathname = usePathname();
  const isTypingPage = pathname === "/";
  const [menuState, setMenuState] = useState<{ path: string; open: boolean } | null>(null);
  const [saveProgressOpen, setSaveProgressOpen] = useState(false);
  const [baselineOpen, setBaselineOpen] = useState(false);
  const saveProgressVisible = useSaveProgressVisible();
  const filtersOpen = useUIStore((s) => s.filtersOpen);
  const toggleFilters = useUIStore((s) => s.toggleFilters);
  const setFiltersOpen = useUIStore((s) => s.setFiltersOpen);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const openSettings = useUIStore((s) => s.openSettings);
  const menuOpen = menuState?.open === true && menuState.path === pathname;
  const isMobileLayout = useIsMobileLayout();

  const closeMenu = () => setMenuState(null);
  const toggleMenu = () =>
    setMenuState((current) =>
      current?.open && current.path === pathname
        ? null
        : { path: pathname, open: true },
    );

  useEffect(() => {
    if (!menuOpen && !filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        setFiltersOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, filtersOpen, setFiltersOpen, setSettingsOpen]);

  const openSettingsFromMenu = () => {
    closeMenu();
    openSettings();
  };

  const openSaveProgress = () => {
    closeMenu();
    setSaveProgressOpen(true);
  };

  const openBaseline = () => {
    closeMenu();
    setBaselineOpen(true);
  };

  const handleToggleMenu = () => {
    if (!menuOpen) setFiltersOpen(false);
    toggleMenu();
  };

  const handleToggleFilters = () => {
    if (!filtersOpen) closeMenu();
    toggleFilters();
  };

  return (
    <header className="app-header sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <SaveProgressPrompt
        open={saveProgressOpen}
        onOpenChange={setSaveProgressOpen}
        showTrigger={false}
      />
      <EnglishBaselineModal open={baselineOpen} onClose={() => setBaselineOpen(false)} />
      <UserSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="logo-link flex shrink-0 items-center gap-2.5 group">
          <TypeAlgoLogo size={34} className="logo-link-mark" />
          <span className="logo-wordmark text-lg font-semibold tracking-tight">
            Type<span className="text-accent">Algo</span>
          </span>
        </Link>

        {isTypingPage && !isMobileLayout && (
          <div className="header-mode-toggle hidden min-w-0 flex-1 md:flex">
            <TrainingModeToggle />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {!isMobileLayout && (
            <SyncStatusIndicator variant="header" onOpenSettings={openSettings} />
          )}

          {isTypingPage && (
            <button
              type="button"
              className={clsx("header-icon-btn", filtersOpen && "header-icon-btn-active")}
              aria-label={filtersOpen ? "Close filters" : "Open filters"}
              aria-expanded={filtersOpen}
              aria-controls="typing-filters-panel"
              onClick={handleToggleFilters}
            >
              <FilterIcon />
            </button>
          )}

          <button
            type="button"
            className={clsx("header-icon-btn", menuOpen && "header-icon-btn-active")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            onClick={handleToggleMenu}
          >
            <span className={clsx("header-menu-icon", menuOpen && "header-menu-icon-open")} />
          </button>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="header-menu-backdrop"
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <nav
              id="header-mobile-menu"
              className="header-mobile-menu"
              aria-label="Primary navigation"
            >
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "header-mobile-menu-link",
                    pathname === item.href && "header-mobile-menu-link-active",
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}

              {isTypingPage && isMobileLayout && (
                <div className="header-mobile-menu-section">
                  <span className="header-mobile-menu-label">Training mode</span>
                  <TrainingModeToggle variant="menu" onSelect={closeMenu} />
                </div>
              )}

              <div className="header-menu-tools">
                <span className="header-mobile-menu-label">Preferences</span>
                <button
                  type="button"
                  className="header-mobile-menu-link header-mobile-menu-action"
                  onClick={openSettingsFromMenu}
                >
                  Settings
                </button>
                <button
                  type="button"
                  className="header-mobile-menu-link header-mobile-menu-action"
                  onClick={openBaseline}
                >
                  English baseline · 30s
                </button>
              </div>

              {isMobileLayout && (
                <div className="header-mobile-menu-footer">
                  <SyncStatusIndicator variant="menu" onOpenSettings={openSettingsFromMenu} />
                  {saveProgressVisible && (
                    <button
                      type="button"
                      className="save-progress-btn save-progress-btn-menu"
                      onClick={openSaveProgress}
                    >
                      Save progress
                    </button>
                  )}
                </div>
              )}

              {!isMobileLayout && saveProgressVisible && (
                <div className="header-mobile-menu-footer">
                  <button
                    type="button"
                    className="save-progress-btn save-progress-btn-menu"
                    onClick={openSaveProgress}
                  >
                    Save progress
                  </button>
                </div>
              )}
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2.5 4.5h13M5 9h8M7.5 13.5h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
