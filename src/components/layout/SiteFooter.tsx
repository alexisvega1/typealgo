import Link from "next/link";

const GITHUB_PROFILE = "https://github.com/alexisvega1";
const GITHUB_REPO = "https://github.com/alexisvega1/typealgo";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-xs text-muted sm:px-6">
        <p className="m-0">
          Built by{" "}
          <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent">
            Alexis Vega Medina
          </a>
        </p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1" aria-label="Footer">
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Source on GitHub
          </a>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
