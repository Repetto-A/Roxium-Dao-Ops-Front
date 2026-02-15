// components/dao/DaoList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dao } from "@/lib/vetra/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Building2, Pencil, X, Check } from "lucide-react";
import { truncateId, formatDate } from "@/lib/format";
import { SectionHeader } from "@/components/common/SectionHeader";

export interface DaoListProps {
  daos: Dao[];
  loading: boolean;
  error: string | null;
  onReload?: () => void | Promise<void>;
  onUpdate?: (daoId: string, input: { name?: string; description?: string }) => Promise<void>;
  onDelete?: (daoId: string) => Promise<void>;
}

export function DaoList({ daos, loading, error, onReload, onUpdate, onDelete }: DaoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  function startEdit(dao: Dao) {
    setEditingId(dao.id);
    setEditName(dao.name);
    setEditDescription(dao.description ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  }

  async function saveEdit(daoId: string) {
    if (!onUpdate || !editName.trim()) return;
    setSaving(true);
    try {
      await onUpdate(daoId, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!onDelete || !deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  const deletingDao = daos.find((d) => d.id === deleteId);

  return (
    <div>
      <SectionHeader
        title="Existing DAOs"
        description={!loading ? `${daos.length} ${daos.length === 1 ? 'DAO' : 'DAOs'} stored in Vetra` : undefined}
        variant="list"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            All DAOs
          </CardTitle>
        </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-4"
              >
                <Skeleton className="mb-3 h-5 w-2/3" />
                <Skeleton className="mb-2 h-4 w-full" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
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
              <p className="text-sm text-muted-foreground max-w-sm">
                Create your first DAO using the form to get started.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {daos.map((dao) => {
            const isEditing = editingId === dao.id;

            return (
              <div
                key={dao.id}
                className="rounded-lg border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-md"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="DAO name"
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(dao.id)}
                        disabled={saving || !editName.trim()}
                      >
                        <Check className="mr-1 size-3.5" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground text-base">
                          {dao.name}
                        </span>
                        <Badge variant="default">
                          DAO
                        </Badge>
                        {onUpdate && (
                          <button
                            type="button"
                            onClick={() => startEdit(dao)}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            aria-label="Edit DAO"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteId(dao.id)}
                            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Delete DAO"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>

                      {dao.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {dao.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                        {dao.ownerUserId && (
                          <span className="font-mono text-primary/90">
                            {truncateId(dao.ownerUserId)}
                          </span>
                        )}
                        {dao.members.length > 0 && (
                          <span className="font-medium">
                            {dao.members.length}{" "}
                            {dao.members.length === 1 ? "member" : "members"}
                          </span>
                        )}
                        {dao.createdAt && (
                          <span>
                            {formatDate(dao.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start justify-end sm:pt-1">
                      <Button asChild variant="default" size="default">
                        <Link href={`/daos/${dao.id}`}>View board</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete DAO"
        description={
          deletingDao
            ? `Are you sure you want to delete "${deletingDao.name}"? This will also delete all its proposals and tasks. This action cannot be undone.`
            : "Are you sure you want to delete this DAO?"
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
