"use client";

import type { Proposal, Task } from "@/lib/vetra/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { getStatusVariant, getStatusLabel } from "@/lib/status";

export interface BoardSummaryProps {
  proposals: Proposal[];
  tasks: Task[];
}

export function BoardSummary({ proposals, tasks }: BoardSummaryProps) {
  // Count proposals by status
  const proposalCounts = {
    DRAFT: proposals.filter((p) => (p.status ?? "DRAFT") === "DRAFT").length,
    OPEN: proposals.filter((p) => p.status === "OPEN").length,
    CLOSED: proposals.filter((p) => p.status === "CLOSED").length,
    ARCHIVED: proposals.filter((p) => p.status === "ARCHIVED").length,
  };

  // Count tasks by status
  const taskCounts = {
    TODO: tasks.filter((t) => (t.status ?? "TODO") === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Board Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          {/* Proposals summary */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              Proposals ({proposals.length})
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {proposalCounts.DRAFT > 0 && (
                <Badge
                  variant={getStatusVariant("DRAFT") as "status-draft"}
                >
                  {proposalCounts.DRAFT} {getStatusLabel("DRAFT")}
                </Badge>
              )}
              {proposalCounts.OPEN > 0 && (
                <Badge
                  variant={getStatusVariant("OPEN") as "status-open"}
                >
                  {proposalCounts.OPEN} {getStatusLabel("OPEN")}
                </Badge>
              )}
              {proposalCounts.CLOSED > 0 && (
                <Badge
                  variant={getStatusVariant("CLOSED") as "status-closed"}
                >
                  {proposalCounts.CLOSED} {getStatusLabel("CLOSED")}
                </Badge>
              )}
              {proposalCounts.ARCHIVED > 0 && (
                <Badge
                  variant={getStatusVariant("ARCHIVED") as "status-archived"}
                >
                  {proposalCounts.ARCHIVED} {getStatusLabel("ARCHIVED")}
                </Badge>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden h-5 w-px bg-border sm:block" />

          {/* Tasks summary */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              Tasks ({tasks.length})
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {taskCounts.TODO > 0 && (
                <Badge
                  variant={getStatusVariant("TODO") as "status-todo"}
                >
                  {taskCounts.TODO} {getStatusLabel("TODO")}
                </Badge>
              )}
              {taskCounts.IN_PROGRESS > 0 && (
                <Badge
                  variant={getStatusVariant("IN_PROGRESS") as "status-progress"}
                >
                  {taskCounts.IN_PROGRESS} {getStatusLabel("IN_PROGRESS")}
                </Badge>
              )}
              {taskCounts.DONE > 0 && (
                <Badge
                  variant={getStatusVariant("DONE") as "status-done"}
                >
                  {taskCounts.DONE} {getStatusLabel("DONE")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
