import type { Ref } from "react";
import { cn } from "@/lib/utils";

export interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /**
   * GSAP 등 명령형 애니메이션이 이 span의 textContent를 직접 갱신할 때 사용한다
   * (React state를 거치지 않는 카운트업 — DEVELOPMENT_PLAN.md Phase 5C 성능 원칙).
   * ref가 없으면 완전히 정적인 표시 컴포넌트로 동작한다.
   */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * 숫자 표시 — Trust 섹션 등에서 사용. 이 컴포넌트 자체는 항상 최종값을 렌더링하므로
 * (SEO_PLAN.md 대응: 검색엔진은 실제 숫자를 그대로 읽는다), 카운트업 애니메이션이
 * 필요한 곳에서는 `ref`로 이 span을 가져가 애니메이션 시작 시 0으로 리셋했다가
 * 다시 최종값까지 tween한다 — 초기 SSR/no-JS 상태에서는 항상 정확한 값이 보인다.
 */
export function Counter({ value, prefix, suffix, className, ref }: CounterProps) {
  return (
    <span ref={ref} className={cn("font-bold tabular-nums text-brand-accent", className)}>
      {prefix}
      {value.toLocaleString("ko-KR")}
      {suffix}
    </span>
  );
}
