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
    <header className="border-b border-white/10 bg-black/30 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="rounded-full border border-emerald-400/60 px-2 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300/90">
              RoxiumLabs
            </span>
            <span className="text-sm font-mono text-slate-300">
              DAO Ops on Vetra
            </span>
          </Link>

          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-2 text-xs sm:text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="size-3 text-slate-600" />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-slate-300 hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          ) : (
            <nav className="flex items-center gap-4 text-xs sm:text-sm">
              <a href="#features" className="text-slate-300 hover:text-white">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-300 hover:text-white"
              >
                How it works
              </a>
              <a href="#dev" className="text-emerald-300 hover:text-emerald-200">
                For devs
              </a>
            </nav>
          )}
        </div>
      </Container>
    </header>
  );
}
