"use client";

import { useEffect, useState } from "react";
import { HEADER_HEIGHT } from "@/lib/constants/layout";

/**
 * IntersectionObserver로 뷰포트 상단(헤더 바로 아래) 근처에 들어온 섹션을
 * "현재 섹션"으로 추적한다 — Header의 Active Navigation(밑줄/강조색)에 사용된다.
 *
 * `sectionIds`는 참조가 안정적인 배열(모듈 스코프 상수 등)이어야 한다. 매 렌더링마다
 * 새 배열 인스턴스를 넘기면 effect가 불필요하게 재실행되어 Observer가 계속
 * 재생성된다 (예: `lib/constants/nav.ts`의 `NAV_SECTION_IDS`).
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveId((current) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) return current;

          // rootMargin이 뷰포트 상단의 얇은 밴드만 관측하므로 대부분 1개만 걸리지만,
          // 전환 구간에서 2개가 동시에 걸릴 경우 문서상 더 아래(나중) 섹션을 우선한다.
          const sorted = [...visible].sort(
            (a, b) => sectionIds.indexOf(a.target.id) - sectionIds.indexOf(b.target.id),
          );
          return sorted[sorted.length - 1]!.target.id;
        });
      },
      {
        rootMargin: `-${HEADER_HEIGHT + 8}px 0px -60% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
