// services/apiClient.ts

// Default to empty string for same-origin Next.js API routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface ApiErrorResponse {
  error?: string;
  details?: unknown;
}

// Helper para parsear el body de error de forma segura
async function parseErrorResponse(
  res: Response
): Promise<ApiErrorResponse | null> {
  try {
    const data = (await res.json()) as unknown;

    if (
      typeof data === "object" &&
      data !== null &&
      ("error" in data || "details" in data)
    ) {
      const maybeError = data as {
        error?: unknown;
        details?: unknown;
      };

      return {
        error:
          typeof maybeError.error === "string" ? maybeError.error : undefined,
        details: maybeError.details,
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorBody = await parseErrorResponse(res);
    console.error("GET error", path, errorBody);
    throw new Error(errorBody?.error ?? `GET ${path} failed`);
  }

  const data = (await res.json()) as T;
  return data;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await parseErrorResponse(res);
    console.error("POST error", path, errorBody);
    throw new Error(errorBody?.error ?? `POST ${path} failed`);
  }

  const data = (await res.json()) as T;
  return data;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await parseErrorResponse(res);
    console.error("PATCH error", path, errorBody);
    throw new Error(errorBody?.error ?? `PATCH ${path} failed`);
  }

  const data = (await res.json()) as T;
  return data;
}

export const apiClient = { get, post, patch };
