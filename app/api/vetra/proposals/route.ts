// app/api/vetra/proposals/route.ts
// API route for creating proposals

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { CREATE_PROPOSAL, SET_PROPOSAL_DETAILS } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface CreateProposalResponse {
  Proposal_createDocument: string; // returns document ID
}

interface SetProposalDetailsResponse {
  Proposal_setProposalDetails: number; // returns operation index
}

// POST /api/vetra/proposals - Create a new proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { daoId, title, description, budget, deadline } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!daoId) {
      return NextResponse.json({ error: "DAO ID is required" }, { status: 400 });
    }

    // Step 1: Create empty proposal document
    const createData = await gql<CreateProposalResponse>(
      CREATE_PROPOSAL,
      { name: title, driveId: DRIVE_ID },
      "/graphql/proposal"
    );

    const proposalId = createData.Proposal_createDocument;

    // Step 2: Set proposal details
    await gql<SetProposalDetailsResponse>(
      SET_PROPOSAL_DETAILS,
      {
        docId: proposalId,
        driveId: DRIVE_ID,
        input: {
          title,
          description: description || "",
          daoId,
          budget: budget || undefined,
          deadline: deadline || undefined,
          createdAt: new Date().toISOString(),
          createdBy: "anonymous", // TODO: Replace with actual user ID when auth is implemented
        },
      },
      "/graphql/proposal"
    );

    return NextResponse.json({ proposalId }, { status: 201 });
  } catch (error) {
    console.error("[API /vetra/proposals POST]", error);
    const message = error instanceof Error ? error.message : "Failed to create proposal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
