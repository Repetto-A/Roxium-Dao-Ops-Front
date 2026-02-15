"use client";

import { useState, useRef } from "react";
import type { ReactNode } from "react";
import type { Task, TaskStatus } from "@/lib/vetra/types";
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
import { ListTodo, MousePointerClick, ArrowRight, Pencil, X, Check, Calendar } from "lucide-react";
import {
  getStatusVariant,
  getStatusLabel,
  getNextTaskStatus,
  getStatusActionLabel,
} from "@/lib/status";
import { truncateId, formatDate } from "@/lib/format";
import { SectionHeader } from "@/components/common/SectionHeader";

export interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedProposalKey?: string | null;
  headerAction?: ReactNode;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onUpdate?: (
    taskId: string,
    input: { title?: string; description?: string; budget?: number | null; deadline?: string | null },
  ) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export function TaskList({
  tasks,
  loading,
  error,
  selectedProposalKey,
  headerAction,
  onStatusChange,
  onUpdate,
  onDelete,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const deadlineInputRef = useRef<HTMLInputElement>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditBudget(task.budget != null ? String(task.budget) : "");
    setEditDeadline(task.deadline ? task.deadline.slice(0, 16) : "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditBudget("");
    setEditDeadline("");
  }

  async function saveEdit(taskId: string) {
    if (!onUpdate || !editTitle.trim()) return;
    setSaving(true);
    try {
      const budgetNum = editBudget.trim() ? parseFloat(editBudget) : null;
      const deadlineIso = editDeadline.trim() ? new Date(editDeadline).toISOString() : null;
      await onUpdate(taskId, {
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

  const deletingTask = tasks.find((t) => t.id === deleteId);

  return (
    <div>
      <SectionHeader
        title="Tasks"
        description={!loading && selectedProposalKey ? `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} for this proposal` : undefined}
        variant="create"
        titleClassName="text-foreground"
        action={headerAction}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            All Tasks
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
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">Error loading tasks: {error}</p>
        )}

        {!loading && !error && !selectedProposalKey && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <MousePointerClick className="size-10 text-muted-foreground/50" />
            <p className="text-base font-medium text-muted-foreground">Select a proposal</p>
            <p className="text-sm text-muted-foreground/70">
              Choose a proposal to view its tasks.
            </p>
          </div>
        )}

        {!loading && !error && selectedProposalKey && tasks.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <ListTodo className="size-10 text-muted-foreground/50" />
            <p className="text-base font-medium text-muted-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground/70">
              Add tasks below to break down this proposal.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isEditing = editingId === task.id;
            const status = task.status ?? "TODO";
            const nextStatus = getNextTaskStatus(status);
            const actionLabel = getStatusActionLabel(status);

            return (
              <div key={`${task.id}-${index}`} className="space-y-2">
                {isEditing ? (
                  <div className="rounded-lg border border-primary bg-primary/5 p-4 space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title"
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
                      <Button size="sm" onClick={() => saveEdit(task.id)} disabled={saving || !editTitle.trim()}>
                        <Check className="mr-1 size-3.5" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground truncate text-sm">
                            {task.title}
                          </span>
                          <Badge
                            variant={
                              getStatusVariant(status) as
                                | "status-todo"
                                | "status-progress"
                                | "status-done"
                            }
                          >
                            {getStatusLabel(status)}
                          </Badge>
                          {onUpdate && (
                            <button
                              type="button"
                              onClick={() => startEdit(task)}
                              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                              aria-label="Edit task"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(task.id)}
                              className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              aria-label="Delete task"
                            >
                              <X className="size-3.5" />
                            </button>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                          <span className="font-mono text-primary/90">
                            {truncateId(task.id)}
                          </span>
                          {task.createdAt && (
                            <span>
                              {formatDate(task.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status action button - show if there's a next status */}
                {!isEditing && nextStatus && actionLabel && onStatusChange && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, nextStatus);
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
        title="Delete Task"
        description={
          deletingTask
            ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this task?"
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
