import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { HeroModelPlaceholder } from "./hero-model-placeholder";
import { HeroCtaGroup } from "./hero-cta-group";
import { ScrollIndicator } from "./scroll-indicator";
import type { HeroSectionProps } from "./hero-section";

/**
 * Hero의 prefers-reduced-motion 대체 버전.
 * 스크롤 스크러빙(GSAP ScrollTrigger) 없이 Eyebrow/H1(두 줄)/보조 문구/CTA를 접속 즉시
 * 한 화면에 전부 표시한다. HeroScrollytelling과 동일한 카피를 공유하되, 배경 장식
 * 애니메이션도 전혀 사용하지 않는다(모션 감소 사용자 대응).
 */
export function HeroStatic({ ctaPrimary, ctaSecondary }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-screen-safe flex-col items-center justify-center overflow-hidden bg-background px-4 py-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl"
      />

      <Container className="relative flex flex-col items-center gap-3 text-center sm:gap-4">
        <Eyebrow>소상공인·기업 맞춤 홈페이지 제작</Eyebrow>

        {/* text-[1.7rem]/sm:text-h1/lg:text-display: 2번째 줄("홈페이지에서 결정합니다.")이
            text-h1(clamp 최소 32px)만으로도 375~390px 폭에서 의도한 두 줄이 아니라 3줄로
            깨진다(2026-08-15 실측) — 모바일 전용으로 한 단계 더 작은 고정 크기를 쓴다. */}
        <Heading as="h1" size="display" className="text-balance text-[1.7rem] sm:text-h1 lg:text-display">
          검색한 고객은,
          <br />
          홈페이지에서 결정합니다.
        </Heading>

        {/* text-[1.35rem]/sm:text-h2: 2번째 줄("있어도 문의가 없다면 바꿉니다.")이 text-h2(clamp
            최소 28px)로는 같은 이유로 375~390px 폭에서 3줄로 깨진다 — 위 H1과 동일한 원칙. */}
        <Heading as="p" size="h2" className="text-balance text-[1.35rem] sm:text-h2 text-brand-text-secondary">
          홈페이지가 없다면 만들고,
          <br />
          있어도 문의가 없다면 바꿉니다.
        </Heading>

        <HeroModelPlaceholder />

        <HeroCtaGroup ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} />
      </Container>

      <ScrollIndicator className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10" />
    </section>
  );
}
