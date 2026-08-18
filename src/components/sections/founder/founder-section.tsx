"use client";

import { useLayoutEffect, useRef } from "react";
import { MailIcon } from "lucide-react";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { FOUNDER_PHOTO_SRC } from "@/lib/constants/founder";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FOUNDER_EMAIL = "yeo090110@gmail.com";
const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * 대표자 소개 섹션 — Review 다음, Difference(안심 제작 원칙) 이전에 배치한다
 * (2026-08-15 신설).
 *
 * 배경(elevated): 앞의 Review(base)·뒤의 Difference(base) 사이에서 3개 섹션이 연속으로
 * 같은 톤이 되는 것을 피해 배경 교차 리듬을 유지한다.
 *
 * 사진(2026-08-15): 실제 대표 사진 파일이 아직 준비되지 않아 `FOUNDER_PHOTO_SRC`가
 * `null`이면 존재하지 않는 이미지를 요청하는 대신 자리표시자 UI를 대신 렌더링한다 — 실제
 * 사진이 `lib/constants/founder.ts`에 채워지는 즉시 이 컴포넌트 수정 없이 자동으로
 * 노출된다(이미지 누락/깨진 링크 방지). 2026-08-18부터 실제 사진이 채워져 있다.
 *
 * 문구 정리(2026-08-19): 제목을 "상담부터 배포까지, 대표가 직접 진행합니다."로 바꾸고,
 * 기존 두 문장(진행 범위 + 외주업체를 거치지 않는다는 설명)을 한 문장
 * ("기획·디자인·개발·배포를 직접 맡아 요청사항을 빠르고 정확하게 반영합니다.")으로
 * 합쳤다 — 제목이 이미 "누가·무엇을" 전달하므로 본문은 그 근거만 짧게 보탠다.
 *
 * PC 레이아웃 개편(2026-08-19): 기존 `[minmax(0,340px)_1fr]` + 기본 Container(1280px)
 * 조합은 넓은 화면에서 이미지 열이 왼쪽에 치우치고 텍스트 열 오른쪽에 큰 빈 공간이
 * 남는 불균형이 있었다. Container 자체를 `max-w-[1150px]`로 좁히고, 그리드를 요청받은
 * `360px minmax(0,1fr)`(이미지 고정 360px + 텍스트 나머지)로 바꾸며, 컬럼 간격을
 * `lg:gap-x-20`(80px)로 넓혔다. 텍스트 열에는 가독성을 위해 `max-w-[640px]`을 얹어
 * 710px 안팎으로 넓어진 텍스트 열에서 줄 길이가 과도하게 늘어지지 않게 한다. 모바일/
 * 태블릿은 기존과 동일하게 `grid-cols-1`로 세로 스택되고, 이미지는 `max-w-[340px]`
 * (320~360px 범위)로 중앙 정렬된다 — 이 범위는 이번 개편에서 건드리지 않았다.
 */
export function FounderSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    if (prefersReducedMotion) {
      gsap.set(rootEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(rootEl, { opacity: 0, y: 32 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(rootEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    }, rootEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="founder" background="elevated" spacing="comfortable">
      <Container className="flex max-w-[1150px] flex-col items-center gap-12">
        <SectionHeading align="center" eyebrow="Founder" title="상담부터 배포까지, 대표가 직접 진행합니다." />

        <div
          ref={rootRef}
          className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-x-20"
        >
          {FOUNDER_PHOTO_SRC ? (
            <ResponsiveImage
              src={FOUNDER_PHOTO_SRC}
              alt="여상현 CodeBlue 대표"
              aspectRatio="portrait"
              fit="cover"
              sizes="(min-width: 1024px) 360px, 80vw"
              className="mx-auto w-full max-w-[340px] rounded-lg lg:max-w-none"
            />
          ) : (
            <div
              role="img"
              aria-label="여상현 CodeBlue 대표 — 사진 준비 중"
              className={cn(
                GLASS_CARD_CLASS,
                "mx-auto flex aspect-[3/4] w-full max-w-[340px] items-center justify-center rounded-lg border-dashed lg:max-w-none",
              )}
            >
              <Text size="sm" color="tertiary">
                대표 사진 준비 중
              </Text>
            </div>
          )}

          <div className="flex max-w-[640px] flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <div className="flex flex-col items-center gap-1 lg:items-start">
              <Heading as="h3" size="h3">
                여상현
              </Heading>
              <Text size="base" color="tertiary">
                CodeBlue 대표 · 기획 및 개발
              </Text>
            </div>

            <Text size="lg" color="primary" className="leading-relaxed">
              기획·디자인·개발·배포를 직접 맡아 요청사항을 빠르고 정확하게 반영합니다.
            </Text>

            <a
              href={`mailto:${FOUNDER_EMAIL}`}
              onClick={() => trackEvent("email_click", { location: "founder_section" })}
              className="inline-flex items-center gap-2 text-body-sm text-brand-text-secondary hover:text-brand-accent"
            >
              <MailIcon aria-hidden className="size-icon-sm" />
              {FOUNDER_EMAIL}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
