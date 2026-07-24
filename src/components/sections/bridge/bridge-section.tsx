"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { TrustMetricStrip } from "./trust-metric-strip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { TrustMetric } from "@/types";

export interface BridgeSectionProps {
  metrics: TrustMetric[];
}

/**
 * Hero 다음의 문제 언어화 + 근거 섹션 — DEVELOPMENT_PLAN.md Phase 5A(Storytelling) +
 * Phase 6(Trust)를 하나로 통합.
 *
 * CRO 재설계(2026-07-23) 2차: 기존에는 Bridge(선언형 카피)와 Trust(카드 3개짜리 독립
 * 섹션)가 분리되어 있었으나, Trust 카드가 제목+숫자+설명 2줄+진행바+출처+아코디언까지
 * 담고 있어 "글이 많아서 숫자 자체의 임팩트가 약하다"는 문제가 있었다. Trust를 별도
 * 섹션으로 유지하는 대신, 숫자만 남긴 한 줄 스트립(`TrustMetricStrip`)으로 축소해 이
 * Bridge 섹션 하단에 합쳤다 — "혹시 문의가 안 오시나요?"(문제) → "우리는 ~ 설계합니다"
 * (포지셔닝) → 통계 스트립(근거)이 섹션 전환 없이 한 흐름으로 이어지고, 곧바로 다음
 * Difference 섹션("그래서 우리는 다릅니다")으로 연결된다. 섹션 하나가 통째로 줄어들어
 * 스크롤 리듬도 더 타이트해졌다.
 *
 * 배경(elevated)은 이전에 Trust 섹션이 갖고 있던 톤을 그대로 이어받은 것이다 — Hero →
 * Bridge(elevated) → Difference(base) → Services(elevated) → ... 교차 리듬 유지.
 *
 * Hero의 3단 스크럽 스토리텔링과 달리 여기서는 절제된 Fade+Translate(once)만 사용한다 —
 * "과도한 효과 금지" 원칙에 맞춘 선택이다. `useLayoutEffect`를 사용해 초기 숨김 상태
 * (opacity:0)를 첫 페인트 전에 적용한다(useEffect를 쓰면 브라우저가 숨기기 직전의
 * "보이는" 상태를 한 프레임 그릴 수 있다).
 *
 * UI Polish(2026-07-23): 세로 패딩을 고정값(py-24)에서 다른 모든 섹션과 동일한 반응형
 * 스케일(py-16/24/32, `Section` 컴포넌트 기본값과 동일)로 맞췄다 — `min-h-screen`이
 * 실제 높이를 대부분 결정하므로 시각적 영향은 크지 않지만, 아주 큰 화면에서도 다른
 * 섹션과 동일한 여백 규칙을 따르도록 통일했다.
 */
export function BridgeSection({ metrics }: BridgeSectionProps) {
  const mainRef = useRef<HTMLElement>(null);
  const subRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    // Reduced Motion 사용자는 애니메이션 없이 기본(불투명, 제자리) 상태로만 본다.
    if (prefersReducedMotion) return;
    if (!mainRef.current || !subRef.current || !stripRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([mainRef.current, subRef.current, stripRef.current], { opacity: 0, y: 24 });

      gsap.to(mainRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: subRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(stripRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stripRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="bridge"
      aria-label="Bridge"
      className="relative flex min-h-screen flex-col items-center justify-center gap-16 bg-brand-bg-elevated px-4 py-16 md:py-24 lg:py-32"
    >
      <Container size="narrow" className="flex flex-col items-center gap-10 text-center sm:gap-12">
        <Heading ref={mainRef} as="h2" size="display" className="text-balance">
          혹시, 홈페이지는 있는데
          <br />
          <span className="text-brand-accent whitespace-nowrap">문의는 오지</span> 않으시나요?
        </Heading>

        <Text ref={subRef} as="p" size="lg" className="max-w-[42ch] text-balance">
          우리는 방문자가 <span className="text-brand-accent">신뢰</span>하고,{" "}
          <span className="text-brand-accent">문의</span> 버튼을 누르게 만드는 홈페이지를
          설계합니다.
        </Text>
      </Container>

      <Container>
        <TrustMetricStrip ref={stripRef} metrics={metrics} className="w-full" />
      </Container>
    </section>
  );
}
