// lib/vetra/queries.ts
// GraphQL queries and mutations for Vetra auto-generated subgraphs

// Common fields for all document types
const DOC_HEADER_FIELDS = `
  id
  name
  documentType
  createdAtUtcIso
  lastModifiedAtUtcIso
  revision
`;

// ========== DAO QUERIES & MUTATIONS ==========

export const DAO_STATE_FIELDS = `
  name
  description
  ownerUserId
  members {
    id
    name
    role
    joinedAt
  }
`;

export const GET_DAO = `
  query GetDao($docId: PHID!) {
    Dao {
      getDocument(docId: $docId) {
        ${DOC_HEADER_FIELDS}
        state {
          ${DAO_STATE_FIELDS}
        }
      }
    }
  }
`;

export const GET_DAOS = `
  query GetDaos($driveId: String!) {
    Dao {
      getDocuments(driveId: $driveId) {
        ${DOC_HEADER_FIELDS}
        state {
          ${DAO_STATE_FIELDS}
        }
      }
    }
  }
`;

export const CREATE_DAO = `
  mutation CreateDao($name: String!, $driveId: String) {
    Dao_createDocument(name: $name, driveId: $driveId)
  }
`;

export const SET_DAO_NAME = `
  mutation SetDaoName($docId: PHID, $driveId: String, $input: Dao_SetDaoNameInput!) {
    Dao_setDaoName(docId: $docId, driveId: $driveId, input: $input)
  }
`;

export const SET_DAO_DESCRIPTION = `
  mutation SetDaoDescription($docId: PHID, $driveId: String, $input: Dao_SetDaoDescriptionInput!) {
    Dao_setDaoDescription(docId: $docId, driveId: $driveId, input: $input)
  }
`;

export const SET_DAO_OWNER = `
  mutation SetDaoOwner($docId: PHID, $driveId: String, $input: Dao_SetDaoOwnerInput!) {
    Dao_setDaoOwner(docId: $docId, driveId: $driveId, input: $input)
  }
`;

// ========== PROPOSAL QUERIES & MUTATIONS ==========

export const PROPOSAL_STATE_FIELDS = `
  title
  description
  status
  createdBy
  createdAt
  daoId
  budget
  deadline
  closedAt
`;

export const GET_PROPOSAL = `
  query GetProposal($docId: PHID!) {
    Proposal {
      getDocument(docId: $docId) {
        ${DOC_HEADER_FIELDS}
        state {
          ${PROPOSAL_STATE_FIELDS}
        }
      }
    }
  }
`;

export const GET_PROPOSALS = `
  query GetProposals($driveId: String!) {
    Proposal {
      getDocuments(driveId: $driveId) {
        ${DOC_HEADER_FIELDS}
        state {
          ${PROPOSAL_STATE_FIELDS}
        }
      }
    }
  }
`;

export const CREATE_PROPOSAL = `
  mutation CreateProposal($name: String!, $driveId: String) {
    Proposal_createDocument(name: $name, driveId: $driveId)
  }
`;

export const SET_PROPOSAL_DETAILS = `
  mutation SetProposalDetails($docId: PHID, $driveId: String, $input: Proposal_SetProposalDetailsInput!) {
    Proposal_setProposalDetails(docId: $docId, driveId: $driveId, input: $input)
  }
`;

export const UPDATE_PROPOSAL_STATUS = `
  mutation UpdateProposalStatus($docId: PHID, $driveId: String, $input: Proposal_UpdateProposalStatusInput!) {
    Proposal_updateProposalStatus(docId: $docId, driveId: $driveId, input: $input)
  }
`;

// ========== TASK QUERIES & MUTATIONS ==========

export const TASK_STATE_FIELDS = `
  title
  description
  status
  assignee
  proposalId
  daoId
  deadline
  budget
  createdAt
  createdBy
  updatedAt
  documents {
    id
    kind
    url
  }
`;

export const GET_TASK = `
  query GetTask($docId: PHID!) {
    Task {
      getDocument(docId: $docId) {
        ${DOC_HEADER_FIELDS}
        state {
          ${TASK_STATE_FIELDS}
        }
      }
    }
  }
`;

export const GET_TASKS = `
  query GetTasks($driveId: String!) {
    Task {
      getDocuments(driveId: $driveId) {
        ${DOC_HEADER_FIELDS}
        state {
          ${TASK_STATE_FIELDS}
        }
      }
    }
  }
`;

export const CREATE_TASK = `
  mutation CreateTask($name: String!, $driveId: String) {
    Task_createDocument(name: $name, driveId: $driveId)
  }
`;

export const SET_TASK_DETAILS = `
  mutation SetTaskDetails($docId: PHID, $driveId: String, $input: Task_SetTaskDetailsInput!) {
    Task_setTaskDetails(docId: $docId, driveId: $driveId, input: $input)
  }
`;

export const UPDATE_TASK_STATUS = `
  mutation UpdateTaskStatus($docId: PHID, $driveId: String, $input: Task_UpdateTaskStatusInput!) {
    Task_updateTaskStatus(docId: $docId, driveId: $driveId, input: $input)
  }
`;

export const ASSIGN_TASK = `
  mutation AssignTask($docId: PHID, $driveId: String, $input: Task_AssignTaskInput!) {
    Task_assignTask(docId: $docId, driveId: $driveId, input: $input)
  }
`;

// ========== DRIVE OPERATIONS ==========

export const DELETE_DRIVE_NODE = `
  mutation DeleteDriveNode($driveId: String!, $input: DocumentDrive_DeleteNodeInput!) {
    DocumentDrive_deleteNode(driveId: $driveId, input: $input)
  }
`;

// ========== SYSTEM OPERATIONS ==========

export const DELETE_DOCUMENT = `
  mutation DeleteDocument($id: PHID!) {
    deleteDocument(id: $id)
  }
`;
