// app/api/vetra/tasks/[taskId]/assignee/route.ts
import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { ASSIGN_TASK } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface AssignTaskResponse {
  Task_assignTask: number;
}

// PATCH /api/vetra/tasks/[taskId]/assignee
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { assignee } = body;

    if (!assignee) {
      return NextResponse.json(
        { error: "Assignee is required" },
        { status: 400 },
      );
    }

    await gql<AssignTaskResponse>(
      ASSIGN_TASK,
      {
        docId: taskId,
        driveId: DRIVE_ID,
        input: {
          assignee,
          updatedAt: new Date().toISOString(),
        },
      },
      "/graphql/task",
    );

    return NextResponse.json({ taskId, assignee });
  } catch (error) {
    console.error("[API /vetra/tasks/[taskId]/assignee PATCH]", error);
    const message =
      error instanceof Error ? error.message : "Failed to assign task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
