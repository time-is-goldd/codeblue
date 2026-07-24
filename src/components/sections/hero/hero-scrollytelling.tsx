"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { useLenis } from "@/components/providers/lenis-provider";
import { HeroModelPlaceholder } from "./hero-model-placeholder";
import { HeroCtaGroup } from "./hero-cta-group";
import { ScrollIndicator } from "./scroll-indicator";
import type { HeroSectionProps } from "./hero-section";

/** 지나간 문장이 완전히 사라지지 않고 남겨두는 최소 불투명도 */
const DIM_OPACITY = 0.2;

/**
 * Hero 텍스트 스토리텔링 (모션 허용 사용자) — DEVELOPMENT_PLAN.md Phase 4B.
 *
 * 구조: `<section>`을 뷰포트의 3배 높이(300vh)로 늘려 스크롤 여유 구간을 확보하고,
 * 실제 시각 콘텐츠는 그 안에서 `position: sticky`(CSS)로 한 화면에 고정한다.
 * GSAP의 `pin: true`(Pinning)는 이번 단계에서 금지되어 있으므로 사용하지 않으며,
 * ScrollTrigger는 오직 스크롤 진행률을 읽어 타임라인을 scrub하는 용도로만 쓰인다.
 *
 * 3개 문장(H1 + 두 개의 `<p>`)은 같은 좌표에 절대 위치로 겹쳐 놓고 opacity/y만
 * 애니메이션한다 — 텍스트 위치가 흔들리지 않고 "읽기"에만 집중할 수 있다.
 *
 * `#about`(다음 섹션)의 문서상 위치가 이 섹션의 실제 높이(300vh)만큼 자동으로
 * 밀려나므로, Header/FloatingCTA의 Hero 경계 판정(LayoutScrollProvider)은
 * 코드 수정 없이 이 늘어난 스크롤 구간 전체를 그대로 "Hero 영역"으로 인식한다.
 */
