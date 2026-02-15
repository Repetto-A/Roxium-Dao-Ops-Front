import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  variant?: "create" | "list";
  className?: string;
  action?: ReactNode;
  titleClassName?: string;
}

export function SectionHeader({
  title,
  description,
  variant = "list",
  className,
  action,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {variant === "create" && (
            <div className="h-6 w-1 rounded-full bg-primary" />
          )}
          <h2
            className={cn(
              "text-xl font-bold text-foreground",
              variant === "create" && "text-primary",
              titleClassName,
            )}
          >
            {title}
          </h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
