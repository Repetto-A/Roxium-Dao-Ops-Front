// lib/vetra/types.ts
// Clean frontend domain types for Vetra integration

// ---------- Shared Enums ----------

export type ProposalStatus = "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type MembershipRole = "OWNER" | "CONTRIBUTOR" | "VIEWER";

// ---------- DAO ----------

export interface DaoMember {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
}

export interface Dao {
  id: string;
  name: string;
  description: string | null;
  ownerUserId: string | null;
  members: DaoMember[];
  createdAt: string;
}

// ---------- Proposal ----------

export interface Proposal {
  id: string;
  daoId: string;
  title: string;
  description: string | null;
  status: ProposalStatus;
  budget: number | null;
  deadline: string | null;
  createdBy: string | null;
  createdAt: string;
}

// ---------- Task ----------

export interface Task {
  id: string;
  daoId: string;
  proposalId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  budget: number | null;
  deadline: string | null;
  assignee: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// ---------- API Response Shapes ----------

export interface DaoListResponse {
  count: number;
  daos: Dao[];
}

export interface DaoDetailResponse {
  daoId: string;
  dao: Dao | null;
  members: DaoMember[];
}

export interface DaoBoardResponse {
  daoId: string;
  dao: Dao | null;
  proposals: Proposal[];
  tasks: Task[];
}

export interface CreateDaoInput {
  name: string;
  description?: string;
}

export interface CreateDaoResponse {
  daoId: string;
}

export interface CreateProposalInput {
  daoId: string;
  title: string;
  description?: string;
  budget?: number;
  deadline?: string;
  status?: ProposalStatus;
}

export interface CreateProposalResponse {
  proposalId: string;
}

export interface CreateTaskInput {
  daoId: string;
  proposalId: string;
  title: string;
  description?: string;
  budget?: number;
  deadline?: string;
  status?: TaskStatus;
}

export interface CreateTaskResponse {
  taskId: string;
}

export interface ProposalListResponse {
  count: number;
  proposals: Proposal[];
}

export interface TaskListResponse {
  count: number;
  tasks: Task[];
}
