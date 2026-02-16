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
        // Proposal statuses - true black and white contrast
        "status-draft":
          "border-white bg-black text-white shadow-md",
        "status-open":
          "border-white bg-white text-black shadow-md font-semibold",
        "status-closed":
          "border-white bg-gray-800 text-white shadow-md",
        "status-archived":
          "border-gray-400 bg-gray-300 text-black shadow-md",
        // Task statuses - true black and white contrast
        "status-todo":
          "border-white bg-black text-white shadow-md",
        "status-progress":
          "border-white bg-white text-black shadow-md font-semibold",
        "status-done":
          "border-gray-400 bg-gray-300 text-black shadow-md",
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
