// app/api/vetra/daos/[daoId]/route.ts
// API route for getting, updating, and deleting a single DAO

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { mapDao, mapProposal, mapTask, type VetraDocument, type DaoState, type ProposalState, type TaskState } from "@/lib/vetra/mappers";
import { GET_DAO, SET_DAO_NAME, SET_DAO_DESCRIPTION, GET_PROPOSALS, GET_TASKS, UPDATE_PROPOSAL_STATUS, UPDATE_TASK_STATUS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";
const ARCHIVED_PREFIX = "[ARCHIVED] ";

interface GetDaoResponse {
  Dao: {
    getDocument: VetraDocument<DaoState>;
  };
}

interface SetDaoNameResponse {
  Dao_setDaoName: number;
}

interface SetDaoDescriptionResponse {
  Dao_setDaoDescription: number;
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

interface UpdateProposalStatusResponse {
  Proposal_updateProposalStatus: number;
}

interface UpdateTaskStatusResponse {
  Task_updateTaskStatus: number;
}

// GET /api/vetra/daos/[daoId] - Get DAO details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ daoId: string }> }
) {
  try {
    const { daoId } = await params;

    const data = await gql<GetDaoResponse>(
      GET_DAO,
      { docId: daoId },
      "/graphql/dao"
    );

    const dao = mapDao(data.Dao.getDocument);
    return NextResponse.json({ dao });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/daos/${resolvedParams.daoId} GET]`, error);
    const message = error instanceof Error ? error.message : "Failed to fetch DAO";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/vetra/daos/[daoId] - Update DAO name and/or description
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ daoId: string }> }
) {
  try {
    const { daoId } = await params;
    const body = await request.json();
    const { name, description } = body;

    if (name !== undefined) {
      await gql<SetDaoNameResponse>(
        SET_DAO_NAME,
        { docId: daoId, driveId: DRIVE_ID, input: { name } },
        "/graphql/dao"
      );
    }

    if (description !== undefined) {
      await gql<SetDaoDescriptionResponse>(
        SET_DAO_DESCRIPTION,
        { docId: daoId, driveId: DRIVE_ID, input: { description } },
        "/graphql/dao"
      );
    }

    return NextResponse.json({ daoId });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/daos/${resolvedParams.daoId} PATCH]`, error);
    const message = error instanceof Error ? error.message : "Failed to update DAO";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/vetra/daos/[daoId] - Cascade archive DAO + all proposals + tasks
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ daoId: string }> }
) {
  try {
    const { daoId } = await params;

    // Fetch DAO details and all proposals and tasks for this DAO
    const [daoData, proposalsData, tasksData] = await Promise.all([
      gql<GetDaoResponse>(GET_DAO, { docId: daoId }, "/graphql/dao"),
      gql<GetProposalsResponse>(GET_PROPOSALS, { driveId: DRIVE_ID }, "/graphql/proposal"),
      gql<GetTasksResponse>(GET_TASKS, { driveId: DRIVE_ID }, "/graphql/task"),
    ]);

    const dao = mapDao(daoData.Dao.getDocument);
    const proposals = proposalsData.Proposal.getDocuments
      .map(mapProposal)
      .filter(p => p.daoId === daoId);
    const tasks = tasksData.Task.getDocuments
      .map(mapTask)
      .filter(t => t.daoId === daoId);

    // Archive all tasks first (soft-delete)
    for (const task of tasks) {
      await gql<UpdateTaskStatusResponse>(
        UPDATE_TASK_STATUS,
        {
          docId: task.id,
          driveId: DRIVE_ID,
          input: {
            status: "ARCHIVED"
          }
        },
        "/graphql/task"
      );
    }

    // Archive all proposals (soft-delete)
    for (const proposal of proposals) {
      await gql<UpdateProposalStatusResponse>(
        UPDATE_PROPOSAL_STATUS,
        {
          docId: proposal.id,
          driveId: DRIVE_ID,
          input: {
            status: "ARCHIVED"
          }
        },
        "/graphql/proposal"
      );
    }

    // Archive the DAO itself (soft-delete by prefixing name)
    const archivedName = dao.name.startsWith(ARCHIVED_PREFIX)
      ? dao.name
      : `${ARCHIVED_PREFIX}${dao.name}`;

    await gql<SetDaoNameResponse>(
      SET_DAO_NAME,
      {
        docId: daoId,
        driveId: DRIVE_ID,
        input: { name: archivedName }
      },
      "/graphql/dao"
    );

    return NextResponse.json({
      deleted: true,
      archivedTasks: tasks.length,
      archivedProposals: proposals.length,
    });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/daos/${resolvedParams.daoId} DELETE]`, error);
    const message = error instanceof Error ? error.message : "Failed to archive DAO";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
