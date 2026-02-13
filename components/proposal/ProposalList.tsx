"use client";

import type { Proposal, ProposalStatus } from "@/lib/vetra/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { getStatusVariant, getStatusLabel } from "@/lib/status";
import { truncateId, formatDate } from "@/lib/format";

export interface ProposalListProps {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
  selectedProposalKey: string | null;
  onSelectProposal: (proposalKey: string) => void;
  onReload?: () => void | Promise<void>;
  taskCountByProposal?: Record<string, number>;
  onStatusChange?: (
    proposalId: string,
    newStatus: ProposalStatus,
  ) => Promise<void>;
}

export function ProposalList({
  proposals,
  loading,
  error,
  selectedProposalKey,
  onSelectProposal,
  onReload,
  taskCountByProposal,
}: ProposalListProps) {
  async function handleReloadClick() {
    if (!onReload) return;
    const maybe = onReload();
    if (maybe instanceof Promise) {
      await maybe;
    }
  }

  return (
    <Card className="border-white/10 bg-black/40">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base">
            Proposals{!loading && ` (${proposals.length})`}
          </CardTitle>
          <CardDescription className="text-xs">
            Operational proposals and decisions stored in Vetra.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void handleReloadClick()}
        >
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-md border border-slate-800/80 bg-black/60 p-3"
              >
                <Skeleton className="mb-2 h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400">
            Error loading proposals: {error}
          </p>
        )}

        {!loading && !error && proposals.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <FileText className="size-8 text-slate-600" />
            <p className="text-sm text-slate-400">No proposals yet</p>
            <p className="text-xs text-slate-500">
              Create one using the form on the left to get started.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {proposals.map((proposal, index) => {
            const isSelected = proposal.id === selectedProposalKey;
            const taskCount = taskCountByProposal?.[proposal.id] ?? 0;
            const status = proposal.status ?? "DRAFT";

            return (
              <button
                key={`${proposal.id}-${index}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectProposal(proposal.id)}
                className={[
                  "w-full rounded-md border px-3 py-2 text-left text-xs transition",
                  isSelected
                    ? "border-emerald-500/70 bg-emerald-500/10"
                    : "border-slate-800 bg-black/60 hover:border-emerald-500/50 hover:bg-black",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 truncate">
                        {proposal.title}
                      </span>
                      <Badge
                        variant={
                          getStatusVariant(status) as
                            | "status-draft"
                            | "status-open"
                            | "status-closed"
                            | "status-archived"
                        }
                        className="text-[10px] uppercase tracking-[0.16em]"
                      >
                        {getStatusLabel(status)}
                      </Badge>
                    </div>

                    {proposal.description && (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                        {proposal.description}
                      </p>
                    )}

                    <div className="mt-1 flex items-center gap-3">
                      <span className="font-mono text-xs text-emerald-300/80">
                        {truncateId(proposal.id)}
                      </span>
                      {proposal.createdAt && (
                        <span className="text-xs text-slate-500">
                          {formatDate(proposal.createdAt)}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {taskCount} {taskCount === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                  </div>

                  {proposal.budget != null && (
                    <div className="text-right text-xs text-emerald-300">
                      Budget
                      <div className="text-sm font-semibold">
                        {proposal.budget}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
