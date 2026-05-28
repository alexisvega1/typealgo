"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Type", short: "Type" },
  { href: "/curriculum", label: "Curriculum", short: "Learn" },
  { href: "/stats", label: "Stats", short: "Stats" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-nav md:hidden"
      aria-label="Primary navigation"
    >
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx("mobile-nav-link", active && "mobile-nav-link-active")}
          >
            {item.short}
          </Link>
        );
      })}
    </nav>
  );
}
