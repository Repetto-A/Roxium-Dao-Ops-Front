// app/api/vetra/tasks/[taskId]/status/route.ts
import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { UPDATE_TASK_STATUS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface UpdateTaskStatusResponse {
  Task_updateTaskStatus: number;
}

// PATCH /api/vetra/tasks/[taskId]/status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    await gql<UpdateTaskStatusResponse>(
      UPDATE_TASK_STATUS,
      {
        docId: taskId,
        driveId: DRIVE_ID,
        input: {
          status,
          updatedAt: new Date().toISOString(),
        },
      },
      "/graphql/task",
    );

    return NextResponse.json({ taskId, status });
  } catch (error) {
    console.error("[API /vetra/tasks/[taskId]/status PATCH]", error);
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
