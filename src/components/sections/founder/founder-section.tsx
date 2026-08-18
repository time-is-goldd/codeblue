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
 * 대표자 소개 섹션 — Review 다음, Difference(남아 있는 차별점) 이전에 배치한다
 * (2026-08-15 신설). 상담부터 배포까지 대표가 직접 진행한다는 메시지로 "왜 코드블루를
 * 선택해야 하는가"의 신뢰 근거를 사람 단위로 한 번 더 보강한다.
 *
 * 배경(elevated): 앞의 Review(base)·뒤의 Difference(base) 사이에서 3개 섹션이 연속으로
 * 같은 톤이 되는 것을 피해 배경 교차 리듬을 유지한다.
 *
 * 사진(2026-08-15): 실제 대표 사진 파일이 아직 준비되지 않아 `FOUNDER_PHOTO_SRC`가
 * `null`이면 존재하지 않는 이미지를 요청하는 대신 자리표시자 UI를 렌더링한다 — 실제
 * 사진이 `lib/constants/founder.ts`에 채워지는 즉시 이 컴포넌트 수정 없이 자동으로
 * 노출된다(이미지 누락/깨진 링크 방지).
 *
 * 반응형: 데스크톱은 사진|소개 2열, 모바일은 사진이 먼저 오고 소개가 이어지는 1열이다 —
 * 사진을 항상 DOM상 먼저 두면 모바일 기본 흐름과 데스크톱 그리드 배치(첫 번째 컬럼)가
 * 별도의 order 유틸 없이 동시에 만족된다.
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
    <Section id="founder" background="elevated">
      <Container className="flex flex-col items-center gap-12">
        <SectionHeading align="center" eyebrow="Founder" title="CodeBlue를 만드는 사람" />

        <div ref={rootRef} className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
          {FOUNDER_PHOTO_SRC ? (
            <ResponsiveImage
              src={FOUNDER_PHOTO_SRC}
              alt="여상현 CodeBlue 대표"
              aspectRatio="portrait"
              fit="cover"
              sizes="(min-width: 1024px) 340px, 80vw"
              className="mx-auto w-full max-w-[340px] rounded-lg"
            />
          ) : (
            <div
              role="img"
              aria-label="여상현 CodeBlue 대표 — 사진 준비 중"
              className={cn(
                GLASS_CARD_CLASS,
                "mx-auto flex aspect-[3/4] w-full max-w-[340px] items-center justify-center rounded-lg border-dashed",
              )}
            >
              <Text size="sm" color="tertiary">
                대표 사진 준비 중
              </Text>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <div className="flex flex-col items-center gap-1 lg:items-start">
              <Heading as="h3" size="h3">
                여상현
              </Heading>
              <Text size="base" color="tertiary">
                CodeBlue 대표 · 기획 및 개발 담당
              </Text>
            </div>

            <div className="flex flex-col gap-3">
              <Text size="lg" color="primary" className="leading-relaxed">
                상담부터 기획, 디자인, 개발, 배포까지 대표가 직접 진행합니다.
              </Text>
              <Text size="base" color="secondary" className="leading-relaxed">
                외주업체와 영업 담당자를 거치지 않아 요청사항을 빠르고 정확하게 반영합니다.
              </Text>
            </div>

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
