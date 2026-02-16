"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useDaoBoard, useUpdateDao, useDeleteDao } from "@/hooks/useDaos";
import { useUpdateProposal, useDeleteProposal } from "@/hooks/useProposals";
import { useToast } from "@/components/ui/toast";

import { DaoBoardHeader } from "@/components/dao/DaoBoardHeader";
import { BoardSummary } from "@/components/dao/BoardSummary";
import { ProposalCreateForm } from "@/components/proposal/ProposalCreateForm";
import { ProposalList } from "@/components/proposal/ProposalList";

import { Container } from "@/components/common/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function DaoBoardPage() {
  const params = useParams<{ daoKey?: string }>();
  const daoKey = params.daoKey ?? null;

  const router = useRouter();
  const { dao, proposals, tasks, loading, error, refetch } = useDaoBoard(daoKey);
  const { mutate: updateDaoMutate } = useUpdateDao();
  const { mutate: deleteDaoMutate } = useDeleteDao();
  const { mutate: updateProposalMutate } = useUpdateProposal();
  const { mutate: deleteProposalMutate } = useDeleteProposal();
  const { toast } = useToast();

  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);

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

  async function handleUpdateProposal(
    proposalId: string,
    input: { title?: string; description?: string; budget?: number | null; deadline?: string | null },
  ) {
    try {
      await updateProposalMutate(proposalId, input);
      toast({
        title: "Proposal updated",
        description: "Changes saved successfully.",
        variant: "success",
      });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update proposal.", variant: "error" });
    }
  }

  async function handleDeleteProposal(proposalId: string) {
    try {
      await deleteProposalMutate(proposalId);
      toast({
        title: "Proposal deleted",
        description: "Proposal has been permanently deleted.",
        variant: "success",
      });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to delete proposal.", variant: "error" });
    }
  }

  if (!daoKey) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
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

              <div className="mb-8">
                <BoardSummary proposals={proposals} tasks={tasks} />
              </div>

              <div className="mb-6 flex justify-end">
                <Button onClick={() => setProposalDialogOpen(true)}>
                  <Plus className="size-4" />
                  Create Proposal
                </Button>
              </div>

              <ProposalList
                proposals={proposals}
                loading={loading}
                error={error}
                selectedProposalKey={null}
                onSelectProposal={(proposalKey) =>
                  router.push(`/daos/${daoKey}/proposals/${proposalKey}`)
                }
                onReload={handleReload}
                taskCountByProposal={taskCountByProposal}
                onUpdate={handleUpdateProposal}
                onDelete={handleDeleteProposal}
              />

              <Dialog open={proposalDialogOpen} onOpenChange={setProposalDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      Create Proposal
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground/90">
                      Create a work, budget, or decision proposal for this DAO.
                    </DialogDescription>
                  </DialogHeader>
                  <ProposalCreateForm
                    daoId={daoKey}
                    hideSectionHeader
                    onCreated={async () => {
                      await handleReload();
                      setProposalDialogOpen(false);
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
