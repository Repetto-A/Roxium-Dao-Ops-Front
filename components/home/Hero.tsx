// components/home/Hero.tsx
import Link from "next/link";
import { Container } from "../common/Container";

export function Hero() {
  return (
    <section className="border-b border-white/10 bg-gradient-to-b from-[#050816] via-[#020617] to-black">
      <Container>
        <div className="flex flex-col gap-10 py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/5 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              On-chain DAO Ops
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
              Orchestrate your DAOs, proposals and tasks{" "}
              <span className="text-emerald-300">on top of Vetra</span>.
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              This board turns the classic{" "}
              <span className="font-mono text-emerald-200">
                DAO → Proposal → Task
              </span>{" "}
              structure into on-chain entities using Vetra. Every decision, task
              and role is recorded with TTL, advanced queries and real-time
              events.
            </p>

            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                • Create DAOs and memberships without exposing keys in the
                frontend.
              </li>
              <li>
                • Define proposals with on-chain deadlines and explicit TTL.
              </li>
              <li>
                • Break your roadmap into trackable tasks, fully queryable
                through Vetra.
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/daos"
                className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-black shadow-md shadow-emerald-500/30 hover:bg-emerald-300"
              >
                Start building
              </Link>
              <a
                href="#how-it-works"
                className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:border-emerald-400/70 hover:text-emerald-200"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="mt-4 flex-1 md:mt-0">
            <div className="rounded-xl border border-emerald-500/40 bg-black/40 p-4 shadow-[0_0_60px_-30px_rgba(16,185,129,0.8)]">
              <pre className="max-h-80 overflow-auto text-xs text-emerald-100">
                {`dao: Roxium DAO Ops
  ├─ proposal: "Daily standup at 9:30?"
  │    ├─ task: "Update calendar"
  │    └─ task: "Notify in #dev channel"
  └─ proposal: "New PR review policy"
       └─ task: "Configure rules in GitHub"

storage: Vetra · Mendoza Testnet
TTL-aware · Queryable · Subscribable`}
              </pre>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
