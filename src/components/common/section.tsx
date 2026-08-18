import type { CSSProperties, ElementType, ReactNode } from "react";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { cn } from "@/lib/utils";

const SECTION_BACKGROUND = {
  base: "bg-background",
  elevated: "bg-brand-bg-elevated",
} as const;

/**
 * 섹션 상하 여백 변형(2026-08-19 홈페이지 길이 정리) — 기존에는 모든 섹션이
 * `default` 하나만 썼다(PC 64/96/128px). Hero(Section을 쓰지 않고 직접 마크업)와
 * Portfolio는 이번 정리 대상에서 제외되어 계속 `default`를 쓴다.
 *
 * - `comfortable`(PC 96px): Review/Founder/Pricing/FAQ/Contact 등 "일반 섹션" —
 *   "PC 기준 상하 여백을 약 88~96px 수준으로 통일"이라는 요구를 상단값(96px)으로 맞춘다.
 * - `compact`(PC 80px): Difference(안심 제작 원칙)처럼 "짧은 배너" 성격의 섹션 —
 *   "64~80px 수준으로 사용할 수 있다"는 범위의 상단값을 쓴다.
 * 모바일(base)은 두 변형 모두 64px로 동일하다 — "모바일은 일반적으로 64~72px"의
 * 하단값이며, 섹션끼리 붙어 보이지 않을 만큼은 확보하면서 더 압축한다.
 */
const SECTION_SPACING = {
  default: "py-16 md:py-24 lg:py-32",
  comfortable: "py-16 md:py-20 lg:py-24",
  compact: "py-16 lg:py-20",
} as const;

export interface SectionProps {
  as?: ElementType;
  /** 스크롤 앵커 이동(예: Header 내비게이션 → #contact)에 사용 */
  id?: string;
  background?: keyof typeof SECTION_BACKGROUND;
  spacing?: keyof typeof SECTION_SPACING;
  className?: string;
  children: ReactNode;
}

/**
 * 섹션 단위 수직 패딩/배경을 통일하는 래퍼 — DESIGN_SYSTEM.md 4.1(섹션 간격),
 * COMPONENT_GUIDE.md 3장. Home의 거의 모든 섹션(Storytelling/Trust/Difference 등)이
 * Section + Container + SectionHeading 조합을 표준 골격으로 사용한다.
 *
 * `scroll-margin-top`(2026-08-19 신설): `id`가 있는 섹션에만 `HEADER_HEIGHT`만큼의 여유를
 * 자동으로 준다 — 고정(fixed) Header 때문에 해시 앵커로 이동했을 때 섹션 제목이 Header
 * 아래로 가려지는 문제를 막는다. Lenis/네이티브 스크롤 모두 이 CSS 속성을 그대로
 * 존중하므로(둘 다 실제로는 `scrollIntoView`/`window.scrollTo` 기반), 각 이동 로직
 * (`NavLink`, `CTABanner` 등)에 오프셋을 중복으로 손댈 필요가 없다.
 */
export function Section({
  as,
  id,
  background = "base",
  spacing = "default",
  className,
  children,
}: SectionProps) {
  const Tag = (as ?? "section") as ElementType<{
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }>;
  return (
    <Tag
      id={id}
      style={id ? { scrollMarginTop: HEADER_HEIGHT } : undefined}
      className={cn(SECTION_SPACING[spacing], SECTION_BACKGROUND[background], className)}
    >
      {children}
    </Tag>
  );
}
