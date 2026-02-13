// app/api/vetra/tasks/route.ts
// API route for creating tasks

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { CREATE_TASK, SET_TASK_DETAILS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface CreateTaskResponse {
  Task_createDocument: string; // returns document ID
}

interface SetTaskDetailsResponse {
  Task_setTaskDetails: number; // returns operation index
}

// POST /api/vetra/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      proposalId,
      daoId,
      title,
      description,
      assignee,
      deadline,
      budget,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!proposalId) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 });
    }

    if (!daoId) {
      return NextResponse.json({ error: "DAO ID is required" }, { status: 400 });
    }

    // Step 1: Create empty task document
    const createData = await gql<CreateTaskResponse>(
      CREATE_TASK,
      { name: title, driveId: DRIVE_ID },
      "/graphql/task"
    );

    const taskId = createData.Task_createDocument;

    // Step 2: Set task details
    await gql<SetTaskDetailsResponse>(
      SET_TASK_DETAILS,
      {
        docId: taskId,
        driveId: DRIVE_ID,
        input: {
          title,
          description,
          assignee,
          proposalId,
          daoId,
          deadline,
          budget: budget || undefined,
          createdAt: new Date().toISOString(),
          createdBy: "anonymous", // TODO: Replace with actual user ID when auth is implemented
        },
      },
      "/graphql/task"
    );

    return NextResponse.json({ taskId }, { status: 201 });
  } catch (error) {
    console.error("[API /vetra/tasks POST]", error);
    const message = error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
