import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  size = "md",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold uppercase tracking-widest">
          <span className="w-4 h-px bg-accent inline-block" />
          {eyebrow}
          <span className="w-4 h-px bg-accent inline-block" />
        </span>
      )}
      <h2
        className={cn(
          "font-bold text-foreground tracking-tight",
          size === "sm" && "text-2xl md:text-3xl",
          size === "md" && "text-3xl md:text-4xl",
          size === "lg" && "text-4xl md:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-foreground-muted leading-relaxed",
            size === "sm" && "text-sm max-w-lg",
            size === "md" && "text-base max-w-xl",
            size === "lg" && "text-lg max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}