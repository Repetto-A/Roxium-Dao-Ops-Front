// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Roxium DAO Ops | Vetra-powered DAO Control",
  description:
    "Orchestrate your DAOs, proposals, and tasks with on-chain persistence using Vetra as the data layer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
