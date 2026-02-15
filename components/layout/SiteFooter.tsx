// components/layout/SiteFooter.tsx
import { Container } from "../common/Container";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-background">
      <Container>
        <div className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} RoxiumLabs. All rights reserved.</span>
          <span className="font-medium text-foreground/80">Powered by Vetra</span>
        </div>
      </Container>
    </footer>
  );
}
