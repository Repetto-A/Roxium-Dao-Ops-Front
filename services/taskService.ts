// services/taskService.ts
import { apiClient } from "./apiClient";

// ---- Create Task Input & Response ----

export interface CreateTaskInput {
  proposalId: string;
  daoId: string;
  title: string;
  description?: string;
  assignee?: string;
  deadline?: string; // ISO string
  budget?: number;
}

export interface CreateTaskResponse {
  taskId: string; // Document ID of the newly created task
}

// ---- Service Functions ----

// POST /api/vetra/tasks → Create new task
export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  return apiClient.post<CreateTaskResponse>("/api/vetra/tasks", input);
}

// PATCH /api/vetra/tasks/[taskId]/status → Update task status
export async function updateTaskStatus(
  taskId: string,
  status: string,
): Promise<{ taskId: string; status: string }> {
  return apiClient.patch(`/api/vetra/tasks/${taskId}/status`, { status });
}

// PATCH /api/vetra/tasks/[taskId]/assignee → Assign task
export async function assignTask(
  taskId: string,
  assignee: string,
): Promise<{ taskId: string; assignee: string }> {
  return apiClient.patch(`/api/vetra/tasks/${taskId}/assignee`, { assignee });
}

// ---- Re-exports for backward compatibility ----
export type { Task, TaskStatus } from "@/lib/vetra/types";
