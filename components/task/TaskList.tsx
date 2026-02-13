"use client";

import type { Task, TaskStatus } from "@/lib/vetra/types";
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
import { ListTodo, MousePointerClick, ArrowRight } from "lucide-react";
import {
  getStatusVariant,
  getStatusLabel,
  getNextTaskStatus,
  getStatusActionLabel,
} from "@/lib/status";
import { truncateId, formatDate } from "@/lib/format";

export interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedProposalKey?: string | null;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export function TaskList({
  tasks,
  loading,
  error,
  selectedProposalKey,
  onStatusChange,
}: TaskListProps) {
  return (
    <Card className="border-white/10 bg-black/40">
      <CardHeader>
        <CardTitle className="text-base">
          Tasks{!loading && selectedProposalKey && ` (${tasks.length})`}
        </CardTitle>
        <CardDescription className="text-xs">
          Tasks linked to the selected proposal.
        </CardDescription>
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
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400">Error loading tasks: {error}</p>
        )}

        {!loading && !error && !selectedProposalKey && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <MousePointerClick className="size-8 text-slate-600" />
            <p className="text-sm text-slate-400">Select a proposal</p>
            <p className="text-xs text-slate-500">
              Choose a proposal to view its tasks.
            </p>
          </div>
        )}

        {!loading && !error && selectedProposalKey && tasks.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <ListTodo className="size-8 text-slate-600" />
            <p className="text-sm text-slate-400">No tasks yet</p>
            <p className="text-xs text-slate-500">
              Add tasks below to break down this proposal.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {tasks.map((task, index) => {
            const status = task.status ?? "TODO";
            const nextStatus = getNextTaskStatus(status);
            const actionLabel = getStatusActionLabel(status);

            return (
              <div key={`${task.id}-${index}`} className="space-y-2">
                <div className="rounded-md border border-slate-800/80 bg-black/60 p-3 text-xs sm:text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate">
                          {task.title}
                        </span>
                        <Badge
                          variant={
                            getStatusVariant(status) as
                              | "status-todo"
                              | "status-progress"
                              | "status-done"
                          }
                          className="text-[10px] uppercase tracking-[0.16em]"
                        >
                          {getStatusLabel(status)}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="mt-1 text-xs text-slate-400">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-1 flex items-center gap-3">
                        <span className="font-mono text-xs text-emerald-300/80">
                          {truncateId(task.id)}
                        </span>
                        {task.createdAt && (
                          <span className="text-xs text-slate-500">
                            {formatDate(task.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status action button - show if there's a next status */}
                {nextStatus && actionLabel && onStatusChange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(task.id, nextStatus);
                    }}
                    className="w-full text-xs"
                  >
                    <ArrowRight className="mr-1 size-3" />
                    {actionLabel}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