export function HeroScrollytelling({ ctaPrimary, ctaSecondary, riskReversalItems }: HeroSectionProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const sentence1Ref = useRef<HTMLElement>(null);
  const sentence2Ref = useRef<HTMLElement>(null);
  const sentence3Ref = useRef<HTMLElement>(null);
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
      // 초기 숨김 상태는 스크롤에 의해 지연 렌더링되는 scrub 타임라인 내부의 `.set()`이 아니라,
      // 독립적으로 즉시 실행되는 gsap.set()으로 적용한다 — Trust/Difference/Review가 진입 애니메이션
      // 전 상태를 항상 `gsap.set()`으로 먼저 고정하는 것과 동일한 원칙(DEVELOPMENT_PLAN.md Phase
      // 7C). scrub 타임라인에 `.set()`을 넣으면 ScrollTrigger가 "진행률이 0에서 0으로 그대로"라고
      // 판단해 최초 렌더를 건너뛰어(진행률 변화가 없다는 내부 최적화), 스크롤하기 전까지 문장
      // 2·3이 숨겨지지 않고 문장 1과 겹쳐 보이는 문제가 있었다.
      //
      // 이 gsap.set()을 `useEffect`(커밋 후 비동기)가 아니라 `useLayoutEffect`(페인트 전
      // 동기)로 실행하는 이유도 동일한 종류의 문제다 — bridge-section.tsx와 같은 원칙
      // (BridgeSection 주석 참조). 그것만으로는 하이드레이션 전(서버 렌더 HTML이 브라우저에
      // 페인트된 시점 ~ JS가 실행되는 시점 사이)의 깜빡임까지는 못 막으므로, 문장 2·3의 JSX
      // 자체에도 `opacity-0` 클래스를 기본값으로 둔다(아래) — 두 안전장치를 합쳐야 최초 로딩
      // 중 세 문장이 겹쳐 잠깐 보이는 현상이 완전히 사라진다.
      gsap.set([sentence2Ref.current, sentence3Ref.current], { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // 부드러운 진행 — 스크롤과 애니메이션 사이에 약간의 지연을 두어 갑작스러운 전환을 방지
        },
      });

      // 문장 1 → 흐려지며 위로 이동(완전히 사라지지 않음), 동시에 문장 2 등장
      tl.to(sentence1Ref.current, { opacity: DIM_OPACITY, y: -24, duration: 1 }, 0.6)
        .to(sentence2Ref.current, { opacity: 1, y: 0, duration: 1 }, 0.6)
        // Scroll Indicator: 문장 1이 보이는 동안은 유지하고, 문장 2가 등장하기
        // 시작하는 시점(0.6)부터 함께 자연스럽게 사라진다 (요구사항 5)
        .to(indicatorRef.current, { opacity: 0, duration: 1 }, 0.6)
        // 문장 2 → 흐려짐, 문장 3 등장
        .to(sentence2Ref.current, { opacity: DIM_OPACITY, y: -24, duration: 1 }, 2.1)
        .to(sentence3Ref.current, { opacity: 1, y: 0, duration: 1 }, 2.1)
        // Hero 종료 준비: 배경 글로우를 은은하게 낮춰 다음 About 섹션으로의 전환이
        // 갑작스럽지 않고 "마무리되는" 느낌을 준다 (요구사항 8)
        .to(glowRef.current, { opacity: 0.4, duration: 1 }, 2.1);
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

        {/* 진입 모션 — 이번 Phase에서 허용된 유일한 Framer Motion 사용처.
            DEVELOPMENT_PLAN.md Phase 10B(Performance & Core Web Vitals): 원래 opacity도
            0→1로 함께 애니메이션했으나, Framer Motion은 `initial` 값을 SSR 마크업에도 그대로
            반영한다(`style="opacity:0"`) — 이 안의 H1이 Lighthouse가 잡아낸 LCP 요소인데,
            JS가 하이드레이션되어 애니메이션이 시작되기 전까지 화면에 전혀 페인트되지 않아
            LCP가 1.16초 지연되는 실측 병목이었다(baseline: LCP 2.8s, score 0.38). opacity를
            애니메이션에서 빼고 y(위치)/scale만 유지한다 — 둘 다 transform이라 LCP 페인트
            판정에 영향을 주지 않으므로 텍스트는 SSR 즉시 완전히 불투명한 상태로 페인트되면서,
            살짝 아래에서/작게 시작해 제자리로 다가와 안착하는 모션感만 남는다. */}
        <motion.div
          initial={{ y: 14, scale: 0.96 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* gap을 12→8(모바일)/16→10(sm)로 살짝 줄였다 — CRO 재설계로 HeroCtaGroup(버튼 줄 +
              리스크 리버설 캡션)이 추가되면서, 이 컨테이너는 `overflow-hidden`인 h-screen sticky
              박스 안에 있어 세로 여백을 아낄수록 저사양/짧은 뷰포트에서 잘림 위험이 줄어든다. */}
          <Container className="relative flex flex-col items-center gap-8 text-center sm:gap-10">
            {/* 3문장이 같은 자리에 겹쳐 표시되는 스테이지 — 높이를 고정해 레이아웃이 흔들리지 않는다 */}
            <div className="relative min-h-[2.6em] w-full">
              <Heading
                ref={sentence1Ref}
                size="display"
                className="absolute inset-0 flex items-center justify-center text-balance"
              >
                단순히{" "}
                <span className="text-brand-accent whitespace-nowrap">&apos;예쁜&apos;</span> 홈페이지
                제작을 찾으시나요?
              </Heading>

              <Heading
                ref={sentence2Ref}
                as="p"
                size="display"
                // opacity-0: 서버 렌더 HTML 자체에 이미 숨김 상태를 포함시켜, 하이드레이션 전
                // (JS가 아직 gsap.set()을 실행하기 전) 잠깐이라도 문장 1과 겹쳐 보이지 않게 한다.
                className="absolute inset-0 flex items-center justify-center text-balance opacity-0"
              >
                그렇다면 죄송하지만,
                <br />
                다른 홈페이지 제작 업체를 추천드립니다.
              </Heading>

              <Heading
                ref={sentence3Ref}
                as="p"
                size="display"
                className="absolute inset-0 flex items-center justify-center text-balance opacity-0"
              >
                예쁘기만 한 홈페이지는
                <br />
                매출을 만들지 않기 때문입니다.
              </Heading>
            </div>

            <HeroModelPlaceholder />

            <HeroCtaGroup
              ctaPrimary={ctaPrimary}
              ctaSecondary={ctaSecondary}
              riskReversalItems={riskReversalItems}
            />
          </Container>
        </motion.div>

        <div ref={indicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
