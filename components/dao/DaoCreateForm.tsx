"use client";

import { FormEvent, useState } from "react";
import { useCreateDao } from "@/hooks/useDaos";
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

export interface DaoCreateFormProps {
  onCreated?: () => void | Promise<void>;
}

export function DaoCreateForm({ onCreated }: DaoCreateFormProps) {
  const { mutate: createDao, loading, error } = useCreateDao();
  const { toast } = useToast();

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
    <Card className="border-white/10 bg-black/40">
      <CardHeader>
        <CardTitle className="text-base">Create new DAO</CardTitle>
        <CardDescription className="text-xs">
          Define the space where proposals and operational tasks will be
          grouped.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="dao-name" className="text-xs font-medium text-slate-200">
              DAO name
            </label>
            <Input
              id="dao-name"
              placeholder="E.g.: Roxium Core Contributors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="dao-description" className="text-xs font-medium text-slate-200">
              Description (optional)
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
            <p className="text-xs text-red-400">Error creating DAO: {error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating DAO..." : "Create DAO"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
