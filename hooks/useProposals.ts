// hooks/useProposals.ts
"use client";

import { useCallback, useState } from "react";
import {
  createProposal,
  updateProposalStatus,
} from "@/services/proposalService";

import type {
  CreateProposalInput,
  CreateProposalResponse,
} from "@/services/proposalService";
import type { ProposalStatus } from "@/lib/vetra/types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error";
}

// ---- crear proposal ----

export interface UseCreateProposalResult {
  mutate: (input: CreateProposalInput) => Promise<CreateProposalResponse>;
  loading: boolean;
  error: string | null;
  lastResult: CreateProposalResponse | null;
}

export function useCreateProposal(): UseCreateProposalResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CreateProposalResponse | null>(
    null,
  );

  const mutate = useCallback(
    async (input: CreateProposalInput): Promise<CreateProposalResponse> => {
      try {
        setLoading(true);
        setError(null);
        const res = await createProposal(input);
        setLastResult(res);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useCreateProposal error:", err);
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

// ---- update proposal status ----

export interface UseUpdateProposalStatusResult {
  mutate: (
    proposalId: string,
    status: ProposalStatus,
    closedAt?: string,
  ) => Promise<{ proposalId: string; status: string }>;
  loading: boolean;
  error: string | null;
}

export function useUpdateProposalStatus(): UseUpdateProposalStatusResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      proposalId: string,
      status: ProposalStatus,
      closedAt?: string,
    ): Promise<{ proposalId: string; status: string }> => {
      try {
        setLoading(true);
        setError(null);
        const res = await updateProposalStatus(proposalId, status, closedAt);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useUpdateProposalStatus error:", err);
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

// Note: Proposals are fetched as part of the DAO board via useDaoBoard hook.
// No separate hooks for listing/querying proposals are needed.
