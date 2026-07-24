import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconWrapperVariants = cva("inline-flex shrink-0 items-center justify-center rounded-md", {
  variants: {
    size: {
      sm: "size-8 [&_svg]:size-icon-sm",
      md: "size-10 [&_svg]:size-icon-md",
      lg: "size-12 [&_svg]:size-icon-lg",
    },
    tone: {
      accent: "bg-brand-accent-muted text-brand-accent",
      neutral: "bg-brand-bg-elevated-2 text-brand-text-secondary",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "accent",
  },
});

export interface IconWrapperProps extends VariantProps<typeof iconWrapperVariants> {
  className?: string;
  children: ReactNode;
}

/**
 * 아이콘 배경 래퍼 — DESIGN_SYSTEM.md 10장(아이콘 규칙), FeatureCard 등에서 사용.
 */
export function IconWrapper({ size, tone, className, children }: IconWrapperProps) {
  return <span className={cn(iconWrapperVariants({ size, tone }), className)}>{children}</span>;
}
