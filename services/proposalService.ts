// services/proposalService.ts
import { apiClient } from "./apiClient";

// ---- Create Proposal Input & Response ----

export interface CreateProposalInput {
  daoId: string;
  title: string;
  description?: string;
  budget?: number;
  deadline?: string; // ISO string
}

export interface CreateProposalResponse {
  proposalId: string; // Document ID of the newly created proposal
}

// ---- Service Functions ----

// POST /api/vetra/proposals → Create new proposal
export async function createProposal(
  input: CreateProposalInput
): Promise<CreateProposalResponse> {
  return apiClient.post<CreateProposalResponse>("/api/vetra/proposals", input);
}

// POST /api/vetra/proposals/[proposalId]/status → Update proposal status
export async function updateProposalStatus(
  proposalId: string,
  status: string,
  closedAt?: string,
): Promise<{ proposalId: string; status: string }> {
  return apiClient.patch(`/api/vetra/proposals/${proposalId}/status`, {
    status,
    closedAt,
  });
}

// ---- Re-exports for backward compatibility ----
export type { Proposal, ProposalStatus } from "@/lib/vetra/types";
