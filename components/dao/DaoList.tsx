"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dao, ProposalStatus } from "@/lib/vetra/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

type DaoMetrics = {
  active: number;
  proposals: number;
};

export interface DaoListProps {
  daos: Dao[];
  loading: boolean;
  error: string | null;
  onReload?: () => void | Promise<void>;
  onUpdate?: (daoId: string, input: { name?: string; description?: string }) => Promise<void>;
  onDelete?: (daoId: string) => Promise<void>;
}

function isActiveStatus(status: ProposalStatus): boolean {
  return status === "DRAFT" || status === "OPEN";
}

export function DaoList({ daos, loading, error }: DaoListProps) {
  const [metricsByDaoId, setMetricsByDaoId] = useState<Record<string, DaoMetrics>>({});

  useEffect(() => {
    let cancelled = false;

    async function fetchMetrics() {
      const entries = await Promise.all(
        daos.map(async (dao) => {
          try {
            const response = await fetch(`/api/vetra/daos/${dao.id}/board`, {
              cache: "no-store",
            });
            if (!response.ok) {
              return [dao.id, { active: 0, proposals: 0 }] as const;
            }

            const data = (await response.json()) as {
              proposals?: Array<{ status?: ProposalStatus }>;
            };

            const proposals = data.proposals ?? [];
            const active = proposals.filter((p) => p.status && isActiveStatus(p.status)).length;
            return [dao.id, { active, proposals: proposals.length }] as const;
          } catch {
            return [dao.id, { active: 0, proposals: 0 }] as const;
          }
        }),
      );

      if (cancelled) return;
      setMetricsByDaoId(Object.fromEntries(entries));
    }

    void fetchMetrics();

    return () => {
      cancelled = true;
    };
  }, [daos]);

  return (
    <div>
      <SectionHeader
        title="Existing DAOs"
        description={!loading ? `${daos.length} ${daos.length === 1 ? "DAO" : "DAOs"} stored in Vetra` : undefined}
        variant="list"
      />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4 px-4">
            <CardTitle className="text-lg font-semibold">All DAOs</CardTitle>
            <div className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground sm:flex">
              <span className="w-16 text-center">Active</span>
              <span className="w-20 text-center">Proposals</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-1">
          {loading && (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-5"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-md" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="hidden items-center gap-14 sm:flex">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">Error loading DAOs: {error}</p>
          )}

          {!loading && !error && daos.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/60 py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Building2 className="size-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">No DAOs yet</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Create your first DAO using the form to get started.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && daos.length > 0 && (
            <div className="divide-y divide-border/60 rounded-lg border border-border/60">
              {daos.map((dao) => {
                const metrics = metricsByDaoId[dao.id] ?? { active: 0, proposals: 0 };
                return (
                  <Link
                    key={dao.id}
                    href={`/daos/${dao.id}`}
                    className="group flex items-center justify-between gap-4 px-4 py-5 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-background text-sm font-semibold text-foreground">
                        {dao.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold text-foreground sm:text-xl">
                          {dao.name}
                        </p>
                        {dao.description && (
                          <p className="truncate text-sm text-muted-foreground">
                            {dao.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="hidden items-center gap-8 sm:flex">
                      <span className="w-16 text-center text-2xl font-bold text-emerald-500">
                        {metrics.active}
                      </span>
                      <span className="w-20 text-center text-2xl font-bold text-foreground">
                        {metrics.proposals}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
