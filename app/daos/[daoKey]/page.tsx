// app/daos/[daoKey]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { useDaoBoard } from "@/hooks/useDaos";

import { DaoBoardHeader } from "@/components/dao/DaoBoardHeader";
import { ProposalCreateForm } from "@/components/proposal/ProposalCreateForm";
import { ProposalList } from "@/components/proposal/ProposalList";
import { TaskCreateForm } from "@/components/task/TaskCreateForm";
import { TaskList } from "@/components/task/TaskList";

import { Container } from "@/components/common/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function DaoBoardPage() {
  const params = useParams<{ daoKey?: string }>();
  const daoKey = params.daoKey ?? null;

  const { dao, proposals, tasks, loading, error, refetch } =
    useDaoBoard(daoKey);

  const [userSelectedProposalKey, setUserSelectedProposalKey] = useState<
    string | null
  >(null);

  // Selected proposal (user → first → null)
  const selectedProposalKey = useMemo<string | null>(() => {
    if (userSelectedProposalKey) return userSelectedProposalKey;
    if (proposals.length > 0) return proposals[0].id;
    return null;
  }, [userSelectedProposalKey, proposals]);

  // Tasks filtered by proposalKey
  const tasksForSelectedProposal = useMemo(
    () =>
      selectedProposalKey
        ? tasks.filter((task) => task.proposalId === selectedProposalKey)
        : [],
    [tasks, selectedProposalKey],
  );

  // Task count per proposal (for the proposal list)
  const taskCountByProposal = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const task of tasks) {
      counts[task.proposalId] = (counts[task.proposalId] || 0) + 1;
    }
    return counts;
  }, [tasks]);

  async function handleReload(): Promise<void> {
    await refetch();
  }

  // If there's no daoKey in the URL
  if (!daoKey) {
    return (
      <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
        <SiteHeader />
        <main className="flex-1 py-8">
          <Container>
            <p className="text-sm text-red-400">
              The <code>daoKey</code> parameter was not found in the URL.
            </p>
          </Container>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const hasDao = !!dao;

  return (
    <div className="flex min-h-screen flex-col bg-[#050816] text-slate-100">
      <SiteHeader />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-6 space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-300/80">
              Vetra · Mendoza Testnet
            </p>
            <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              DAO Board
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              View and manage this DAO&apos;s proposals and tasks.
            </p>
          </div>

          {!hasDao && loading && (
            <p className="mb-4 text-xs text-slate-400">
              Loading DAO information from Vetra…
            </p>
          )}

          {!hasDao && !loading && !error && (
            <p className="mb-4 text-xs text-red-400">
              No DAO information was found in Vetra.
            </p>
          )}

          {error && (
            <p className="mb-4 text-xs text-red-400">
              Error loading board: {error}
            </p>
          )}

          {hasDao && (
            <>
              <div className="mb-6">
                <DaoBoardHeader dao={dao} />
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,1.1fr)]">
                {/* Column 1: Create Proposal */}
                <ProposalCreateForm daoId={daoKey} onCreated={handleReload} />

                {/* Column 2: Proposal list */}
                <ProposalList
                  proposals={proposals}
                  loading={loading}
                  error={error}
                  selectedProposalKey={selectedProposalKey}
                  onSelectProposal={setUserSelectedProposalKey}
                  onReload={handleReload}
                  taskCountByProposal={taskCountByProposal}
                />

                {/* Column 3: Tasks for the selected proposal */}
                <div className="space-y-4">
                  <TaskList
                    tasks={tasksForSelectedProposal}
                    loading={loading}
                    error={error}
                    selectedProposalKey={selectedProposalKey}
                  />
                  <TaskCreateForm
                    daoId={daoKey}
                    proposalId={selectedProposalKey}
                    onCreated={handleReload}
                  />
                </div>
              </div>
            </>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
