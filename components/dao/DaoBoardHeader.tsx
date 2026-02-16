"use client";

import { useState } from "react";
import type { Dao } from "@/lib/vetra/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pencil, X, Check } from "lucide-react";
import { truncateId, formatDate } from "@/lib/format";

export interface DaoBoardHeaderProps {
  dao: Dao | null;
  onUpdate?: (daoId: string, input: { name?: string; description?: string }) => Promise<void>;
  onDelete?: (daoId: string) => Promise<void>;
}

export function DaoBoardHeader({ dao, onUpdate, onDelete }: DaoBoardHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!dao) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>DAO not found</CardTitle>
          <CardDescription>
            We couldn&apos;t load this DAO&apos;s data from Vetra.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function startEdit() {
    if (!dao) return;
    setEditing(true);
    setEditName(dao.name);
    setEditDescription(dao.description ?? "");
  }

  function cancelEdit() {
    setEditing(false);
    setEditName("");
    setEditDescription("");
  }

  async function saveEdit() {
    if (!onUpdate || !dao || !editName.trim()) return;
    setSaving(true);
    try {
      await onUpdate(dao.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!onDelete || !dao) return;
    setDeleting(true);
    try {
      await onDelete(dao.id);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {editing ? (
            <div className="flex-1 space-y-3">
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
              <div className="flex gap-2">
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
                  onClick={saveEdit}
                  disabled={saving || !editName.trim()}
                >
                  <Check className="mr-1 size-3.5" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3">
                  {dao.name}
                  <Badge variant="default">
                    DAO
                  </Badge>
                  {onUpdate && (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      aria-label="Edit DAO"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Delete DAO"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {dao.description ?? "DAO without description"}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:items-end">
                <span className="font-mono text-primary">
                  {truncateId(dao.id)}
                </span>
                {dao.createdAt && (
                  <span>{formatDate(dao.createdAt)}</span>
                )}
                {dao.ownerUserId && (
                  <span className="font-mono text-primary/80">
                    {truncateId(dao.ownerUserId)}
                  </span>
                )}
                {dao.members.length > 0 && (
                  <span className="font-medium">
                    {dao.members.length}{" "}
                    {dao.members.length === 1 ? "member" : "members"}
                  </span>
                )}
              </div>
            </>
          )}
        </CardHeader>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete DAO"
        description={`Are you sure you want to delete "${dao.name}"? This will also delete all its proposals and tasks. This action cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
