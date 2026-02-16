"use client";

import { FormEvent, useState, useRef } from "react";
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
import { SectionHeader } from "@/components/common/SectionHeader";
import { Calendar } from "lucide-react";

export interface TaskCreateFormProps {
  daoId: string;
  proposalId: string | null;
  onCreated?: () => void | Promise<void>;
  hideSectionHeader?: boolean;
}

export function TaskCreateForm({
  daoId,
  proposalId,
  onCreated,
  hideSectionHeader = false,
}: TaskCreateFormProps) {
  const { mutate: createTask, loading, error } = useCreateTask();
  const { toast } = useToast();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const deadlineInputRef = useRef<HTMLInputElement>(null);

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
    <div>
      {!hideSectionHeader && (
        <SectionHeader
          title="Create Task"
          variant="create"
        />
      )}
      <Card className="border-l-2 border-l-primary">
        <CardHeader>
          <CardTitle>New Task</CardTitle>
          <CardDescription>
            Tasks linked to the selected proposal.
          </CardDescription>
        </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!proposalId && (
            <p className="text-sm text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              Select a proposal in the middle column to create tasks.
            </p>
          )}

          <div className="space-y-2">
            <label
              htmlFor="task-title"
              className="text-sm font-semibold text-foreground"
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

          <div className="space-y-2">
            <label
              htmlFor="task-description"
              className="text-sm font-semibold text-foreground"
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="task-budget"
                className="text-sm font-semibold text-foreground"
              >
                Budget <span className="text-muted-foreground font-normal">(optional)</span>
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

            <div className="space-y-2">
              <label
                htmlFor="task-deadline"
                className="text-sm font-semibold text-foreground"
              >
                Deadline <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Input
                  ref={deadlineInputRef}
                  id="task-deadline"
                  disabled={!proposalId}
                  type="datetime-local"
                  className="min-w-[180px] pr-10"
                  aria-label="Deadline date and time"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!proposalId}
                  onClick={() => deadlineInputRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Open calendar picker"
                >
                  <Calendar className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">Error creating task: {error}</p>
          )}
        </CardContent>
        <CardFooter className="mt-2">
          <Button
            type="submit"
            size="lg"
            disabled={loading || isDisabled}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating task..." : "Create task"}
          </Button>
        </CardFooter>
      </form>
      </Card>
    </div>
  );
}
