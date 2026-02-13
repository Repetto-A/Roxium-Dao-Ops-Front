// app/api/vetra/daos/[daoId]/board/route.ts
// API route for getting DAO board view (DAO + Proposals + Tasks)

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import {
  mapDao,
  mapProposal,
  mapTask,
  type VetraDocument,
  type DaoState,
  type ProposalState,
  type TaskState,
} from "@/lib/vetra/mappers";
import { GET_DAO, GET_PROPOSALS, GET_TASKS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface GetDaoResponse {
  Dao: {
    getDocument: VetraDocument<DaoState>;
  };
}

interface GetProposalsResponse {
  Proposal: {
    getDocuments: VetraDocument<ProposalState>[];
  };
}

interface GetTasksResponse {
  Task: {
    getDocuments: VetraDocument<TaskState>[];
  };
}

// GET /api/vetra/daos/[daoId]/board - Get DAO board (DAO + Proposals + Tasks)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ daoId: string }> }
) {
  try {
    const { daoId } = await params;

    // Fetch DAO, proposals, and tasks in parallel
    const [daoData, proposalsData, tasksData] = await Promise.all([
      gql<GetDaoResponse>(GET_DAO, { docId: daoId }, "/graphql/dao"),
      gql<GetProposalsResponse>(GET_PROPOSALS, { driveId: DRIVE_ID }, "/graphql/proposal"),
      gql<GetTasksResponse>(GET_TASKS, { driveId: DRIVE_ID }, "/graphql/task"),
    ]);

    const dao = mapDao(daoData.Dao.getDocument);

    // Filter proposals that belong to this DAO
    const allProposals = proposalsData.Proposal.getDocuments.map(mapProposal);
    const proposals = allProposals.filter(p => p.daoId === daoId);

    // Filter tasks that belong to this DAO
    const allTasks = tasksData.Task.getDocuments.map(mapTask);
    const tasks = allTasks.filter(t => t.daoId === daoId);

    return NextResponse.json({ dao, proposals, tasks });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/daos/${resolvedParams.daoId}/board GET]`, error);
    const message = error instanceof Error ? error.message : "Failed to fetch DAO board";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
