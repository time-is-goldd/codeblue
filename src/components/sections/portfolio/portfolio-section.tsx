"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { PortfolioCard } from "./portfolio-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Portfolio } from "@/types";

export interface PortfolioSectionProps {
  portfolios: Portfolio[];
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Portfolio 홈 미리보기 — DEVELOPMENT_PLAN.md Phase 8(원안에는 있었으나 미구현이었다가
 * CRO 재설계 2026-07-23에 실제 구현). Hero의 보조 CTA("제작 과정 보러가기")가
 * `#portfolio`로 연결되는 목적지이기도 하다.
 *
 * 메인 콘텐츠 재배치(2026-08-14): Hero 바로 다음, Review 바로 앞으로 이동했다 —
 * 방문자가 Hero의 후킹 메시지를 본 직후 "그래서 실제로 어떤 홈페이지를 만들었는데?"에
 * 곧바로 답하도록, 실물 증거(Before→After)를 최상단으로 끌어올린다. 상세 페이지
 * (`/portfolio/[slug]`)는 2차 확장 범위로 보류.
 *
 * background="elevated": Hero(bg-background, base와 동일 톤) 바로 다음 섹션이 되면서
 * 2연속 base를 피하려고 base→elevated로 바꿨다(이전엔 Services 바로 다음이라 base였다).
 *
 * UI Polish(2026-07-23): 카드가 2열 Grid에서 1열 전체 폭으로 바뀌며 이 컴포넌트는 더
 * 이상 컬럼 그리드가 필요 없다 — 세로로 쌓이는 단순 flex 스택이면 충분하다(카드 내부의
 * 좌우 분할은 PortfolioCard 자신이 담당한다).
 */
export function PortfolioSection({ portfolios }: PortfolioSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    if (prefersReducedMotion) {
      gsap.set(headingEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(headingEl, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(headingEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="portfolio" background="elevated">
      <Container className="flex flex-col items-center gap-16">
        <div ref={headingRef} className="w-full">
          <SectionHeading align="center" eyebrow="Portfolio" title="실제로 이렇게 만들어드립니다" />
        </div>

        <div className="flex w-full flex-col gap-8 lg:gap-10">
          {portfolios.map((portfolio, index) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
