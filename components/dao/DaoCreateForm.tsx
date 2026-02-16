"use client";

import { FormEvent, useState } from "react";
import { useCreateDao } from "@/hooks/useDaos";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface DaoCreateFormProps {
  onCreated?: () => void | Promise<void>;
}

export function DaoCreateForm({ onCreated }: DaoCreateFormProps) {
  const { mutate: createDao, loading, error } = useCreateDao();
  const { toast } = useToast();

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await createDao({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      toast({
        title: "DAO created",
        description: `"${name.trim()}" has been created successfully.`,
        variant: "success",
      });

      setName("");
      setDescription("");
      setOpen(false);

      if (onCreated) {
        const maybePromise = onCreated();
        if (maybePromise instanceof Promise) {
          await maybePromise;
        }
      }
    } catch (err) {
      // Error is already handled by the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Create DAO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New DAO</DialogTitle>
          <DialogDescription>
            Define the space where proposals and operational tasks will be
            grouped.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="dao-name" className="text-sm font-semibold text-foreground">
              DAO name
            </label>
            <Input
              id="dao-name"
              placeholder="E.g.: Roxium Core Contributors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dao-description" className="text-sm font-semibold text-foreground">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="dao-description"
              rows={3}
              placeholder="What is the purpose of this DAO? What decisions are made here?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">Error creating DAO: {error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
            >
              {loading ? "Creating DAO..." : "Create DAO"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
