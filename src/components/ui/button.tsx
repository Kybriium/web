import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-teal-deep disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "border border-brand-canvas bg-brand-canvas text-brand-teal-deep hover:bg-white",
        secondary:
          "border border-brand-canvas/30 bg-brand-canvas/10 text-brand-canvas backdrop-blur-sm hover:border-brand-canvas/50 hover:bg-brand-canvas/20",
        outline:
          "border border-brand-canvas/40 bg-transparent text-brand-canvas hover:border-brand-accent/60 hover:bg-brand-canvas/10",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
