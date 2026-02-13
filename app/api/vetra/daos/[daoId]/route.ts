// app/api/vetra/daos/[daoId]/route.ts
// API route for getting a single DAO

import { NextResponse } from "next/server";
import { gql } from "@/lib/vetra/graphql-client";
import { mapDao, type VetraDocument, type DaoState } from "@/lib/vetra/mappers";
import { GET_DAO } from "@/lib/vetra/queries";

interface GetDaoResponse {
  Dao: {
    getDocument: VetraDocument<DaoState>;
  };
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
