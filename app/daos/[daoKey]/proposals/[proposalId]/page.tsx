"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useDaoBoard, useUpdateDao, useDeleteDao } from "@/hooks/useDaos";
import { useUpdateProposalStatus } from "@/hooks/useProposals";
import { useUpdateTaskStatus, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useToast } from "@/components/ui/toast";

import { DaoBoardHeader } from "@/components/dao/DaoBoardHeader";
import { TaskCreateForm } from "@/components/task/TaskCreateForm";
import { TaskList } from "@/components/task/TaskList";

import { Container } from "@/components/common/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getNextProposalStatus,
  getStatusActionLabel,
  getStatusLabel,
  getStatusVariant,
} from "@/lib/status";
import { formatDate, truncateId } from "@/lib/format";
import type { ProposalStatus, TaskStatus } from "@/lib/vetra/types";
import { ArrowLeft, ArrowRight, Calendar, Coins, Plus, User } from "lucide-react";

export default function ProposalDetailPage() {
  const params = useParams<{ daoKey?: string; proposalId?: string }>();
  const daoKey = params.daoKey ?? null;
  const proposalId = params.proposalId ?? null;

  const router = useRouter();
  const { dao, proposals, tasks, loading, error, refetch } = useDaoBoard(daoKey);
  const { mutate: updateDaoMutate } = useUpdateDao();
  const { mutate: deleteDaoMutate } = useDeleteDao();
  const { mutate: updateProposalStatus } = useUpdateProposalStatus();
  const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const { mutate: updateTaskMutate } = useUpdateTask();
  const { mutate: deleteTaskMutate } = useDeleteTask();
  const { toast } = useToast();

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const selectedProposal = useMemo(
    () => proposals.find((proposal) => proposal.id === proposalId) ?? null,
    [proposalId, proposals],
  );

  const tasksForSelectedProposal = useMemo(
    () =>
      proposalId ? tasks.filter((task) => task.proposalId === proposalId) : [],
    [tasks, proposalId],
  );

  const taskStatusCountsForSelected = useMemo(
    () => ({
      TODO: tasksForSelectedProposal.filter((task) => (task.status ?? "TODO") === "TODO")
        .length,
      IN_PROGRESS: tasksForSelectedProposal.filter((task) => task.status === "IN_PROGRESS")
        .length,
      DONE: tasksForSelectedProposal.filter((task) => task.status === "DONE").length,
    }),
    [tasksForSelectedProposal],
  );

  async function handleReload(): Promise<void> {
    await refetch();
  }

  async function handleUpdateDao(daoId: string, input: { name?: string; description?: string }) {
    try {
      await updateDaoMutate(daoId, input);
      toast({
        title: "DAO updated",
        description: "Changes saved successfully.",
        variant: "success",
      });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update DAO.", variant: "error" });
    }
  }

  async function handleDeleteDao(daoId: string) {
    try {
      await deleteDaoMutate(daoId);
      toast({
        title: "DAO deleted",
        description: "DAO has been permanently deleted.",
        variant: "success",
      });
      router.push("/daos");
    } catch {
      toast({ title: "Error", description: "Failed to delete DAO.", variant: "error" });
    }
  }

  async function handleProposalStatusChange(
    currentProposalId: string,
    newStatus: ProposalStatus,
  ): Promise<void> {
    try {
      await updateProposalStatus(
        currentProposalId,
        newStatus,
        newStatus === "CLOSED" ? new Date().toISOString() : undefined,
      );
      toast({
        title: "Status updated",
        description: `Proposal status changed to ${getStatusLabel(newStatus)}.`,
        variant: "success",
      });
      await refetch();
    } catch {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the proposal status.",
        variant: "error",
      });
    }
  }

  async function handleTaskStatusChange(taskId: string, newStatus: TaskStatus): Promise<void> {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast({
        title: "Status updated",
        description: `Task status changed to ${getStatusLabel(newStatus)}.`,
        variant: "success",
      });
      await refetch();
    } catch {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the task status.",
        variant: "error",
      });
    }
  }

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
      toast({
        title: "Task deleted",
        description: "Task has been permanently deleted.",
        variant: "success",
      });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to delete task.", variant: "error" });
    }
  }

  if (!daoKey || !proposalId) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 py-8">
          <Container>
            <p className="text-sm text-red-400">
              The route is missing <code>daoKey</code> or <code>proposalId</code>.
            </p>
          </Container>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const hasDao = !!dao;
  const selectedProposalStatus = selectedProposal?.status ?? "DRAFT";
  const nextSelectedProposalStatus = selectedProposal
    ? getNextProposalStatus(selectedProposalStatus)
    : null;
  const nextSelectedProposalAction = nextSelectedProposalStatus
    ? getStatusActionLabel(selectedProposalStatus)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader
        breadcrumbs={[
          { label: "DAOs", href: "/daos" },
          { label: dao?.name ?? "Board", href: `/daos/${daoKey}` },
          { label: selectedProposal?.title ?? "Proposal" },
        ]}
      />
      <main className="flex-1 py-8">
        <Container wide>
          {!hasDao && loading && (
            <p className="mb-6 text-sm text-muted-foreground">Loading DAO information from Vetra…</p>
          )}

          {!hasDao && !loading && !error && (
            <p className="mb-6 text-sm text-destructive">
              No DAO information was found in Vetra.
            </p>
          )}

          {error && <p className="mb-6 text-sm text-destructive">Error loading board: {error}</p>}

          {hasDao && (
            <>
              <div className="mb-8">
                <DaoBoardHeader dao={dao} onUpdate={handleUpdateDao} onDelete={handleDeleteDao} />
              </div>

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Button variant="outline" onClick={() => router.push(`/daos/${daoKey}`)}>
                  <ArrowLeft className="size-4" />
                  Back to Proposals
                </Button>
                {selectedProposal && (
                  <Button onClick={() => setTaskDialogOpen(true)}>
                    <Plus className="size-4" />
                    Create Task
                  </Button>
                )}
              </div>

              {!selectedProposal ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Proposal not found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The proposal does not belong to this DAO or no longer exists.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="mb-6 border-primary/20">
                    <CardHeader className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <CardTitle className="text-2xl text-foreground">{selectedProposal.title}</CardTitle>
                        <Badge
                          variant={
                            getStatusVariant(selectedProposalStatus) as
                              | "status-draft"
                              | "status-open"
                              | "status-closed"
                              | "status-archived"
                          }
                        >
                          {getStatusLabel(selectedProposalStatus)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedProposal.description ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {selectedProposal.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No description provided.</p>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                          <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Proposal ID
                          </p>
                          <p className="font-mono text-sm text-foreground">
                            {truncateId(selectedProposal.id)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                          <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Tasks
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {tasksForSelectedProposal.length} linked{" "}
                            {tasksForSelectedProposal.length === 1 ? "task" : "tasks"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {selectedProposal.createdBy && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                            <User className="size-3.5" />
                            {truncateId(selectedProposal.createdBy)}
                          </span>
                        )}
                        {selectedProposal.createdAt && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                            <Calendar className="size-3.5" />
                            {formatDate(selectedProposal.createdAt)}
                          </span>
                        )}
                        {selectedProposal.budget != null && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                            <Coins className="size-3.5" />
                            Budget: {selectedProposal.budget}
                          </span>
                        )}
                        {selectedProposal.deadline && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
                            <Calendar className="size-3.5" />
                            Due: {formatDate(selectedProposal.deadline)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="status-todo">{taskStatusCountsForSelected.TODO} To Do</Badge>
                        <Badge variant="status-progress">
                          {taskStatusCountsForSelected.IN_PROGRESS} In Progress
                        </Badge>
                        <Badge variant="status-done">{taskStatusCountsForSelected.DONE} Done</Badge>
                      </div>

                      {nextSelectedProposalStatus && nextSelectedProposalAction && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleProposalStatusChange(
                                selectedProposal.id,
                                nextSelectedProposalStatus,
                              )
                            }
                          >
                            <ArrowRight className="mr-2 size-4" />
                            {nextSelectedProposalAction}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <TaskList
                    tasks={tasksForSelectedProposal}
                    loading={loading}
                    error={error}
                    selectedProposalKey={selectedProposal.id}
                    onStatusChange={handleTaskStatusChange}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                </>
              )}

              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      Create Task
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground/90">
                      Create a task for this proposal.
                    </DialogDescription>
                  </DialogHeader>
                  <TaskCreateForm
                    daoId={daoKey}
                    proposalId={selectedProposal?.id ?? null}
                    hideSectionHeader
                    onCreated={async () => {
                      await handleReload();
                      setTaskDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
