import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "surface" | "elevated" | "bordered" | "ghost";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

function Card({
  className,
  variant = "default",
  hover = false,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        // Variants
        variant === "default"  && "bg-white border border-border-subtle shadow-card-sm",
        variant === "surface"  && "bg-bg-surface border border-border-subtle",
        variant === "elevated" && "bg-white border border-border shadow-card",
        variant === "bordered" && "bg-white border-2 border-border",
        variant === "ghost"    && "bg-transparent",
        // Padding
        padding === "none" && "",
        padding === "sm"   && "p-4",
        padding === "md"   && "p-5",
        padding === "lg"   && "p-6",
        padding === "xl"   && "p-8",
        // Hover
        hover && "transition-all duration-250 ease-premium hover:shadow-card-lg hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display font-semibold text-text-primary leading-tight tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-body-sm text-text-secondary", className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-border-subtle mt-4", className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
