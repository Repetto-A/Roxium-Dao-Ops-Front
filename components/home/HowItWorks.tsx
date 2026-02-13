// components/home/HowItWorks.tsx
import { Container } from "../common/Container";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/10 py-12">
      <Container>
        <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
          How it works under the hood
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-300">
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                The frontend (Next.js) calls a RoxiumLabs backend via REST.
              </li>
              <li>
                The backend uses the Vetra GraphQL API to create documents:
                <span className="font-mono text-emerald-200">
                  {" "}
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
            <p className="text-xs text-slate-400">
              All of this without exposing the Vetra API in
              the browser. The frontend only sees friendly JSON.
            </p>
          </div>

          <div
            id="dev"
            className="rounded-lg border border-emerald-400/40 bg-black/40 p-4 text-xs text-emerald-100"
          >
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300">
              Dev flow
            </p>
            <pre className="whitespace-pre-wrap">
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
