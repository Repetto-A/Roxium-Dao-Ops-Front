// app/api/vetra/daos/route.ts
// API route for listing and creating DAOs

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { mapDao, type VetraDocument, type DaoState } from "@/lib/vetra/mappers";
import { GET_DAOS, CREATE_DAO, SET_DAO_NAME, SET_DAO_DESCRIPTION } from "@/lib/vetra/queries";

const DRIVE_ID = process.env.VETRA_DRIVE_ID ?? "preview-81d3e4ae";

interface GetDaosResponse {
  Dao: {
    getDocuments: VetraDocument<DaoState>[];
  };
}

interface CreateDaoResponse {
  Dao_createDocument: string; // returns document ID
}

interface SetDaoNameResponse {
  Dao_setDaoName: number; // returns operation index
}

interface SetDaoDescriptionResponse {
  Dao_setDaoDescription: number; // returns operation index
}

// GET /api/vetra/daos - List all DAOs
export async function GET() {
  try {
    const data = await gql<GetDaosResponse>(
      GET_DAOS,
      { driveId: DRIVE_ID },
      "/graphql/dao"
    );

    const daos = data.Dao.getDocuments.map(mapDao);
    return NextResponse.json({ daos });
  } catch (error) {
    console.error("[API /vetra/daos GET]", error);
    const message = error instanceof Error ? error.message : "Failed to fetch DAOs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/vetra/daos - Create a new DAO
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Step 1: Create empty document
    const createData = await gql<CreateDaoResponse>(
      CREATE_DAO,
      { name, driveId: DRIVE_ID },
      "/graphql/dao"
    );

    const daoId = createData.Dao_createDocument;

    // Step 2: Set DAO name in state (if provided)
    if (name) {
      await gql<SetDaoNameResponse>(
        SET_DAO_NAME,
        { docId: daoId, driveId: DRIVE_ID, input: { name } },
        "/graphql/dao"
      );
    }

    // Step 3: Set DAO description (if provided)
    if (description) {
      await gql<SetDaoDescriptionResponse>(
        SET_DAO_DESCRIPTION,
        { docId: daoId, driveId: DRIVE_ID, input: { description } },
        "/graphql/dao"
      );
    }

    return NextResponse.json({ daoId }, { status: 201 });
  } catch (error) {
    console.error("[API /vetra/daos POST]", error);
    const message = error instanceof Error ? error.message : "Failed to create DAO";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
