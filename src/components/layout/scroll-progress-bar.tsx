"use client";

import { useEffect, useRef } from "react";
import { useLayoutScroll } from "./layout-scroll-provider";

/**
 * 페이지 최상단 스크롤 진행률 바 — DEVELOPMENT_PLAN.md Phase 3B.
 *
 * `LayoutScrollProvider.subscribeProgress`를 구독해 매 프레임 ref의 DOM 스타일을
 * 직접 갱신한다. React state를 거치지 않으므로 스크롤 중에도 이 컴포넌트(그리고
 * 부모 트리)가 재렌더링되지 않는다 — Header/FloatingCTA와 리스너를 공유하면서도
 * 가장 고빈도인 이 값만은 별도 경로로 처리해 성능을 확보한다.
 *
 * 부드러운 보간(transition)은 CSS로 처리하며, `prefers-reduced-motion`은
 * globals.css의 전역 규칙이 `transition-duration`을 강제로 무력화해 자동으로 대응된다.
 */
export function ScrollProgressBar() {
  const { subscribeProgress } = useLayoutScroll();
  const barRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeProgress(({ progress }) => {
      const bar = barRef.current;
      const track = trackRef.current;
      if (!bar || !track) return;

      bar.style.transform = `scaleX(${progress})`;
      track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    });
  }, [subscribeProgress]);

  return (
    <div
      ref={trackRef}
      role="progressbar"
      aria-label="페이지 읽기 진행률"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-x-0 top-0 z-scroll-progress h-1"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-brand-accent transition-transform duration-fast ease-out-expo"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
