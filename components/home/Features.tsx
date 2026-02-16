// components/home/Features.tsx
import { Container } from "../common/Container";
import { Database, Clock, ShieldCheck, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    title: "DAO-first, on-chain",
    description:
      "Each DAO, proposal and task is stored as a Vetra entity, keeping history and structure at the data layer.",
    icon: Database,
  },
  {
    title: "Real TTL and deadlines",
    description:
      "Proposals and tasks are created with expiration (TTL), aligning team deadlines with on-chain lifetime.",
    icon: Clock,
  },
  {
    title: "Safe reads from the frontend",
    description:
      "The frontend talks to a backend that signs and writes to Vetra; from Next.js you only fetch your DAOs/proposals/tasks.",
    icon: ShieldCheck,
  },
  {
    title: "Queries and global board",
    description:
      "List all your DAOs, proposals and tasks and build Kanban-style views, boards or custom dashboards.",
    icon: LayoutDashboard,
  },
];

export function Features() {
  return (
    <section id="features" className="py-10 md:py-14">
      <Container>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            What problem does this board solve?
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Many DAOs live in docs, Discord and spreadsheets. Here the goal is to
            anchor the operational structure in Vetra, but keep it usable for
            human beings: create, read and connect DAOs, proposals and tasks from
            a modern frontend.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group cursor-default rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-border hover:shadow-sm"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                <f.icon className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
