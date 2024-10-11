import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function Area({
  visible,
  direction,
  children,
}: PropsWithChildren<{ visible: boolean; direction: "left" | "right" }>) {
  return (
    <div
      className={cn(
        "left-0 top-0 w-full md:transition-[opacity,transform] md:duration-300",
        visible
          ? "opacity-1 relative"
          : cn(
              "pointer-events-none absolute opacity-0",
              direction === "left" ? "-translate-x-full" : "translate-x-full"
            )
      )}
      aria-hidden={!visible ? "true" : undefined}
    >
      {children}
    </div>
  );
}
