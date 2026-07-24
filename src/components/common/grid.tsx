import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ColCount = 1 | 2 | 3 | 4 | 6 | 12;

const COLS_BASE: Record<ColCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const COLS_MD: Record<ColCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

const COLS_LG: Record<ColCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

export interface GridProps {
  as?: ElementType;
  /** DESIGN_SYSTEM.md 5장 — Mobile 4 / Tablet 8 / Desktop 12 컬럼 기준의 반응형 컬럼 수 */
  cols?: { base?: ColCount; md?: ColCount; lg?: ColCount };
  className?: string;
  children: ReactNode;
}

/**
 * DESIGN_SYSTEM.md 5장 Grid 시스템. Gutter는 Mobile 16px → Tablet 20px → Desktop 24px로
 * 브레이크포인트별 문서 값을 그대로 반영한다.
 */
export function Grid({ as, cols = { base: 1, md: 2, lg: 3 }, className, children }: GridProps) {
  const Tag = (as ?? "div") as ElementType<{ className?: string; children?: ReactNode }>;
  return (
    <Tag
      className={cn(
        "grid gap-4 md:gap-5 lg:gap-6",
        cols.base && COLS_BASE[cols.base],
        cols.md && COLS_MD[cols.md],
        cols.lg && COLS_LG[cols.lg],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
