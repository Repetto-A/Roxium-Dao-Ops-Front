// hooks/useDaos.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createDao,
  updateDao,
  deleteDao,
  getAllDaos,
  getDao,
  getDaoBoard,
} from "@/services/daoService";

import type {
  CreateDaoInput,
  CreateDaoResponse,
  UpdateDaoInput,
  UpdateDaoResponse,
  DeleteDaoResponse,
  DaoBoardResponse,
  DaoDetailResponse,
  DaoListResponse,
  Dao,
  Proposal,
  Task,
} from "@/services/daoService";

// Helper para mensajes de error sin usar `any`
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error";
}

// ---- listar TODOS los DAOs ----

export interface UseDaosResult {
  data: DaoListResponse | null;
  daos: Dao[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDaos(): UseDaosResult {
  const [data, setData] = useState<DaoListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDaos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllDaos();
      setData(res);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("useDaos error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDaos();
  }, [fetchDaos]);

  return {
    data,
    daos: data?.daos ?? [],
    loading,
    error,
    refetch: fetchDaos,
  };
}

// ---- detalle de un DAO (memberships now in dao.members) ----

export interface UseDaoDetailResult {
  data: DaoDetailResponse | null;
  dao: Dao | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDaoDetail(daoKey: string | null): UseDaoDetailResult {
  const [data, setData] = useState<DaoDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(daoKey));
  const [error, setError] = useState<string | null>(null);

  const fetchDao = useCallback(async () => {
    if (!daoKey) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getDao(daoKey);
      setData(res);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("useDaoDetail error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [daoKey]);

  useEffect(() => {
    if (!daoKey) return;
    void fetchDao();
  }, [daoKey, fetchDao]);

  return {
    data,
    dao: data?.dao ?? null,
    loading,
    error,
    refetch: fetchDao,
  };
}

// ---- board de un DAO (dao + proposals + tasks) ----

export interface UseDaoBoardResult {
  data: DaoBoardResponse | null;
  dao: Dao | null;
  proposals: Proposal[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDaoBoard(daoKey: string | null): UseDaoBoardResult {
  const [data, setData] = useState<DaoBoardResponse | null>(null);
  const [dao, setDao] = useState<Dao | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(daoKey));
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!daoKey) return;

    try {
      setLoading(true);
      setError(null);

      const res = await getDaoBoard(daoKey);
      setData(res);
      setDao(res.dao ?? null);
      setProposals(res.proposals ?? []);
      setTasks(res.tasks ?? []);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("useDaoBoard error:", err);
      setError(message);

      setData(null);
      setDao(null);
      setProposals([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [daoKey]);

  useEffect(() => {
    if (!daoKey) return;
    void fetchBoard();
  }, [daoKey, fetchBoard]);

  return {
    data,
    dao,
    proposals,
    tasks,
    loading,
    error,
    refetch: fetchBoard,
  };
}

// ---- crear DAO ----

export interface UseCreateDaoResult {
  mutate: (input: CreateDaoInput) => Promise<CreateDaoResponse>;
  loading: boolean;
  error: string | null;
  lastResult: CreateDaoResponse | null;
}

export function useCreateDao(): UseCreateDaoResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CreateDaoResponse | null>(null);

  const mutate = useCallback(
    async (input: CreateDaoInput): Promise<CreateDaoResponse> => {
      try {
        setLoading(true);
        setError(null);
        const res = await createDao(input);
        setLastResult(res);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useCreateDao error:", err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    mutate,
    loading,
    error,
    lastResult,
  };
}

// ---- actualizar DAO ----

export interface UseUpdateDaoResult {
  mutate: (daoId: string, input: UpdateDaoInput) => Promise<UpdateDaoResponse>;
  loading: boolean;
  error: string | null;
}

export function useUpdateDao(): UseUpdateDaoResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (daoId: string, input: UpdateDaoInput): Promise<UpdateDaoResponse> => {
      try {
        setLoading(true);
        setError(null);
        const res = await updateDao(daoId, input);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useUpdateDao error:", err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
}

// ---- eliminar DAO (cascade) ----

export interface UseDeleteDaoResult {
  mutate: (daoId: string) => Promise<DeleteDaoResponse>;
  loading: boolean;
  error: string | null;
}

export function useDeleteDao(): UseDeleteDaoResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (daoId: string): Promise<DeleteDaoResponse> => {
      try {
        setLoading(true);
        setError(null);
        const res = await deleteDao(daoId);
        return res;
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("useDeleteDao error:", err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
}
