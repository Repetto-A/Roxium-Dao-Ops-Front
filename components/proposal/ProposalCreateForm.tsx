"use client";

import { FormEvent, useState } from "react";
import { useCreateProposal } from "@/hooks/useProposals";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export interface ProposalCreateFormProps {
  daoId: string;
  onCreated?: () => void | Promise<void>;
}

export function ProposalCreateForm({
  daoId,
  onCreated,
}: ProposalCreateFormProps) {
  const { mutate: createProposal, loading, error } = useCreateProposal();
  const { toast } = useToast();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;

    const budgetNum = budget.trim() ? parseFloat(budget) : undefined;
    const deadlineIso = deadline.trim()
      ? new Date(deadline).toISOString()
      : undefined;

    try {
      await createProposal({
        daoId,
        title: title.trim(),
        description: description.trim() || undefined,
        budget: budgetNum,
        deadline: deadlineIso,
      });

      toast({
        title: "Proposal created",
        description: `"${title.trim()}" has been created successfully.`,
        variant: "success",
      });

      setTitle("");
      setDescription("");
      setBudget("");
      setDeadline("");

      if (onCreated) {
        const maybe = onCreated();
        if (maybe instanceof Promise) {
          await maybe;
        }
      }
    } catch (err) {
      // Error is already handled by the hook
    }
  }

  return (
    <Card className="border-white/10 bg-black/40">
      <CardHeader>
        <CardTitle className="text-base">New proposal</CardTitle>
        <CardDescription className="text-xs">
          Create a work, budget, or decision proposal that the team will execute
          and track with tasks.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="proposal-title"
              className="text-xs font-medium text-slate-200"
            >
              Title
            </label>
            <Input
              id="proposal-title"
              placeholder="e.g. Define daily standup time"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="proposal-description"
              className="text-xs font-medium text-slate-200"
            >
              Description
            </label>
            <Textarea
              id="proposal-description"
              rows={3}
              placeholder="Context, goals, and scope of this proposal."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="proposal-budget"
                className="text-xs font-medium text-slate-200"
              >
                Budget (optional)
              </label>
              <Input
                id="proposal-budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="proposal-deadline"
                className="text-xs font-medium text-slate-200"
              >
                Deadline (optional)
              </label>
              <Input
                id="proposal-deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">
              Error while creating the proposal: {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating proposal..." : "Create proposal"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
