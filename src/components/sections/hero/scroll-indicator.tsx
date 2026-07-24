"use client";

import { MouseIcon } from "lucide-react";
import { useLenis } from "@/components/providers/lenis-provider";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { cn } from "@/lib/utils";

export interface ScrollIndicatorProps {
  className?: string;
}

/** Hero 바로 다음 섹션(CapacityBadge)의 id — page.tsx의 실제 섹션 순서와 반드시 일치해야 한다. */
const NEXT_SECTION_ID = "capacity";

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
        "inline-flex flex-col items-center gap-2 rounded-md text-brand-text-tertiary outline-none transition-colors duration-fast hover:text-brand-text-secondary focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <MouseIcon aria-hidden className="size-icon-lg" />
    </button>
  );
}
