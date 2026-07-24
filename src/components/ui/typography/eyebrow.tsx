import type { ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const eyebrowVariants = cva("text-caption font-semibold uppercase tracking-[0.08em]", {
  variants: {
    color: {
      accent: "text-brand-accent",
      tertiary: "text-brand-text-tertiary",
    },
  },
  defaultVariants: {
    color: "accent",
  },
});

export interface EyebrowProps extends VariantProps<typeof eyebrowVariants> {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * 헤드라인 상단에 배치하는 소형 라벨 (예: "SERVICES", "PORTFOLIO").
 * Attention 단계에서 섹션의 주제를 먼저 인지시키는 역할 — WIREFRAME.md 심리 흐름 보조.
 */
export function Eyebrow({ as, color = "accent", className, children }: EyebrowProps) {
  const Tag = (as ?? "p") as ElementType<{ className?: string; children?: ReactNode }>;
  return <Tag className={cn(eyebrowVariants({ color }), className)}>{children}</Tag>;
}
