"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { FaqList } from "./faq-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Faq } from "@/types";

export interface FaqSectionProps {
  faqs: Faq[];
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * 구매 직전 고객의 불안과 반론을 제거하는 FAQ 섹션 —
 * DEVELOPMENT_PLAN.md Phase 8A(Foundation) + 8B(Animation & UX), WIREFRAME.md 참조.
 *
 * Repository/Type/Server Component 구조와 레이아웃(Section + Container + SectionHeading +
 * Accordion)은 8A와 완전히 동일하게 유지한다. ARCHITECTURE.md 3.1 원칙대로 데이터는
 * 페이지(app/(public)/page.tsx)가 Repository를 통해 조회한 뒤 Props로 전달하며, 이 컴포넌트는
 * 데이터 소스를 모른다 — 하단 CTA(요청사항 ⑫)도 `getCtaBySlot("faq-page-bottom")` 조회 결과를
 * `cta` prop으로 그대로 받아 `CTABanner`(서브페이지 하단 CTA와 동일 컴포넌트)에 위임한다.
 *
 * 애니메이션 책임 분리(ANIMATION_PLAN.md 1장, Difference DifferenceSection과 동일한 2단 구조):
 * 이 컴포넌트는 "SectionHeading + Accordion 전체" 블록 하나를 opacity/y로 진입시키는
 * ScrollTrigger 하나만 직접 담당한다(요청사항 ①). 개별 FAQ 문항의 stagger 등장(요청사항 ②)은
 * FaqList가, Hover/아이콘 회전/열기·닫기 트랜지션(요청사항 ③~⑤)은 각각 accordion.tsx/
 * FaqItem이 자기 완결적으로 처리한다.
 *
 * FAQPage JSON-LD는 이번 단계에서 구현하지 않는다(다음 SEO 단계에서 추가).
 *
 * 축약(2026-08-19, 홈페이지 길이 정리): 상단 보조 문구("대표님들이 가장 많이
 * 궁금해하시는 질문", `Caption`)와 `SectionHeading`의 `description`("결제를 망설이게
 * 만드는 질문들에 미리 답합니다.")을 삭제해 Eyebrow/H2만 남겼다. 하단의 대형 CTA
 * 카드(`CTABanner`, `cta-003`/"faq-page-bottom" 슬롯)도 삭제했다 — FAQ 바로 다음
 * 섹션이 Contact이므로 같은 목적의 CTA가 중복된다. `cta` prop 자체를 없앴으므로
 * `app/(public)/page.tsx`도 `getCtaBySlot("faq-page-bottom")` 호출과 함께 정리했다.
 */
export function FaqSection({ faqs }: FaqSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    if (prefersReducedMotion) {
      // 접근성(요청사항 ⑥): ScrollTrigger를 생성하지 않고 최종 상태만 즉시 출력.
      gsap.set(rootEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(rootEl, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootEl,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(rootEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    }, rootEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="faq" background="elevated" spacing="comfortable">
      <Container size="narrow" className="flex flex-col items-center gap-16">
        <div ref={rootRef} className="flex w-full flex-col items-center gap-16">
          <SectionHeading align="center" eyebrow="FAQ" title="자주 묻는 질문" />
          <FaqList faqs={faqs} />
        </div>
      </Container>
    </Section>
  );
}
