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
 * 구조: `<section>`을 뷰포트의 2배 높이(200vh)로 늘려 스크롤 여유 구간을 확보하고,
 * 실제 시각 콘텐츠는 그 안에서 `position: sticky`(CSS)로 한 화면에 고정한다.
 * GSAP의 `pin: true`(Pinning)는 이번 단계에서 금지되어 있으므로 사용하지 않으며,
 * ScrollTrigger는 오직 스크롤 진행률을 읽어 타임라인을 scrub하는 용도로만 쓰인다.
 *
 * 2개 문장(문제 제기 → 해결책)은 각각 "절대 위치+중앙 정렬용 wrapper `<div>`" 안에 실제
 * 텍스트(H1 + `<p>`)를 담아 같은 좌표에 겹쳐 놓고, wrapper의 opacity/y만 애니메이션한다 —
 * 텍스트 위치가 흔들리지 않고 "읽기"에만 집중할 수 있다. `flex`(절대 위치+중앙 정렬)는
 * 반드시 텍스트가 없는 wrapper에만 걸어야 한다 — Heading 자신에게 걸면 `display:flex`가
 * 텍스트/`<span>` 자식을 각각 별도 flex item으로 쪼개 모바일 좁은 폭에서 글자가 세로로
 * 흩어지는 버그가 있었다(2026-07-25 실측 수정, 아래 JSX 주석 참고).
 *
 * `#about`(다음 섹션)의 문서상 위치가 이 섹션의 실제 높이(200vh)만큼 자동으로
 * 밀려나므로, Header/FloatingCTA의 Hero 경계 판정(LayoutScrollProvider)은
 * 코드 수정 없이 이 늘어난 스크롤 구간 전체를 그대로 "Hero 영역"으로 인식한다.
 */
