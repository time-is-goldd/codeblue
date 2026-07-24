import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

const SECTION_BACKGROUND = {
  base: "bg-background",
  elevated: "bg-brand-bg-elevated",
} as const;

export interface SectionProps {
  as?: ElementType;
  /** 스크롤 앵커 이동(예: Header 내비게이션 → #contact)에 사용 */
  id?: string;
  background?: keyof typeof SECTION_BACKGROUND;
  className?: string;
  children: ReactNode;
}

/**
 * 섹션 단위 수직 패딩/배경을 통일하는 래퍼 — DESIGN_SYSTEM.md 4.1(섹션 간격),
 * COMPONENT_GUIDE.md 3장. Home의 거의 모든 섹션(Storytelling/Trust/Difference 등)이
 * Section + Container + SectionHeading 조합을 표준 골격으로 사용한다.
 */
export function Section({
  as,
  id,
  background = "base",
  className,
  children,
}: SectionProps) {
  const Tag = (as ?? "section") as ElementType<{ id?: string; className?: string; children?: ReactNode }>;
  return (
    <Tag
      id={id}
      className={cn("py-16 md:py-24 lg:py-32", SECTION_BACKGROUND[background], className)}
    >
      {children}
    </Tag>
  );
}
