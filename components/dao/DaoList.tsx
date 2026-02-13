// components/dao/DaoList.tsx
"use client";

import Link from "next/link";
import type { Dao } from "@/lib/vetra/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { truncateId, formatDate } from "@/lib/format";

export interface DaoListProps {
  daos: Dao[];
  loading: boolean;
  error: string | null;
  onReload?: () => void | Promise<void>;
}

export function DaoList({ daos, loading, error, onReload }: DaoListProps) {
  return (
    <Card className="border-white/10 bg-black/40">
      <CardHeader>
        <CardTitle className="text-base">
          DAOs{!loading && ` (${daos.length})`}
        </CardTitle>
        <CardDescription className="text-xs">
          DAOs stored in Vetra document drive.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-md border border-slate-800/80 bg-black/60 p-3"
              >
                <Skeleton className="mb-2 h-4 w-2/3" />
                <Skeleton className="mb-1 h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400">Error loading DAOs: {error}</p>
        )}

        {!loading && !error && daos.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Building2 className="size-8 text-slate-600" />
            <p className="text-sm text-slate-400">No DAOs yet</p>
            <p className="text-xs text-slate-500">
              Create your first DAO using the form to get started.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {daos.map((dao) => (
            <div
              key={dao.id}
              className="rounded-md border border-slate-800/80 bg-black/60 p-3 text-xs sm:text-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">
                      {dao.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/60 text-[10px] uppercase tracking-[0.16em] text-emerald-300"
                    >
                      DAO
                    </Badge>
                  </div>

                  {dao.description && (
                    <p className="text-xs text-slate-400">
                      {dao.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    {dao.ownerUserId && (
                      <span className="font-mono text-xs text-emerald-300/80">
                        {truncateId(dao.ownerUserId)}
                      </span>
                    )}
                    {dao.members.length > 0 && (
                      <span className="text-xs text-slate-500">
                        {dao.members.length}{" "}
                        {dao.members.length === 1 ? "member" : "members"}
                      </span>
                    )}
                    {dao.createdAt && (
                      <span className="text-xs text-slate-500">
                        {formatDate(dao.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/daos/${dao.id}`}>View board</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
