"use client";

import { FormEvent, useState, useRef } from "react";
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
import { SectionHeader } from "@/components/common/SectionHeader";
import { Calendar } from "lucide-react";

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
  const deadlineInputRef = useRef<HTMLInputElement>(null);

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
    <div>
      <SectionHeader
        title="Create Proposal"
        variant="create"
      />
      <Card className="border-l-2 border-l-primary">
        <CardHeader>
          <CardTitle>New proposal</CardTitle>
          <CardDescription>
            Create a work, budget, or decision proposal that the team will execute
            and track with tasks.
          </CardDescription>
        </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="proposal-title"
              className="text-sm font-semibold text-foreground"
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

          <div className="space-y-2">
            <label
              htmlFor="proposal-description"
              className="text-sm font-semibold text-foreground"
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="proposal-budget"
                className="text-sm font-semibold text-foreground"
              >
                Budget <span className="text-muted-foreground font-normal">(optional)</span>
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

            <div className="space-y-2">
              <label
                htmlFor="proposal-deadline"
                className="text-sm font-semibold text-foreground"
              >
                Deadline <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Input
                  ref={deadlineInputRef}
                  id="proposal-deadline"
                  type="datetime-local"
                  className="min-w-[180px] pr-10"
                  aria-label="Deadline date and time"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => deadlineInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Open calendar picker"
                >
                  <Calendar className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              Error while creating the proposal: {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-2">
          <Button
            type="submit"
            size="lg"
            disabled={loading || !title.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating proposal..." : "Create proposal"}
          </Button>
        </CardFooter>
      </form>
      </Card>
    </div>
  );
}
