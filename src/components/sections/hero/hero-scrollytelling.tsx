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
      {/* pt-20 sm:pt-0: 모바일 전용 상단 여백 — 고정 Header 높이는 `<main>`의
          padding-top(HEADER_HEIGHT+safe-area)에서 이미 보정되므로, 이 padding은
          "Header 바로 아래 붙어 보이지 않도록" 추가하는 순수 여유 공간이다. 별도의 빈
          div를 두지 않고 이 컨테이너 자체의 padding-top + 기존 bg-background를 그대로
          쓰기 때문에 하이드레이션 전에도 항상 검은색으로 채워진다. sm: 이상(태블릿/PC)은
          기존과 동일하게 0으로 되돌려 PC 상단 여백은 변경하지 않는다. */}
      <div className="sticky top-0 flex h-screen-safe flex-col items-center justify-center overflow-hidden bg-background px-4 pt-20 sm:pt-0">
        {/* top-0(모바일)/sm:top-1/2(PC): 글로우의 중심을 모바일에서만 컨테이너 맨 위
            가장자리(y=0)로 옮긴다 — `-translate-y-1/2`는 그대로 유지하므로 글로우
            원의 중심이 화면 최상단에 오고, 원 절반(위쪽)이 Header 뒤 검게 보이던
            영역까지 번져 화면 최상단부터 파란 글로우가 자연스럽게 이어진다. 새로운
            색상이 아니라 기존 `bg-brand-accent/10` 글로우를 그대로 재배치한 것뿐이다.
            sm: 이상(PC)은 기존과 동일하게 중앙에 위치한다. */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl sm:top-1/2"
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

            {/* 모바일 H1 확대(2026-08-20): 기존 고정 1.7rem(27.2px)은 가독성이 부족하다는
                피드백에 따라 clamp(2.5rem,2.1rem+2vw,2.75rem)(360~390px 기준 약 41~42px,
                최대 44px)로 키웠다. break-keep(word-break: keep-all)으로 한글이 음절
                단위로 끊기지 않게 한다.
                줄 간격 재조정(2026-08-21): 모바일은 겹침 방지용 1.08에서 1.24로
                넓혔다(요청 범위 1.22~1.28). PC(sm:/lg:)도 기존 1.15가 다소 좁아
                보인다는 피드백을 받아 1.2로 살짝 넓혔다 — 폰트 크기·자간·줄바꿈
                위치·PC 구성은 그대로 두고 줄 간격만 조정했다. */}
            <Heading
              as="h1"
              size="display"
              className="text-balance break-keep text-[clamp(2.5rem,2.1rem+2vw,2.75rem)] leading-[1.24] sm:text-h1 sm:leading-[1.2] lg:text-display"
            >
              검색한 고객은,
              <br />
              홈페이지에서 결정합니다
            </Heading>

            <Heading as="p" size="h2" className="text-balance text-[1.35rem] sm:text-h2 text-brand-text-secondary">
              홈페이지가 없다면 만들고,
              <br />
              있어도 문의가 없다면 바꿉니다
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
