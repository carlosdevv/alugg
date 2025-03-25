import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs ring-1 ring-inset font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        yellow:
          "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 ring-yellow-700/10",
        green:
          "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 ring-green-600/10",
        gray: "bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 ring-gray-500/10",
        indigo:
          "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 ring-indigo-700/10",
        rose: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 ring-rose-700/10",
        violet:
          "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400 ring-violet-700/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
