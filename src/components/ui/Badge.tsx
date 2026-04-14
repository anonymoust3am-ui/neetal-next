import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill font-medium leading-none",
  {
    variants: {
      variant: {
        default:     "bg-bg-surface text-text-secondary border border-border-subtle",
        accent:      "bg-accent-surface text-accent-700",
        safe:        "bg-safe-badge text-safe-text",
        target:      "bg-target-badge text-target-text",
        dream:       "bg-dream-badge text-dream-text",
        success:     "bg-success-surface text-success",
        warning:     "bg-warning-surface text-warning",
        info:        "bg-info-surface text-info",
        destructive: "bg-destructive-surface text-destructive",
        dark:        "bg-text-primary text-text-inverse",
        outline:     "border border-border text-text-secondary",
        "accent-outline": "border border-accent-300 text-accent-600",
      },
      size: {
        xs: "text-[11px] px-1.5 py-0.5",
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full",
            variant === "safe"    && "bg-safe",
            variant === "target"  && "bg-target",
            variant === "dream"   && "bg-dream",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "info"    && "bg-info",
            !["safe","target","dream","success","warning","info"].includes(variant as string) && "bg-current"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
