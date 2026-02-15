// components/home/HowItWorks.tsx
import { Container } from "../common/Container";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border py-16 md:py-20">
      <Container>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          How it works under the hood
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <ol className="list-inside list-decimal space-y-3">
              <li>
                The frontend (Next.js) calls a RoxiumLabs backend via REST.
              </li>
              <li>
                The backend uses the Vetra GraphQL API to create documents:{" "}
                <span className="font-mono text-foreground">
                  dao, proposal, task
                </span>
                .
              </li>
              <li>
                Each entity is stored with metadata: status, deadlines, ids and
                relationships (daoKey / proposalKey).
              </li>
              <li>
                The frontend queries aggregated views: a board per DAO, proposal
                detail, etc.
              </li>
            </ol>
            <p className="text-xs text-muted-foreground">
              All of this without exposing the Vetra API in
              the browser. The frontend only sees friendly JSON.
            </p>
          </div>

          <div
            id="dev"
            className="rounded-xl border border-border/80 bg-card p-5"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Dev flow
            </p>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">
              {`// 1) Create DAO
POST /api/vetra/daos

// 2) Create proposal for that DAO
POST /api/vetra/proposals

// 3) Create linked tasks
POST /api/vetra/tasks

// 4) Read everything in a board
GET /api/vetra/daos/:daoId/board`}
            </pre>
          </div>
        </div>
      </Container>
    </section>
  );
}
