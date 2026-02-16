// services/daoService.ts
import { apiClient } from "./apiClient";
import type { Dao, Proposal, Task } from "@/lib/vetra/types";

// ---- API Response Types ----

export interface DaoListResponse {
  daos: Dao[];
}

export interface DaoDetailResponse {
  dao: Dao;
}

export interface DaoBoardResponse {
  dao: Dao;
  proposals: Proposal[];
  tasks: Task[];
}

// ---- Create DAO Input & Response ----

export interface CreateDaoInput {
  name: string;
  description?: string;
}

export interface CreateDaoResponse {
  daoId: string; // Document ID of the newly created DAO
}

// ---- Service Functions ----

// GET /api/vetra/daos → List all DAOs
export async function getAllDaos(): Promise<DaoListResponse> {
  return apiClient.get<DaoListResponse>("/api/vetra/daos");
}

// GET /api/vetra/daos/:daoId → Get DAO details
export async function getDao(daoId: string): Promise<DaoDetailResponse> {
  return apiClient.get<DaoDetailResponse>(`/api/vetra/daos/${daoId}`);
}

// GET /api/vetra/daos/:daoId/board → Get DAO board (DAO + proposals + tasks)
export async function getDaoBoard(daoId: string): Promise<DaoBoardResponse> {
  return apiClient.get<DaoBoardResponse>(`/api/vetra/daos/${daoId}/board`);
}

// POST /api/vetra/daos → Create new DAO
export async function createDao(
  input: CreateDaoInput
): Promise<CreateDaoResponse> {
  return apiClient.post<CreateDaoResponse>("/api/vetra/daos", input);
}

// ---- Update DAO ----

export interface UpdateDaoInput {
  name?: string;
  description?: string;
}

export interface UpdateDaoResponse {
  daoId: string;
}

// PATCH /api/vetra/daos/:daoId → Update DAO details
export async function updateDao(
  daoId: string,
  input: UpdateDaoInput
): Promise<UpdateDaoResponse> {
  return apiClient.patch<UpdateDaoResponse>(`/api/vetra/daos/${daoId}`, input);
}

// ---- Delete DAO ----

export interface DeleteDaoResponse {
  deleted: boolean;
  deletedProposals: number;
  deletedTasks: number;
}

// DELETE /api/vetra/daos/:daoId → Cascade delete DAO + proposals + tasks
export async function deleteDao(daoId: string): Promise<DeleteDaoResponse> {
  return apiClient.del<DeleteDaoResponse>(`/api/vetra/daos/${daoId}`);
}

// ---- Re-exports for backward compatibility ----
// Export types from @/lib/vetra/types for components that still import from here
export type { Dao, DaoMember, Proposal, Task } from "@/lib/vetra/types";
export type { ProposalStatus, TaskStatus } from "@/lib/vetra/types";
