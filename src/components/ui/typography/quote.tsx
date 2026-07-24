import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface QuoteProps {
  cite?: string;
  className?: string;
  children: ReactNode;
}

/**
 * 인용구 — Testimonial(고객 후기) 등에서 사용. 이탤릭 남용 금지 원칙(DESIGN_SYSTEM.md 3.3)에
 * 따라 스타일 강조는 좌측 accent border + 폰트 크기로만 처리한다.
 */
export function Quote({ cite, className, children }: QuoteProps) {
  return (
    <blockquote className={cn("border-l-2 border-brand-accent pl-6", className)}>
      <p className="text-body-lg leading-relaxed whitespace-pre-line text-brand-text-primary">{children}</p>
      {cite && <footer className="mt-2 text-body-sm text-brand-text-tertiary">{cite}</footer>}
    </blockquote>
  );
}
