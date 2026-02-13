// app/api/vetra/proposals/[proposalId]/status/route.ts
import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { UPDATE_PROPOSAL_STATUS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface UpdateProposalStatusResponse {
  Proposal_updateProposalStatus: number;
}

// PATCH /api/vetra/proposals/[proposalId]/status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ proposalId: string }> },
) {
  try {
    const { proposalId } = await params;
    const body = await request.json();
    const { status, closedAt } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    await gql<UpdateProposalStatusResponse>(
      UPDATE_PROPOSAL_STATUS,
      {
        docId: proposalId,
        driveId: DRIVE_ID,
        input: {
          status,
          closedAt: closedAt || undefined,
        },
      },
      "/graphql/proposal",
    );

    return NextResponse.json({ proposalId, status });
  } catch (error) {
    console.error("[API /vetra/proposals/[proposalId]/status PATCH]", error);
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
