// lib/vetra/mappers.ts
// Convert Vetra auto-generated GraphQL responses into clean frontend types

import type {
  Dao,
  DaoMember,
  Proposal,
  ProposalStatus,
  Task,
  TaskStatus,
} from "./types";

// Raw document shape from Vetra auto-generated GraphQL API
export interface VetraDocument<TState> {
  id: string;
  name: string; // document header name
  documentType: string;
  createdAtUtcIso: string;
  lastModifiedAtUtcIso: string;
  revision: number;
  state: TState;
}

// State types from Vetra document models
export interface DaoState {
  name: string | null;
  description: string | null;
  ownerUserId: string | null;
  members: DaoMember[];
}

export interface ProposalState {
  title: string | null;
  description: string | null;
  status: string | null;
  createdBy: string | null;
  createdAt: string | null;
  daoId: string | null;
  budget: number | null;
  deadline: string | null;
  closedAt: string | null;
}

export interface TaskState {
  title: string | null;
  description: string | null;
  status: string | null;
  assignee: string | null;
  proposalId: string | null;
  daoId: string | null;
  deadline: string | null;
  budget: number | null;
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  documents: Array<{ id: string; kind: string; url: string }>;
}

export function mapDao(doc: VetraDocument<DaoState>): Dao {
  return {
    id: doc.id,
    name: doc.state.name || doc.name || "",
    description: doc.state.description || null,
    ownerUserId: doc.state.ownerUserId || null,
    members: doc.state.members || [],
    createdAt: doc.createdAtUtcIso,
  };
}

export function mapProposal(doc: VetraDocument<ProposalState>): Proposal {
  return {
    id: doc.id,
    daoId: doc.state.daoId || "",
    title: doc.state.title || doc.name || "",
    description: doc.state.description || null,
    status: (doc.state.status as ProposalStatus) || "DRAFT",
    budget: doc.state.budget || null,
    deadline: doc.state.deadline || null,
    createdBy: doc.state.createdBy || null,
    createdAt: doc.state.createdAt || doc.createdAtUtcIso,
  };
}

export function mapTask(doc: VetraDocument<TaskState>): Task {
  return {
    id: doc.id,
    daoId: doc.state.daoId || "",
    proposalId: doc.state.proposalId || "",
    title: doc.state.title || doc.name || "",
    description: doc.state.description || null,
    status: (doc.state.status as TaskStatus) || "TODO",
    budget: doc.state.budget || null,
    deadline: doc.state.deadline || null,
    assignee: doc.state.assignee || null,
    createdBy: doc.state.createdBy || null,
    createdAt: doc.state.createdAt || doc.createdAtUtcIso,
    updatedAt: doc.state.updatedAt || doc.lastModifiedAtUtcIso,
  };
}
