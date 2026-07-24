import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-brand-border-subtle bg-brand-bg-elevated-2 text-brand-text-secondary",
        accent: "border-transparent bg-brand-accent-muted text-brand-accent",
        success: "border-transparent bg-brand-success/15 text-brand-success",
        warning: "border-transparent bg-brand-warning/15 text-brand-warning",
        danger: "border-transparent bg-brand-danger/15 text-brand-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: ReactNode;
}

/**
 * 상태/카테고리 표시용 비상호작용 라벨. DESIGN_SYSTEM.md 13.12 원칙에 따라
 * 색상만으로 의미를 전달하지 않도록, 반드시 텍스트와 함께 사용한다.
 */
export function Badge({ variant, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
