import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CaptionProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * 캡션/메타 정보 — DESIGN_SYSTEM.md 3.2 (`--text-caption`, 12px, 500 weight).
 */
export function Caption({ as, className, children }: CaptionProps) {
  const Tag = (as ?? "span") as ElementType<{ className?: string; children?: ReactNode }>;
  return (
    <Tag className={cn("text-caption font-medium text-brand-text-tertiary", className)}>
      {children}
    </Tag>
  );
}
