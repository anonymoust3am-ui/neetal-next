"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  "inline-flex items-center justify-center gap-2 rounded-lg font-display font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm hover:shadow-md",
        secondary:
          "bg-bg-surface text-text-primary border border-border hover:bg-bg-elevated hover:border-border-strong",
        outline:
          "bg-transparent text-accent-500 border border-accent-500 hover:bg-accent-surface hover:text-accent-600",
        ghost:
          "bg-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary",
        destructive:
          "bg-destructive text-white hover:bg-red-700 active:bg-red-800",
        "accent-ghost":
          "bg-transparent text-accent-500 hover:bg-accent-surface",
        white:
          "bg-white text-text-primary shadow-card hover:shadow-card-lg border border-border-subtle",
        "white-accent":
          "bg-white text-accent-500 shadow-card hover:shadow-card-lg border border-accent-200 hover:border-accent-300",
      },
      size: {
        xs:   "h-7  px-3   text-xs   gap-1",
        sm:   "h-8  px-3.5 text-sm   gap-1.5",
        md:   "h-10 px-4   text-sm   gap-2",
        lg:   "h-11 px-5   text-base gap-2",
        xl:   "h-12 px-6   text-base gap-2",
        "2xl":"h-14 px-8   text-lg  gap-2.5",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // When asChild=true, Slot requires exactly one child element.
    // Wrap everything in a span so icons can still render.
    if (asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
