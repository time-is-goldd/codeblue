import type { Ref } from "react";
import { cn } from "@/lib/utils";

export interface CircularProgressProps {
  /** 0~100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
  className?: string;
  /**
   * 진행률을 나타내는 원(circle) 자체에 대한 ref. GSAP 등 명령형 애니메이션이
   * `stroke-dashoffset`을 직접 조작할 때 사용한다(DEVELOPMENT_PLAN.md Phase 5C).
   * 제공하지 않으면 `value` prop이 그대로 반영된 정적 컴포넌트로 동작한다.
   */
  circleRef?: Ref<SVGCircleElement>;
  /** 중앙 퍼센트 텍스트에 대한 ref. 위와 동일한 이유로 textContent를 직접 갱신할 때 사용한다 */
  valueTextRef?: Ref<HTMLSpanElement>;
}

/**
 * 원형 진행률 표시 — shadcn Progress(선형)의 보완 컴포넌트.
 * 기본값(`circleRef`/`valueTextRef` 미제공)으로는 `value`를 그대로 반영하는
 * 완전한 정적 컴포넌트다 — 검색엔진/최초 렌더링에는 항상 최종값이 보인다
 * (SEO_PLAN.md 대응). ref가 제공되면 호출 측이 애니메이션 시작 시 0으로
 * 리셋했다가 다시 최종값까지 tween하는 방식으로 사용할 수 있다.
 */
export function CircularProgress({
  value,
  size = 64,
  strokeWidth = 6,
  showValue = true,
  label,
  className,
  circleRef,
  valueTextRef,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-brand-bg-elevated-2"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none stroke-brand-accent transition-[stroke-dashoffset] duration-slow ease-out-expo"
        />
      </svg>
      {showValue && (
        <span ref={valueTextRef} className="absolute text-body-sm font-semibold text-brand-text-primary">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
