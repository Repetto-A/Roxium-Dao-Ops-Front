"use client";

import { useDaos } from "@/hooks/useDaos";
import { useUpdateDao, useDeleteDao } from "@/hooks/useDaos";
import { DaoCreateForm } from "@/components/dao/DaoCreateForm";
import { DaoList } from "@/components/dao/DaoList";
import { useToast } from "@/components/ui/toast";

import { Container } from "@/components/common/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function DaosPage() {
  const { daos, loading, error, refetch } = useDaos();
  const { mutate: updateDao } = useUpdateDao();
  const { mutate: deleteDao } = useDeleteDao();
  const { toast } = useToast();

  async function handleReload(): Promise<void> {
    await refetch();
  }

  async function handleUpdateDao(daoId: string, input: { name?: string; description?: string }) {
    try {
      await updateDao(daoId, input);
      toast({ title: "DAO updated", description: "Changes saved successfully.", variant: "success" });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to update DAO.", variant: "error" });
    }
  }

  async function handleDeleteDao(daoId: string) {
    try {
      await deleteDao(daoId);
      toast({ title: "DAO archived", description: "DAO has been archived.", variant: "success" });
      await refetch();
    } catch {
      toast({ title: "Error", description: "Failed to archive DAO.", variant: "error" });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader breadcrumbs={[{ label: "DAOs" }]} />
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-10 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              DAOs
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
              Create and manage DAOs with their proposals and tasks on Vetra.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
            <div className="order-2 lg:order-1">
              <DaoCreateForm onCreated={handleReload} />
            </div>
            <div className="order-1 lg:order-2">
              <DaoList
                daos={daos}
                loading={loading}
                error={error}
                onReload={handleReload}
                onUpdate={handleUpdateDao}
                onDelete={handleDeleteDao}
              />
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
