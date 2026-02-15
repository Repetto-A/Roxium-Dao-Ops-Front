// app/api/vetra/proposals/[proposalId]/route.ts
// API route for updating and deleting a single proposal

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { mapProposal, type VetraDocument, type ProposalState } from "@/lib/vetra/mappers";
import { GET_PROPOSAL, SET_PROPOSAL_DETAILS, UPDATE_PROPOSAL_STATUS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface GetProposalResponse {
  Proposal: {
    getDocument: VetraDocument<ProposalState>;
  };
}

interface SetProposalDetailsResponse {
  Proposal_setProposalDetails: number;
}

interface UpdateProposalStatusResponse {
  Proposal_updateProposalStatus: number;
}

// PATCH /api/vetra/proposals/[proposalId] - Update proposal details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  try {
    const { proposalId } = await params;
    const body = await request.json();
    const { title, description, budget, deadline } = body;

    // Fetch current proposal to merge with partial update
    const currentData = await gql<GetProposalResponse>(
      GET_PROPOSAL,
      { docId: proposalId },
      "/graphql/proposal"
    );
    const current = mapProposal(currentData.Proposal.getDocument);

    await gql<SetProposalDetailsResponse>(
      SET_PROPOSAL_DETAILS,
      {
        docId: proposalId,
        driveId: DRIVE_ID,
        input: {
          daoId: current.daoId,
          title: title !== undefined ? title : current.title,
          description: description !== undefined ? description : (current.description || undefined),
          budget: budget !== undefined ? budget : (current.budget || undefined),
          deadline: deadline !== undefined ? deadline : (current.deadline || undefined),
          createdBy: current.createdBy || "system",
          createdAt: current.createdAt || new Date().toISOString(),
        },
      },
      "/graphql/proposal"
    );

    return NextResponse.json({ proposalId });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/proposals/${resolvedParams.proposalId} PATCH]`, error);
    const message = error instanceof Error ? error.message : "Failed to update proposal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/vetra/proposals/[proposalId] - Delete proposal (soft-delete via ARCHIVED status)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  try {
    const { proposalId } = await params;

    // Set proposal status to ARCHIVED (soft delete)
    await gql<UpdateProposalStatusResponse>(
      UPDATE_PROPOSAL_STATUS,
      {
        docId: proposalId,
        driveId: DRIVE_ID,
        input: {
          status: "ARCHIVED"
        }
      },
      "/graphql/proposal"
    );

    return NextResponse.json({ deleted: true });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`[API /vetra/proposals/${resolvedParams.proposalId} DELETE]`, error);
    const message = error instanceof Error ? error.message : "Failed to delete proposal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
