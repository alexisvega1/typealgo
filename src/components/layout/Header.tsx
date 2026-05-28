"use client";

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

  return (
    <header className="app-header sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
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

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <SaveProgressPrompt />
          <SyncStatusIndicator />
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "header-nav-link hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors md:inline-flex",
                pathname === item.href
                  ? "bg-surface-2 text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {isTypingPage && (
        <div className="header-mode-toggle-mobile border-t border-border/40 px-4 py-2 md:hidden">
          <TrainingModeToggle />
        </div>
      )}
    </header>
  );
}
