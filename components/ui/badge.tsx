import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all overflow-hidden uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 shadow-sm",
        outline:
          "text-foreground border-border/60 [a&]:hover:bg-muted/50 [a&]:hover:border-border",
        // Proposal statuses - soft violet-forward accents
        "status-draft":
          "border-violet-300 bg-violet-700 text-white shadow-sm",
        "status-open":
          "border-violet-200 bg-violet-100 text-violet-900 shadow-sm font-semibold",
        "status-closed":
          "border-indigo-300 bg-indigo-700 text-white shadow-sm",
        "status-archived":
          "border-slate-300 bg-slate-100 text-slate-700 shadow-sm",
        // Task statuses - aligned with board columns
        "status-todo":
          "border-violet-300 bg-violet-700 text-white shadow-sm",
        "status-progress":
          "border-indigo-200 bg-indigo-100 text-indigo-900 shadow-sm font-semibold",
        "status-done":
          "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-900 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
