"use client";

import { useState, useRef } from "react";
import type { Proposal, ProposalStatus } from "@/lib/vetra/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileText, ArrowRight, Pencil, X, Check, Calendar } from "lucide-react";
import {
  getStatusVariant,
  getStatusLabel,
  getNextProposalStatus,
  getStatusActionLabel,
} from "@/lib/status";
import { truncateId, formatDate } from "@/lib/format";
import { SectionHeader } from "@/components/common/SectionHeader";

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
  onUpdate?: (
    proposalId: string,
    input: { title?: string; description?: string; budget?: number | null; deadline?: string | null },
  ) => Promise<void>;
  onDelete?: (proposalId: string) => Promise<void>;
}

export function ProposalList({
  proposals,
  loading,
  error,
  selectedProposalKey,
  onSelectProposal,
  onReload,
  taskCountByProposal,
  onStatusChange,
  onUpdate,
  onDelete,
}: ProposalListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const deadlineInputRef = useRef<HTMLInputElement>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startEdit(proposal: Proposal, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(proposal.id);
    setEditTitle(proposal.title);
    setEditDescription(proposal.description ?? "");
    setEditBudget(proposal.budget != null ? String(proposal.budget) : "");
    setEditDeadline(proposal.deadline ? proposal.deadline.slice(0, 16) : "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditBudget("");
    setEditDeadline("");
  }

  async function saveEdit(proposalId: string) {
    if (!onUpdate || !editTitle.trim()) return;
    setSaving(true);
    try {
      const budgetNum = editBudget.trim() ? parseFloat(editBudget) : null;
      const deadlineIso = editDeadline.trim() ? new Date(editDeadline).toISOString() : null;
      await onUpdate(proposalId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        budget: budgetNum,
        deadline: deadlineIso,
      });
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!onDelete || !deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  const deletingProposal = proposals.find((p) => p.id === deleteId);

  return (
    <div>
      <SectionHeader
        title="Proposals"
        variant="create"
        titleClassName="text-foreground"
      />
      <Card>
        <CardHeader>
          <CardTitle>
            All Proposals
          </CardTitle>
        </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-muted/30 p-4"
              >
                <Skeleton className="mb-2 h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">
            Error loading proposals: {error}
          </p>
        )}

        {!loading && !error && proposals.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <FileText className="size-10 text-muted-foreground/50" />
            <p className="text-base font-medium text-muted-foreground">No proposals yet</p>
            <p className="text-sm text-muted-foreground/70">
              Create one using the form on the left to get started.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {proposals.map((proposal, index) => {
            const isSelected = proposal.id === selectedProposalKey;
            const isEditing = editingId === proposal.id;
            const taskCount = taskCountByProposal?.[proposal.id] ?? 0;
            const status = proposal.status ?? "DRAFT";
            const nextStatus = getNextProposalStatus(status);
            const actionLabel = getStatusActionLabel(status);

            return (
              <div key={`${proposal.id}-${index}`} className="space-y-2">
                {isEditing ? (
                  <div className="rounded-lg border border-primary bg-primary/5 p-4 space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Proposal title"
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      rows={2}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        placeholder="Budget (optional)"
                      />
                      <div className="relative">
                        <Input
                          ref={deadlineInputRef}
                          type="datetime-local"
                          className="pr-10"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => deadlineInputRef.current?.showPicker?.()}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                          aria-label="Open calendar picker"
                        >
                          <Calendar className="size-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(proposal.id)} disabled={saving || !editTitle.trim()}>
                        <Check className="mr-1 size-3.5" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => onSelectProposal(proposal.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectProposal(proposal.id);
                      }
                    }}
                    className={[
                      "w-full rounded-lg border px-4 py-3 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/60 bg-card hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground truncate text-sm">
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
                          >
                            {getStatusLabel(status)}
                          </Badge>
                          {onUpdate && (
                            <button
                              type="button"
                              onClick={(e) => startEdit(proposal, e)}
                              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                              aria-label="Edit proposal"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(proposal.id);
                              }}
                              className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              aria-label="Delete proposal"
                            >
                              <X className="size-3.5" />
                            </button>
                          )}
                        </div>

                        {proposal.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {proposal.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                          <span className="font-mono text-primary/90">
                            {truncateId(proposal.id)}
                          </span>
                          {proposal.createdAt && (
                            <span>
                              {formatDate(proposal.createdAt)}
                            </span>
                          )}
                          <span className="font-medium">
                            {taskCount} {taskCount === 1 ? "task" : "tasks"}
                          </span>
                        </div>
                      </div>

                      {proposal.budget != null && (
                        <div className="text-right text-xs text-muted-foreground">
                          <div className="text-[10px] uppercase tracking-wider mb-1">Budget</div>
                          <div className="text-base font-semibold text-primary">
                            {proposal.budget}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status action button - only show on selected proposal if there's a next status */}
                {isSelected && !isEditing && nextStatus && actionLabel && onStatusChange && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(proposal.id, nextStatus);
                      }}
                    >
                      <ArrowRight className="mr-2 size-4" />
                      {actionLabel}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Proposal"
        description={
          deletingProposal
            ? `Are you sure you want to delete "${deletingProposal.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this proposal?"
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
