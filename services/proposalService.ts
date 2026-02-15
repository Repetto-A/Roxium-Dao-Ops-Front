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

// ---- Update Proposal ----

export interface UpdateProposalInput {
  title?: string;
  description?: string;
  budget?: number | null;
  deadline?: string | null;
}

export interface UpdateProposalResponse {
  proposalId: string;
}

// PATCH /api/vetra/proposals/[proposalId] → Update proposal details
export async function updateProposal(
  proposalId: string,
  input: UpdateProposalInput
): Promise<UpdateProposalResponse> {
  return apiClient.patch<UpdateProposalResponse>(
    `/api/vetra/proposals/${proposalId}`,
    input
  );
}

// ---- Delete Proposal ----

export interface DeleteProposalResponse {
  deleted: boolean;
}

// DELETE /api/vetra/proposals/[proposalId] → Delete proposal
export async function deleteProposal(
  proposalId: string
): Promise<DeleteProposalResponse> {
  return apiClient.del<DeleteProposalResponse>(
    `/api/vetra/proposals/${proposalId}`
  );
}

// ---- Re-exports for backward compatibility ----
export type { Proposal, ProposalStatus } from "@/lib/vetra/types";
