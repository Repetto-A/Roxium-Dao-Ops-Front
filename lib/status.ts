// lib/status.ts — Status variant mapping and transition logic

import type { ProposalStatus, TaskStatus } from "@/lib/vetra/types";

// ---------------------------------------------------------------------------
// Badge variant mapping
// ---------------------------------------------------------------------------

const STATUS_VARIANT_MAP: Record<string, string> = {
  DRAFT: "status-draft",
  OPEN: "status-open",
  CLOSED: "status-closed",
  ARCHIVED: "status-archived",
  TODO: "status-todo",
  IN_PROGRESS: "status-progress",
  DONE: "status-done",
};

export function getStatusVariant(
  status: ProposalStatus | TaskStatus,
): string {
  return STATUS_VARIANT_MAP[status] ?? "outline";
}

// ---------------------------------------------------------------------------
// Status display labels (human-readable)
// ---------------------------------------------------------------------------

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function getStatusLabel(status: ProposalStatus | TaskStatus): string {
  return STATUS_LABEL_MAP[status] ?? status;
}

// ---------------------------------------------------------------------------
// Status transitions
// ---------------------------------------------------------------------------

const PROPOSAL_TRANSITIONS: Record<ProposalStatus, ProposalStatus | null> = {
  DRAFT: "OPEN",
  OPEN: "CLOSED",
  CLOSED: "ARCHIVED",
  ARCHIVED: null,
};

const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus | null> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: null,
};

export function getNextProposalStatus(
  current: ProposalStatus,
): ProposalStatus | null {
  return PROPOSAL_TRANSITIONS[current] ?? null;
}

export function getNextTaskStatus(
  current: TaskStatus,
): TaskStatus | null {
  return TASK_TRANSITIONS[current] ?? null;
}

// ---------------------------------------------------------------------------
// Action button labels for transitions
// ---------------------------------------------------------------------------

const ACTION_LABEL_MAP: Record<string, string> = {
  DRAFT: "Open",
  OPEN: "Close",
  CLOSED: "Archive",
  TODO: "Start",
  IN_PROGRESS: "Complete",
};

export function getStatusActionLabel(
  status: ProposalStatus | TaskStatus,
): string | null {
  return ACTION_LABEL_MAP[status] ?? null;
}
