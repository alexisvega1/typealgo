"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { TypeAlgoLogo } from "@/components/brand/TypeAlgoLogo";
import { SaveProgressPrompt } from "@/components/sync/SaveProgressPrompt";
import { SyncStatusIndicator } from "@/components/sync/SyncStatusIndicator";
import { TrainingModeToggle } from "@/components/typing/TrainingModeToggle";

const NAV = [
  { href: "/", label: "Type" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/stats", label: "Stats" },
];

export function Header() {
  const pathname = usePathname();
  const isTypingPage = pathname === "/";
  const [menuState, setMenuState] = useState<{ path: string; open: boolean } | null>(null);
  const menuOpen = menuState?.open === true && menuState.path === pathname;

  const closeMenu = () => setMenuState(null);
  const toggleMenu = () =>
    setMenuState((current) =>
      current?.open && current.path === pathname
        ? null
        : { path: pathname, open: true },
    );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="app-header sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="logo-link flex shrink-0 items-center gap-2.5 group">
          <TypeAlgoLogo size={34} className="logo-link-mark" />
          <span className="text-lg font-semibold tracking-tight">
            Type<span className="text-accent">Algo</span>
          </span>
        </Link>

        {isTypingPage && (
          <div className="header-mode-toggle hidden min-w-0 flex-1 md:flex">
            <TrainingModeToggle />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center">
          <button
            type="button"
            className="header-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            onClick={toggleMenu}
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
              <div className="header-mobile-menu-footer">
                <SyncStatusIndicator variant="menu" />
                <SaveProgressPrompt variant="menu" onOpen={closeMenu} />
              </div>
            </nav>
          </>
        )}
      </div>

      {isTypingPage && (
        <div className="header-mode-toggle-mobile border-t border-border/40 px-4 py-2 md:hidden">
          <TrainingModeToggle />
        </div>
      )}
    </header>
  );
}
