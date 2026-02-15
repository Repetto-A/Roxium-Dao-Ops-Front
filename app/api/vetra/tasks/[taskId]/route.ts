// app/api/vetra/tasks/[taskId]/route.ts
// API route for updating and deleting a single task

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { mapTask, type VetraDocument, type TaskState } from "@/lib/vetra/mappers";
import { GET_TASK, SET_TASK_DETAILS, UPDATE_TASK_STATUS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface GetTaskResponse {
  Task: {
    getDocument: VetraDocument<TaskState>;
  };
}

interface SetTaskDetailsResponse {
  Task_setTaskDetails: number;
}

interface UpdateTaskStatusResponse {
  Task_updateTaskStatus: number;
}

// PATCH /api/vetra/tasks/[taskId] - Update task details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { title, description, budget, deadline } = body;

    // Fetch current task to merge with partial update
    const currentData = await gql<GetTaskResponse>(
      GET_TASK,
      { docId: taskId },
      "/graphql/task"
    );
    const current = mapTask(currentData.Task.getDocument);

    await gql<SetTaskDetailsResponse>(
      SET_TASK_DETAILS,
      {
        docId: taskId,
        driveId: DRIVE_ID,
        input: {
          daoId: current.daoId,
          proposalId: current.proposalId || undefined,
          title: title !== undefined ? title : current.title,
          description: description !== undefined ? description : (current.description || undefined),
          budget: budget !== undefined ? budget : (current.budget || undefined),
          deadline: deadline !== undefined ? deadline : (current.deadline || undefined),
          assignee: current.assignee || undefined,
          createdBy: current.createdBy || "system",
          createdAt: current.createdAt || new Date().toISOString(),
        },
      },
      "/graphql/task"
    );

    return NextResponse.json({ taskId });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/tasks/${resolvedParams.taskId} PATCH]`, error);
    const message = error instanceof Error ? error.message : "Failed to update task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/vetra/tasks/[taskId] - Delete task (soft-delete via ARCHIVED status)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    // Set task status to ARCHIVED (soft delete)
    await gql<UpdateTaskStatusResponse>(
      UPDATE_TASK_STATUS,
      {
        docId: taskId,
        driveId: DRIVE_ID,
        input: {
          status: "ARCHIVED"
        }
      },
      "/graphql/task"
    );

    return NextResponse.json({ deleted: true });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/tasks/${resolvedParams.taskId} DELETE]`, error);
    const message = error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
