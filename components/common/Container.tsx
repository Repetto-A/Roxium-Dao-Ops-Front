// components/common/Container.tsx
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends PropsWithChildren {
  wide?: boolean;
}

export function Container({ children, wide = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        wide ? "max-w-6xl" : "max-w-5xl"
      )}
    >
      {children}
    </div>
  );
}
