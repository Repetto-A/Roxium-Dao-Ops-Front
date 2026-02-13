"use client";

import { FormEvent, useState } from "react";
import { useCreateTask } from "@/hooks/useTasks";
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

export interface TaskCreateFormProps {
  daoId: string;
  proposalId: string | null;
  onCreated?: () => void | Promise<void>;
}

export function TaskCreateForm({
  daoId,
  proposalId,
  onCreated,
}: TaskCreateFormProps) {
  const { mutate: createTask, loading, error } = useCreateTask();
  const { toast } = useToast();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const isDisabled = !proposalId || !title.trim();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!proposalId || !title.trim()) return;

    const deadlineIso =
      deadline.trim().length > 0
        ? new Date(deadline).toISOString()
        : undefined;

    const budgetNum = budget.trim() ? parseFloat(budget) : undefined;

    try {
      await createTask({
        daoId,
        proposalId,
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadlineIso,
        budget: budgetNum,
      });

      toast({
        title: "Task created",
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
        <CardTitle className="text-base">New Task</CardTitle>
        <CardDescription className="text-xs">
          Tasks linked to the selected proposal.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          {!proposalId && (
            <p className="text-xs text-amber-300">
              Select a proposal in the middle column to create tasks.
            </p>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="task-title"
              className="text-xs font-medium text-slate-200"
            >
              Title
            </label>
            <Input
              id="task-title"
              disabled={!proposalId}
              placeholder="Ex: Implement /orders endpoint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="task-description"
              className="text-xs font-medium text-slate-200"
            >
              Description
            </label>
            <Textarea
              id="task-description"
              disabled={!proposalId}
              rows={3}
              placeholder="Details of what needs to be done, technical context, links, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="task-budget"
                className="text-xs font-medium text-slate-200"
              >
                Budget (optional)
              </label>
              <Input
                id="task-budget"
                disabled={!proposalId}
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 200"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="task-deadline"
                className="text-xs font-medium text-slate-200"
              >
                Deadline (optional)
              </label>
              <Input
                id="task-deadline"
                disabled={!proposalId}
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">Error creating task: {error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading || isDisabled}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating task..." : "Create task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
