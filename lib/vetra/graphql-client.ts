// lib/vetra/graphql-client.ts
// Server-side only GraphQL client for Vetra reactor API

const VETRA_BASE_URL =
  process.env.BACKEND_URL ?? "http://localhost:4001";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  endpoint = "/d/graphql", // Default to supergraph, or use /graphql/dao, /graphql/proposal, /graphql/task
): Promise<T> {
  const url = `${VETRA_BASE_URL}${endpoint}`;

  console.log("[GraphQL] Request:", {
    BACKEND_URL: process.env.BACKEND_URL,
    VETRA_BASE_URL,
    endpoint,
    fullUrl: url,
  });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[GraphQL Error] ${endpoint}`, {
      status: res.status,
      statusText: res.statusText,
      query,
      variables,
      response: errorText,
    });
    throw new Error(
      `Vetra GraphQL request failed: ${res.status} ${res.statusText}`,
    );
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    const msg = json.errors.map((e) => e.message).join("; ");
    throw new Error(`Vetra GraphQL error: ${msg}`);
  }

  if (!json.data) {
    throw new Error("Vetra GraphQL returned no data");
  }

  return json.data;
}
