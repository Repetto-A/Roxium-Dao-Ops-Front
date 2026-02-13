// components/layout/SiteHeader.tsx
import Link from "next/link";
import { Container } from "../common/Container";

export function SiteHeader() {
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

          <nav className="flex items-center gap-4 text-xs sm:text-sm">
            <a href="#features" className="text-slate-300 hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white">
              How it works
            </a>
            <a href="#dev" className="text-emerald-300 hover:text-emerald-200">
              For devs
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
