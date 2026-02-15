import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  variant?: "create" | "list";
  className?: string;
}

export function SectionHeader({
  title,
  description,
  variant = "list",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center gap-3">
        {variant === "create" && (
          <div className="h-6 w-1 rounded-full bg-primary" />
        )}
        <h2
          className={cn(
            "text-xl font-bold text-foreground",
            variant === "create" && "text-primary"
          )}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
