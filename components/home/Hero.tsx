// components/home/Hero.tsx
import Link from "next/link";
import { Container } from "../common/Container";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="border-b border-border py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
              Turn DAO decisions into trackable,{" "}
              <span className="text-muted-foreground">on-chain workflows</span>.
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground">
              This board turns the classic{" "}
              <span className="font-mono text-foreground">
                {"DAO \u2192 Proposal \u2192 Task"}
              </span>{" "}
              structure into on-chain entities using Vetra. Every decision, task
              and role is recorded with TTL, advanced queries and real-time
              events.
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                Create DAOs and memberships without exposing keys in the frontend.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                Define proposals with on-chain deadlines and explicit TTL.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
                Break your roadmap into trackable tasks, fully queryable through Vetra.
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/daos"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Create your first DAO
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="flex-1 md:max-w-sm lg:max-w-md">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Structure
              </p>
              <pre className="max-h-80 overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
                {`dao: Roxium DAO Ops
  \u251C\u2500 proposal: "Daily standup at 9:30?"
  \u2502    \u251C\u2500 task: "Update calendar"
  \u2502    \u2514\u2500 task: "Notify in #dev channel"
  \u2514\u2500 proposal: "New PR review policy"
       \u2514\u2500 task: "Configure rules in GitHub"

storage: Vetra
TTL-aware \u00B7 Queryable \u00B7 Subscribable`}
              </pre>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
