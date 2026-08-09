import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold",
    "disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring)]",
  ],
  {
    variants: {
      variant: {
        primary: "bg-[var(--brand)] text-white shadow-[0_5px_14px_rgba(23,105,224,0.18)] hover:-translate-y-px hover:bg-[var(--brand-hover)]",
        secondary: "border border-[#d6dbe1] bg-white text-[#252932] hover:border-[#b9c1cb] hover:bg-[#f7f9fb]",
        danger: "bg-[#c83243] text-white hover:bg-[#ad2636]",
        ghost: "text-[#596170] hover:bg-[#edf0f4] hover:text-[#171a21]",
        dark: "bg-[#22262f] text-white hover:bg-[#101217]",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-sm",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    variant?: Variant;
    size?: Size;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
