// components/home/Features.tsx
import { Container } from "../common/Container";

const FEATURES = [
  {
    title: "DAO-first, on-chain",
    description:
      "Each DAO, proposal and task is stored as a Vetra entity, keeping history and structure at the data layer.",
  },
  {
    title: "Real TTL and deadlines",
    description:
      "Proposals and tasks are created with expiration (TTL), aligning team deadlines with on-chain lifetime.",
  },
  {
    title: "Safe reads from the frontend",
    description:
      "The frontend talks to a backend that signs and writes to Vetra; from Next.js you only fetch your DAOs/proposals/tasks.",
  },
  {
    title: "Queries and global board",
    description:
      "List all your DAOs, proposals and tasks and build Kanban-style views, boards or custom dashboards.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-20">
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
              className="rounded-xl border border-border/80 bg-card p-5 transition-colors hover:border-border"
            >
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
