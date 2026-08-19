"use client";

import { MouseIcon } from "lucide-react";
import { useLenis } from "@/components/providers/lenis-provider";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { cn } from "@/lib/utils";

export interface ScrollIndicatorProps {
  className?: string;
}

/** Hero 바로 다음 섹션(Portfolio)의 id — page.tsx의 실제 섹션 순서와 반드시 일치해야
 *  한다. 메인 콘텐츠 재배치(2026-08-14)로 Portfolio/Review가 Hero 바로 다음으로
 *  이동하면서 Portfolio가 Hero 바로 다음 섹션이 됐다. */
const NEXT_SECTION_ID = "portfolio";

/**
 * Hero 하단 스크롤 유도 UI — DEVELOPMENT_PLAN.md Phase 4A.
 * 이번 단계에서는 반복 애니메이션 없이 정적으로만 표시한다(Phase 4B 이후 모션 검토).
 * 장식이 아니라 실제 클릭 가능한 버튼으로 만들어 "다음 섹션으로 스크롤"이라는
 * 목적을 aria-label로 명확히 전달한다.
 */
export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const lenis = useLenis();

  function handleClick() {
    const target = document.getElementById(NEXT_SECTION_ID);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: -HEADER_HEIGHT });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="다음 섹션으로 스크롤"
      className={cn(
        // hidden [@media(hover:hover)_and_(pointer:fine)]:inline-flex(2026-08-20): 이
        // 마우스 아이콘은 "마우스 스크롤로 더 볼 수 있다"는 PC 전용 힌트라 터치 기기에는
        // 의미가 없다(물리적 마우스가 없다). 기본은 숨김이고, 실제 마우스 hover가
        // 가능한 정밀 포인터 환경(`(hover: hover) and (pointer: fine)`)에서만 보여준다.
        // `pointer: coarse`의 단순 반대가 아니라 이 조합 쿼리를 직접 쓰는 이유는
        // 터치+정밀 포인터가 공존하는 하이브리드 기기에서도 정확히 판별하기 위함이다.
        "hidden flex-col items-center gap-2 rounded-md text-brand-text-tertiary outline-none transition-colors duration-fast hover:text-brand-text-secondary focus-visible:ring-3 focus-visible:ring-ring/50 [@media(hover:hover)_and_(pointer:fine)]:inline-flex",
        className,
      )}
    >
      <MouseIcon aria-hidden className="size-icon-lg" />
    </button>
  );
}
