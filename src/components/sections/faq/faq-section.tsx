"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { CTABanner } from "@/components/common/cta-banner";
import { Caption } from "@/components/ui/typography/caption";
import { FaqList } from "./faq-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Cta, Faq } from "@/types";

export interface FaqSectionProps {
  faqs: Faq[];
  /** Repository(`getCtaBySlot("faq-page-bottom")`)가 없으면(비활성/미등록) null — 이 경우
   *  하단 CTA 배너를 그리지 않는다(요청사항 ⑩은 콘텐츠가 실제로 있을 때만 의미가 있다). */
  cta: Cta | null;
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
 */
export function FaqSection({ faqs, cta }: FaqSectionProps) {
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
    <Section id="faq" background="elevated">
      <Container size="narrow" className="flex flex-col items-center gap-16">
        <div ref={rootRef} className="flex w-full flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-3">
            <Caption>대표님들이 가장 많이 궁금해하시는 질문</Caption>
            <SectionHeading
              align="center"
              eyebrow="FAQ"
              title="자주 묻는 질문"
              description="결제를 망설이게 만드는 질문들에 미리 답합니다."
            />
          </div>
          <FaqList faqs={faqs} />
          {cta && (
            <CTABanner
              title={cta.title ?? cta.buttonLabel}
              description={cta.description}
              ctaLabel={cta.buttonLabel}
              ctaHref={cta.buttonHref}
              className="w-full"
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
