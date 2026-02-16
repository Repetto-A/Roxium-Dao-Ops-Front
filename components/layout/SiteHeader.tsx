// components/layout/SiteHeader.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "../common/Container";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface SiteHeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="rounded-full border border-primary/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-all group-hover:border-primary group-hover:bg-primary/10">
              RoxiumLabs
            </span>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              DAO Ops on Vetra
            </span>
          </Link>

          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="size-4 text-muted-foreground/50" />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-semibold">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          ) : (
            <nav className="flex items-center gap-6 text-sm">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                How it works
              </a>
              <Link href="/daos" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Go to DAOs
              </Link>
            </nav>
          )}
        </div>
      </Container>
    </header>
  );
}
