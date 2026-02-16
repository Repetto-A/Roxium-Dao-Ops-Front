// components/layout/SiteFooter.tsx
import Link from "next/link";
import { Container } from "../common/Container";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-background">
      <Container>
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">RoxiumLabs</p>
            <p className="text-xs text-muted-foreground">
              DAO operations powered by Vetra.
            </p>
          </div>

          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Product</p>
              <nav className="flex flex-col gap-1.5">
                <Link href="/daos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  DAOs
                </Link>
                <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </a>
                <a href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  How it works
                </a>
              </nav>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Developers</p>
              <nav className="flex flex-col gap-1.5">
                <a href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  API Reference
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 py-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} RoxiumLabs. All rights reserved.</span>
          <span className="font-medium text-foreground/80">Powered by Vetra</span>
        </div>
      </Container>
    </footer>
  );
}
