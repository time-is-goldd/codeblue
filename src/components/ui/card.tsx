import type { ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * DESIGN_SYSTEM.md 9장 Card 규칙.
 * - base: 기본 카드 (bg-elevated, border-subtle, radius-lg, shadow-md)
 * - glass: 반투명 글래스모피즘 변형 (Hero 위 배치되는 강조 카드 등에 사용)
 * - hoverable: translateY(-4px) + shadow-lg + border-strong, 200ms ease-out
 */
const cardVariants = cva("rounded-lg border transition-all duration-base ease-out-expo", {
  variants: {
    variant: {
      base: "border-brand-border-subtle bg-brand-bg-elevated shadow-md",
      glass:
        "border-white/10 bg-brand-bg-elevated/60 shadow-md backdrop-blur-md supports-backdrop-filter:bg-brand-bg-elevated/40",
    },
    padding: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    hoverable: {
      true: "hover:-translate-y-1 hover:border-brand-border-strong hover:shadow-lg",
      false: "",
    },
  },
  defaultVariants: {
    variant: "base",
    padding: "md",
    hoverable: false,
  },
});

export interface CardProps extends VariantProps<typeof cardVariants> {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Card({ as, variant, padding, hoverable, className, children }: CardProps) {
  const Tag = (as ?? "div") as ElementType<{ className?: string; children?: ReactNode }>;
  return <Tag className={cn(cardVariants({ variant, padding, hoverable }), className)}>{children}</Tag>;
}
