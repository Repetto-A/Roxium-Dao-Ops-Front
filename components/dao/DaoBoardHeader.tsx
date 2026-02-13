"use client";

import type { Dao } from "@/lib/vetra/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { truncateId, formatDate } from "@/lib/format";

export interface DaoBoardHeaderProps {
  dao: Dao | null;
}

export function DaoBoardHeader({ dao }: DaoBoardHeaderProps) {
  if (!dao) {
    return (
      <Card className="border-white/10 bg-black/40">
        <CardHeader>
          <CardTitle className="text-base">DAO not found</CardTitle>
          <CardDescription className="text-xs">
            We couldn&apos;t load this DAO&apos;s data from Vetra.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-black/40">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-50">
            {dao.name}
            <Badge
              variant="outline"
              className="border-emerald-500/60 text-[10px] uppercase tracking-[0.16em] text-emerald-300"
            >
              DAO
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-slate-300">
            {dao.description ?? "DAO without description"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono text-emerald-300/80">
            {truncateId(dao.id)}
          </span>
          {dao.createdAt && (
            <span>{formatDate(dao.createdAt)}</span>
          )}
          {dao.ownerUserId && (
            <span className="font-mono text-emerald-300/80">
              {truncateId(dao.ownerUserId)}
            </span>
          )}
          {dao.members.length > 0 && (
            <span>
              {dao.members.length}{" "}
              {dao.members.length === 1 ? "member" : "members"}
            </span>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