export function HeroScrollytelling({ ctaPrimary, ctaSecondary, riskReversalItems }: HeroSectionProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  // 모바일 레이아웃 버그 수정(2026-07-25)으로 각 ref가 이제 Heading이 아니라 그걸 감싸는
  // <div> wrapper를 가리킨다 — 타입도 함께 HTMLDivElement로 맞춘다.
  const sentence1Ref = useRef<HTMLDivElement>(null);
  const sentence2Ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Lenis(활성 시)의 스크롤 틱마다 ScrollTrigger를 갱신해 scrub이 어긋나지 않게 한다
  // (ANIMATION_PLAN.md 3.3 — Lenis+ScrollTrigger 연동 주의사항).
  useLenis(() => {
    ScrollTrigger.update();
  });

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const s1 = sentence1Ref.current;
    const s2 = sentence2Ref.current;
    const stage = stageRef.current;
    if (!s1 || !s2 || !stage) return;

    const ctx = gsap.context(() => {
      // 모바일 텍스트 겹침 버그(2026-08-14) 근본 원인: 두 문장이 같은 좌표에 절대 위치로
      // 겹쳐 있는 상태에서, 문장 1의 퇴장 오프셋이 고정 -24px였다 — 문장 1(문제 제기, 이제
      // 3줄)과 문장 2(해결책)가 데스크톱 넓은 폭에서는 우연히 서로 안 겹칠 만큼 짧게
      // 보였지만, 모바일처럼 줄바꿈이 많아져 텍스트 블록이 세로로 길어지는 환경에서는
      // -24px로는 전혀 벗어나지 못해 두 텍스트가 그대로 포개졌다. 폰트 크기를 더 줄이는
      // 대신, 실제 렌더된 높이를 측정해 "문장 1이 자기 높이만큼 완전히 위로 벗어나야
      // 문장 2와 절대 겹치지 않는다"는 조건을 항상 만족시키도록 오프셋을 계산한다 —
      // 어떤 뷰포트/줄 수에서도 구조적으로 겹칠 수 없다.
      //
      // 주의: s1/s2(sentence1Ref/sentence2Ref)는 `absolute inset-0`로 스테이지 전체를
      // 꽉 채우도록 늘어난 wrapper <div>다 — 이 wrapper 자신의 offsetHeight는 실제 텍스트
      // 높이가 아니라 항상 스테이지 높이와 같다(실측 시도 중 발견한 버그: 이 값을 그대로
      // 쓰면 exitDistance가 텍스트 실제 높이가 아니라 스테이지의 기존 폴백 높이를 기준으로
      // 계산되어 여전히 부족했다). 반드시 그 안의 실제 텍스트 요소(Heading이 렌더링한
      // h1/p)를 querySelector로 찾아 측정해야 한다.
      const s1Text = s1.querySelector("h1, p") as HTMLElement | null;
      const s2Text = s2.querySelector("h1, p") as HTMLElement | null;
      const s1Height = s1Text?.offsetHeight ?? s1.offsetHeight;
      const s2Height = s2Text?.offsetHeight ?? s2.offsetHeight;
      // 두 문장 모두 스테이지 중앙(C)에 겹쳐 있다 — 문장 1을 위로 옮긴 만큼(exitDistance)
      // 그 아래쪽 경계(C + h1/2 - exitDistance)가 문장 2의 위쪽 경계(C - h2/2)보다 높이
      // 있어야 절대 겹치지 않는다 → exitDistance ≥ (h1+h2)/2. h1만 기준으로 삼으면 문장 2가
      // 더 길 때(예: 모바일에서 해결책 문장이 더 많이 줄바꿈될 때) 부족할 수 있어 h1/h2
      // 평균을 쓴다.
      const exitDistance = (s1Height + s2Height) / 2 + 16;

      // 스테이지 높이: 기존 `min-h-[2.6em]`은 이 div 자신이 상속한(훨씬 작은) 기본 본문
      // 폰트 크기를 기준으로 계산되어 실제 콘텐츠(Heading의 훨씬 큰 폰트)와 무관한 값이었다
      // — 두 문장 중 더 큰 실측 높이에 맞춰 반응형으로 다시 예약해, 아래 HeroModelPlaceholder/
      // CTA가 항상 일관된 간격을 두고 배치되게 한다.
      stage.style.minHeight = `${Math.max(s1Height, s2Height)}px`;

      // 초기 숨김 상태는 스크롤에 의해 지연 렌더링되는 scrub 타임라인 내부의 `.set()`이 아니라,
      // 독립적으로 즉시 실행되는 gsap.set()으로 적용한다 — Trust/Difference/Review가 진입 애니메이션
      // 전 상태를 항상 `gsap.set()`으로 먼저 고정하는 것과 동일한 원칙(DEVELOPMENT_PLAN.md Phase
      // 7C). scrub 타임라인에 `.set()`을 넣으면 ScrollTrigger가 "진행률이 0에서 0으로 그대로"라고
      // 판단해 최초 렌더를 건너뛰어(진행률 변화가 없다는 내부 최적화), 스크롤하기 전까지 문장
      // 2가 숨겨지지 않고 문장 1과 겹쳐 보이는 문제가 있었다.
      //
      // 이 gsap.set()을 `useEffect`(커밋 후 비동기)가 아니라 `useLayoutEffect`(페인트 전
      // 동기)로 실행하는 이유도 동일한 종류의 문제다 — urgency-section.tsx 등 다른 섹션과
      // 같은 원칙. 그것만으로는 하이드레이션 전(서버 렌더 HTML이 브라우저에
      // 페인트된 시점 ~ JS가 실행되는 시점 사이)의 깜빡임까지는 못 막으므로, 문장 2의 JSX
      // 자체에도 `opacity-0` 클래스를 기본값으로 둔다(아래) — 두 안전장치를 합쳐야 최초 로딩
      // 중 두 문장이 겹쳐 잠깐 보이는 현상이 완전히 사라진다.
      gsap.set(s2, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // 부드러운 진행 — 스크롤과 애니메이션 사이에 약간의 지연을 두어 갑작스러운 전환을 방지
        },
      });

      const EXIT_DURATION = 0.6;
      const ENTER_START = 0.5 + EXIT_DURATION; // 문장 1의 퇴장 트윈이 "완전히 끝난 뒤" 시작

      // 문장 1(문제 제기) → 흐려지며 자기 높이만큼 위로 완전히 벗어남(겹침 공간적으로 방지).
      // 겹침은 공간(위치)뿐 아니라 시간(타이밍)에서도 생길 수 있다 — 이전 버전은 문장 2
      // 진입을 문장 1 퇴장보다 0.15만 늦게 시작해, 두 트윈이 동시에 진행되는 구간(둘 다
      // 중간 불투명도로 겹쳐 보이는 구간)이 그대로 남아 있었다(2026-08-14 실측 재현 —
      // Desktop에서도 크로스페이드 중간 지점에 두 문장이 겹치는 프레임 확인). 문장 2 진입을
      // 문장 1 퇴장이 "완전히 끝나는 시점"(ENTER_START)부터 시작시켜 두 트윈의 활성 구간이
      // 시간상 아예 겹치지 않게 한다 — 문장 1이 다 빠져나가 정지한 뒤에야 문장 2가
      // 나타나므로, 어떤 스크롤 위치에서도 두 문장이 동시에 눈에 띄는 불투명도로 겹치는
      // 순간 자체가 없다.
      tl.to(s1, { opacity: DIM_OPACITY, y: -exitDistance, duration: EXIT_DURATION }, 0.5)
        .to(s2, { opacity: 1, y: 0, duration: EXIT_DURATION }, ENTER_START)
        // Scroll Indicator: 문장 1이 보이는 동안은 유지하고, 문장 1이 빠져나가기
        // 시작하는 시점(0.5)부터 함께 자연스럽게 사라진다 (요구사항 5)
        .to(indicatorRef.current, { opacity: 0, duration: EXIT_DURATION }, 0.5)
        // Hero 종료 준비: 배경 글로우를 은은하게 낮춰 다음 섹션으로의 전환이
        // 갑작스럽지 않고 "마무리되는" 느낌을 준다 (요구사항 8)
        .to(glowRef.current, { opacity: 0.4, duration: EXIT_DURATION }, ENTER_START);
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
            {/* 2문장이 같은 자리에 겹쳐 표시되는 스테이지 — 실제 렌더 높이를 측정해(useLayoutEffect)
                레이아웃이 흔들리지 않게 예약한다(JS 이전 SSR 폴백은 아래 className의 반응형 min-h).
                모바일 레이아웃 버그 수정(2026-07-25): 예전에는 `flex items-center justify-center`를
                Heading(텍스트를 직접 담는 요소) 자신에게 걸었다 — `display:flex`가 걸린 요소의
                "텍스트 노드 + <span>이 섞인 자식"은 CSS상 각각 독립된 익명 flex item으로
                쪼개진다(스펙: 연속된 텍스트 런마다, 그리고 각 엘리먼트마다 별도 flex item 생성).
                데스크톱처럼 폭이 넉넉하면 세 조각이 shrink 없이 한 줄에 나란히 앉아 정상처럼
                보이지만, 모바일 폭에서는 각 조각이 강제로 줄어들며 "단/순/히"처럼 각자 따로
                줄바꿈되어 실측 스크린샷과 동일하게 글자가 세로로 흩어졌다. 고정 폭에서만
                재현되고 폰트 크기와는 무관한 문제라 font-size를 줄이는 방식으로는 해결되지
                않는다 — 대신 `flex`(절대 위치+중앙 정렬)를 텍스트가 없는 별도 wrapper로
                옮기고, 실제 텍스트는 flex가 걸리지 않은 일반 블록 요소(Heading) 하나로만
                감싸 정상적인 단락 줄바꿈(그리고 text-balance)이 적용되게 했다. */}
            <div ref={stageRef} className="relative min-h-[8rem] w-full sm:min-h-[7rem] md:min-h-[6.5rem]">
              <div ref={sentence1Ref} className="absolute inset-0 flex items-center justify-center">
                {/* text-h1(모바일)/sm:text-display: display 크기(clamp 최소 40px)로는 이 문장이
                    375px 폭에서 의도한 줄바꿈이 아니라 훨씬 더 많은 줄로 깨진다(2026-08-14 실측)
                    — 모바일에서만 한 단계 작은 h1 크기로 줄여 의도한 줄바꿈(<br/>)이 유지되게 한다. */}
                <Heading size="display" className="text-center text-balance text-h1 sm:text-display">
                  혹시,
                  <br />
                  홈페이지는 있는데
                  <br />
                  <span className="text-brand-accent whitespace-nowrap">문의는 오지</span> 않으시나요?
                </Heading>
              </div>

              {/* opacity-0: 서버 렌더 HTML 자체에 이미 숨김 상태를 포함시켜, 하이드레이션 전
                  (JS가 아직 gsap.set()을 실행하기 전) 잠깐이라도 문장 1과 겹쳐 보이지 않게 한다.
                  문장 1(문제 제기)보다 낮은 시각적 위계(h2 + secondary 컬러)로 "해결책" 답변임을
                  드러낸다 — HeroStatic과 동일한 위계 원칙. */}
              <div
                ref={sentence2Ref}
                className="absolute inset-0 flex items-center justify-center opacity-0"
              >
                <Heading as="p" size="h2" className="text-center text-balance text-brand-text-secondary">
                  우리는 방문자가 <span className="text-brand-accent">신뢰</span>하고,
                  <br />
                  문의 버튼을 누르게 만드는 홈페이지를 설계합니다.
                </Heading>
              </div>
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
