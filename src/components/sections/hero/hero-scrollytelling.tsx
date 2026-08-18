"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { useLenis } from "@/components/providers/lenis-provider";
import { HeroModelPlaceholder } from "./hero-model-placeholder";
import { HeroCtaGroup } from "./hero-cta-group";
import { ScrollIndicator } from "./scroll-indicator";
import type { HeroSectionProps } from "./hero-section";

/**
 * Hero 배경 장식(스크롤 연출, 모션 허용 사용자) — 카피 전면 개편(2026-08-15).
 *
 * 이전에는 "문제 제기 → 해결책" 두 문장을 스크롤 진행률에 맞춰 크로스페이드시키는
 * 스토리텔링 구조였다. 이제 Eyebrow/H1(두 줄)/보조 문구/CTA는 HeroStatic과 완전히 동일한
 * 정적 콘텐츠로, 접속 즉시 완전히 불투명한 상태로 페인트된다 — "메인 메시지를 확인하기
 * 위해 스크롤해야 하는 구조를 만들지 않는다"는 요구사항 때문에 텍스트 크로스페이드
 * 자체를 제거했다. 스크롤에 반응하는 요소는 배경 글로우 페이드/스크롤 인디케이터 숨김
 * 같은 순수 장식 효과로만 제한된다.
 *
 * `<section>`의 스크롤 여유 구간(`h-scroll-runway-safe`, globals.css)도 기존 200vh에서
 * 약 130vh로 축소했다 — 텍스트가 더 이상 스크롤에 맞춰 등장/퇴장하지 않으므로 예전만큼
 * 넓은 스크럽 구간이 필요 없고, Hero를 지나치게 길게 만들어 다음 섹션(Portfolio)까지
 * 도달하는 데 불필요한 스크롤을 요구하지 않기 위함이다. 실제 시각 콘텐츠는 그 안에서
 * `position: sticky`(CSS)로 한 화면에 고정되고, GSAP ScrollTrigger는 이 여유 구간 동안
 * 배경 글로우/인디케이터의 장식적 페이드만 scrub한다 — Pinning(`pin: true`)은 사용하지
 * 않는다.
 */
export function HeroScrollytelling({ ctaPrimary, ctaSecondary }: HeroSectionProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Lenis(활성 시)의 스크롤 틱마다 ScrollTrigger를 갱신해 scrub이 어긋나지 않게 한다
  // (ANIMATION_PLAN.md 3.3 — Lenis+ScrollTrigger 연동 주의사항).
  useLenis(() => {
    ScrollTrigger.update();
  });

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // 부드러운 진행 — 스크롤과 애니메이션 사이에 약간의 지연을 두어 갑작스러운 전환을 방지
        },
      });

      // 장식 효과만 scrub한다 — 텍스트/CTA는 애니메이션 대상이 아니다.
      tl.to(indicatorRef.current, { opacity: 0, duration: 0.3 }, 0).to(
        glowRef.current,
        { opacity: 0.3, duration: 0.6 },
        0.2,
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" aria-label="Hero" ref={wrapperRef} className="relative h-scroll-runway-safe">
      <div className="sticky top-0 flex h-screen-safe flex-col items-center justify-center overflow-hidden bg-background px-4">
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl"
        />

        {/* 진입 모션 — y(위치)/scale만 애니메이션하고 opacity는 건드리지 않는다
            (DEVELOPMENT_PLAN.md Phase 10B 실측 LCP 수정 원칙 유지: opacity를 0에서
            시작하면 SSR 마크업에도 `style="opacity:0"`이 반영되어 하이드레이션 전까지
            LCP 요소인 H1이 전혀 페인트되지 않는다). 텍스트는 SSR 즉시 완전히 불투명한
            상태로 페인트되면서, 살짝 아래에서/작게 시작해 제자리로 다가와 안착하는
            모션感만 남는다. */}
        <motion.div
          initial={{ y: 14, scale: 0.96 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Container className="relative flex flex-col items-center gap-3 text-center sm:gap-4">
            <Eyebrow>소상공인·기업 맞춤 홈페이지 제작</Eyebrow>

            {/* text-[1.7rem]/sm:text-h1/lg:text-display: HeroStatic과 동일한 이유(375~390px
                폭에서 text-h1만으로는 2번째 줄이 3줄로 깨짐)로 모바일 전용 축소 크기를 쓴다. */}
            <Heading as="h1" size="display" className="text-balance text-[1.7rem] sm:text-h1 lg:text-display">
              검색한 고객은,
              <br />
              홈페이지에서 결정합니다.
            </Heading>

            <Heading as="p" size="h2" className="text-balance text-[1.35rem] sm:text-h2 text-brand-text-secondary">
              홈페이지가 없다면 만들고,
              <br />
              있어도 문의가 없다면 바꿉니다.
            </Heading>

            <HeroModelPlaceholder />

            <HeroCtaGroup ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} />
          </Container>
        </motion.div>

        <div ref={indicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
