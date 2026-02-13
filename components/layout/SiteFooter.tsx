// components/layout/SiteFooter.tsx
import { Container } from "../common/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/40 mt-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} RoxiumLabs. All rights reserved.
          </span>
          <span className="font-mono text-[11px] text-emerald-300/80">
            Powered by Vetra · Mendoza Testnet
          </span>
        </div>
      </Container>
    </footer>
  );
}
