import type { Ref } from "react";
import { Text } from "@/components/ui/typography/text";
import { Caption } from "@/components/ui/typography/caption";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { TrustMetric } from "@/types";

export interface TrustMetricStripProps {
  metrics: TrustMetric[];
  className?: string;
  /** GSAP 등 명령형 애니메이션에서 참조할 때 사용 — BridgeSection이 mainRef/subRef와
   *  동일한 원칙(fade+y once)으로 이 스트립도 함께 진입시킨다. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Bridge 섹션 하단에 붙는 한 줄 통계 스트립 — CRO 재설계(2026-07-23) 신설.
 *
 * 기존에는 독립된 Trust 섹션(제목 + 카드 3개, 카드마다 숫자/설명 2줄/진행바/출처/아코디언)
 * 이었으나, "글이 많아서 숫자 자체의 임팩트가 약하다"는 판단에 따라 폐기하고 이 컴포넌트로
 * 대체했다. 아이콘 + 숫자 + 한 줄 캡션만 남기고 설명 문장/진행바/카드별 출처/아코디언을
 * 전부 제거했다 — 출처는 항목마다 반복하지 않고 스트립 하단에 한 줄로만 모아 표기한다.
 *
 * Bridge의 "혹시 문의가 안 오시나요?" 질문 바로 다음에 배치해 "그 근거는 이렇습니다"로
 * 자연스럽게 이어지고, 곧바로 Difference 섹션의 "그래서 우리는 다릅니다"로 넘어간다 —
 * 별도 섹션 전환 없이 한 흐름 안에서 문제 제기 → 근거 → 해결책이 이어진다.
 */
export function TrustMetricStrip({ metrics, className, ref }: TrustMetricStripProps) {
  if (metrics.length === 0) return null;

  const sources = Array.from(new Set(metrics.map((m) => m.source)));

  return (
    <div ref={ref} className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {metrics.map((metric, index) => {
          const Icon = resolveIcon(metric.icon);
          return (
            <div
              key={metric.id}
              className={cn(
                "flex flex-col items-center gap-1 px-2 text-center",
                index > 0 && "md:border-l md:border-brand-border-subtle md:pl-8",
              )}
            >
              <div className="flex items-center gap-1.5">
                <Icon aria-hidden className="size-icon-sm shrink-0 text-brand-accent" />
                <Text as="span" size="lg" weight="semibold" className="text-brand-accent">
                  {metric.prefix}
                  {metric.value}
                  {metric.suffix}
                </Text>
              </div>
              <Text size="sm" color="tertiary">
                {metric.title}
              </Text>
            </div>
          );
        })}
      </div>

      <Caption>출처: {sources.join(" · ")}</Caption>
    </div>
  );
}
