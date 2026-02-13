// hooks/useTasks.ts
"use client";

import { useCallback, useState } from "react";
import { createTask, updateTaskStatus } from "@/services/taskService";

import type {
  CreateTaskInput,
  CreateTaskResponse,
} from "@/services/taskService";
import type { TaskStatus } from "@/lib/vetra/types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error";
}

// ---- crear task ----

export interface UseCreateTaskResult {
  mutate: (input: CreateTaskInput) => Promise<CreateTaskResponse>;
  loading: boolean;
  error: string | null;
  lastResult: CreateTaskResponse | null;
}

export function useCreateTask(): UseCreateTaskResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CreateTaskResponse | null>(null);

  const mutate = useCallback(
    async (input: CreateTaskInput): Promise<CreateTaskResponse> => {
      try {
        setLoading(true);
        setError(null);
        const res = await createTask(input);
        setLastResult(res);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useCreateTask error:", err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    mutate,
    loading,
    error,
    lastResult,
  };
}

// ---- update task status ----

export interface UseUpdateTaskStatusResult {
  mutate: (
    taskId: string,
    status: TaskStatus,
  ) => Promise<{ taskId: string; status: string }>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTaskStatus(): UseUpdateTaskStatusResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      taskId: string,
      status: TaskStatus,
    ): Promise<{ taskId: string; status: string }> => {
      try {
        setLoading(true);
        setError(null);
        const res = await updateTaskStatus(taskId, status);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useUpdateTaskStatus error:", err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    mutate,
    loading,
    error,
  };
}

// Note: Tasks are fetched as part of the DAO board via useDaoBoard hook.
// No separate hooks for listing/querying tasks are needed.
