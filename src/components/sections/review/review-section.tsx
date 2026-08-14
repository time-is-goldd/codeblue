"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { ReviewGrid } from "./review-grid";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Review } from "@/types";

export interface ReviewSectionProps {
  reviews: Review[];
}

const HEADING_ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * "사회적 증거(Social Proof)"로 신뢰를 강화하는 고객 후기 섹션 —
 * DEVELOPMENT_PLAN.md Phase 7A(Foundation) + 7B(Animation), WIREFRAME.md 2.8.
 *
 * 메인 콘텐츠 재배치(2026-08-14): Portfolio 바로 다음, Urgency 바로 앞으로 이동했다 —
 * 방문자가 실제 제작 사례(Portfolio)를 본 직후 곧바로 "다른 고객들도 만족했다"는
 * 사회적 증거를 이어붙여 신뢰를 강화한다. background는 기본값(base)을 그대로 유지한다
 * (Portfolio가 elevated로 바뀌어 Review와 자연히 교차된다).
 *
 * 레이아웃/데이터 구조/SSR HTML/Heading 구조는 7A와 완전히 동일하게 유지하며, 이 컴포넌트가
 * 직접 담당하는 애니메이션은 Section Heading의 Fade In(요청사항 ①) 하나뿐이다 — Card/별점/Hover는
 * ReviewCard가 자기 완결적으로 처리한다(Trust EvidenceCard·Difference ComparisonCard와 동일한
 * 책임 분리 원칙).
 *
 * ARCHITECTURE.md 3.1 원칙대로 데이터는 페이지(app/(public)/page.tsx)가 Repository를 통해
 * 조회한 뒤 Props로 전달하며, 이 컴포넌트는 데이터 소스를 모른다.
 */
export function ReviewSection({ reviews }: ReviewSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑥): 애니메이션/ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
      gsap.set(headingEl, { opacity: 1, y: 0 });
      return;
    }

    // Card(y:40)보다 절제된 이동폭 — Heading은 카드보다 먼저·차분하게 떠오르는 느낌을 준다.
    gsap.set(headingEl, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingEl,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(headingEl, { opacity: 1, y: 0, duration: HEADING_ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    }, headingEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="review">
      <Container className="flex flex-col items-center gap-16">
        <div ref={headingRef}>
          <SectionHeading
            align="center"
            title="실제 고객의 솔직한 후기"
            description="코드블루와 함께 만든 결과를, 고객이 직접 이야기합니다."
          />
        </div>
        <ReviewGrid reviews={reviews} />
      </Container>
    </Section>
  );
}
