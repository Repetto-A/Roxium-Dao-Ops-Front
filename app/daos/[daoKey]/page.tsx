// app/daos/[daoKey]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useDaoBoard } from "@/hooks/useDaos";
import { useUpdateDao, useDeleteDao } from "@/hooks/useDaos";
import { useUpdateProposalStatus } from "@/hooks/useProposals";
import { useUpdateProposal, useDeleteProposal } from "@/hooks/useProposals";
import { useUpdateTaskStatus } from "@/hooks/useTasks";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/toast";

import { DaoBoardHeader } from "@/components/dao/DaoBoardHeader";
import { BoardSummary } from "@/components/dao/BoardSummary";
import { ProposalCreateForm } from "@/components/proposal/ProposalCreateForm";
import { ProposalList } from "@/components/proposal/ProposalList";
import { TaskCreateForm } from "@/components/task/TaskCreateForm";
import { TaskList } from "@/components/task/TaskList";

import { Container } from "@/components/common/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

import type { ProposalStatus, TaskStatus } from "@/lib/vetra/types";
import { getStatusLabel } from "@/lib/status";

export default function DaoBoardPage() {
  const params = useParams<{ daoKey?: string }>();
  const daoKey = params.daoKey ?? null;

  const router = useRouter();
  const { dao, proposals, tasks, loading, error, refetch } =
    useDaoBoard(daoKey);
  const { mutate: updateDaoMutate } = useUpdateDao();
  const { mutate: deleteDaoMutate } = useDeleteDao();
  const { mutate: updateProposalStatus } = useUpdateProposalStatus();
  const { mutate: updateProposalMutate } = useUpdateProposal();
  const { mutate: deleteProposalMutate } = useDeleteProposal();
  const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const { mutate: updateTaskMutate } = useUpdateTask();
  const { mutate: deleteTaskMutate } = useDeleteTask();
  const { toast } = useToast();

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

  async function handleProposalStatusChange(
    proposalId: string,
    newStatus: ProposalStatus,
  ): Promise<void> {
    try {
      await updateProposalStatus(
        proposalId,
        newStatus,
        newStatus === "CLOSED" ? new Date().toISOString() : undefined,
      );
      toast({
        title: "Status updated",
        description: `Proposal status changed to ${getStatusLabel(newStatus)}.`,
        variant: "success",
      });
      await refetch();
    } catch (err) {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the proposal status.",
        variant: "error",
      });
    }
  }

  async function handleTaskStatusChange(
    taskId: string,
    newStatus: TaskStatus,
  ): Promise<void> {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast({
        title: "Status updated",
        description: `Task status changed to ${getStatusLabel(newStatus)}.`,
        variant: "success",
      });
      await refetch();
    } catch (err) {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the task status.",
        variant: "error",
      });
    }
  }

  // ---- DAO update/delete ----

  async function handleUpdateDao(daoId: string, input: { name?: string; description?: string }) {
    try {
      await updateDaoMutate(daoId, input);
      toast({ title: "DAO updated", description: "Changes saved successfully.", variant: "success" });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update DAO.", variant: "error" });
    }
  }

  async function handleDeleteDao(daoId: string) {
    try {
      await deleteDaoMutate(daoId);
      toast({ title: "DAO archived", description: "DAO has been archived.", variant: "success" });
      router.push("/daos");
    } catch {
      toast({ title: "Error", description: "Failed to archive DAO.", variant: "error" });
    }
  }

  // ---- Proposal update/delete ----

  async function handleUpdateProposal(
    proposalId: string,
    input: { title?: string; description?: string; budget?: number | null; deadline?: string | null },
  ) {
    try {
      await updateProposalMutate(proposalId, input);
      toast({ title: "Proposal updated", description: "Changes saved successfully.", variant: "success" });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update proposal.", variant: "error" });
    }
  }

  async function handleDeleteProposal(proposalId: string) {
    try {
      await deleteProposalMutate(proposalId);
      toast({ title: "Proposal archived", description: "Proposal has been archived.", variant: "success" });
      if (selectedProposalKey === proposalId) {
        setUserSelectedProposalKey(null);
      }
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to archive proposal.", variant: "error" });
    }
  }

  // ---- Task update/delete ----

  async function handleUpdateTask(
    taskId: string,
    input: { title?: string; description?: string; budget?: number | null; deadline?: string | null },
  ) {
    try {
      await updateTaskMutate(taskId, input);
      toast({ title: "Task updated", description: "Changes saved successfully.", variant: "success" });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update task.", variant: "error" });
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTaskMutate(taskId);
      toast({ title: "Task archived", description: "Task has been archived.", variant: "success" });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to archive task.", variant: "error" });
    }
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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        breadcrumbs={[
          { label: "DAOs", href: "/daos" },
          { label: dao?.name ?? "Board" },
        ]}
      />
      <main className="flex-1 py-8">
        <Container wide>
          {!hasDao && loading && (
            <p className="mb-6 text-sm text-muted-foreground">
              Loading DAO information from Vetra…
            </p>
          )}

          {!hasDao && !loading && !error && (
            <p className="mb-6 text-sm text-destructive">
              No DAO information was found in Vetra.
            </p>
          )}

          {error && (
            <p className="mb-6 text-sm text-destructive">
              Error loading board: {error}
            </p>
          )}

          {hasDao && (
            <>
              <div className="mb-8">
                <DaoBoardHeader dao={dao} onUpdate={handleUpdateDao} onDelete={handleDeleteDao} />
              </div>

              <div className="mb-8">
                <BoardSummary proposals={proposals} tasks={tasks} />
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)]">
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
                  onStatusChange={handleProposalStatusChange}
                  onUpdate={handleUpdateProposal}
                  onDelete={handleDeleteProposal}
                />

                {/* Column 3: Tasks for the selected proposal */}
                <div className="space-y-6">
                  <TaskList
                    tasks={tasksForSelectedProposal}
                    loading={loading}
                    error={error}
                    selectedProposalKey={selectedProposalKey}
                    onStatusChange={handleTaskStatusChange}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
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
