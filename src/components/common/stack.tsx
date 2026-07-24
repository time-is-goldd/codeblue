import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GapValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;

const GAP_CLASS: Record<GapValue, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
  32: "gap-32",
};

const ALIGN_CLASS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const JUSTIFY_CLASS = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export interface StackProps {
  as?: ElementType;
  direction?: "row" | "column";
  /** DESIGN_SYSTEM.md 4장 spacing 토큰(4px 배수)과 동일한 값만 허용한다 */
  gap?: GapValue;
  align?: keyof typeof ALIGN_CLASS;
  justify?: keyof typeof JUSTIFY_CLASS;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Flex 기반 방향/간격 통일 래퍼 — 반복되는 `flex flex-col gap-*` 조합을 대체한다.
 */
export function Stack({
  as,
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap = false,
  className,
  children,
}: StackProps) {
  const Tag = (as ?? "div") as ElementType<{ className?: string; children?: ReactNode }>;
  return (
    <Tag
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        GAP_CLASS[gap],
        align && ALIGN_CLASS[align],
        justify && JUSTIFY_CLASS[justify],
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
