import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { HeroModelPlaceholder } from "./hero-model-placeholder";
import { HeroCtaGroup } from "./hero-cta-group";
import { ScrollIndicator } from "./scroll-indicator";
import type { HeroSectionProps } from "./hero-section";

/**
 * Hero의 prefers-reduced-motion 대체 버전 — DEVELOPMENT_PLAN.md Phase 4B.
 * 스크롤 스크러빙(GSAP ScrollTrigger) 없이 2문장(문제 제기 → 해결책)을 한 화면에
 * 순서대로 정적 표시한다. HeroScrollytelling의 200vh 스크롤 여유 구간도 함께 제거해,
 * 모션 감소 사용자가 발생하지도 않는 애니메이션을 위해 불필요하게 더 스크롤하지
 * 않도록 한다.
 */
export function HeroStatic({ ctaPrimary, ctaSecondary, riskReversalItems }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-screen-safe flex-col items-center justify-center overflow-hidden bg-background px-4 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl"
      />

      <Container className="relative flex flex-col items-center gap-8 text-center sm:gap-10">
        {/* text-h1(모바일)/sm:text-display: display 크기로는 375px 폭에서 의도한 2줄이 아니라
            4줄로 깨진다(2026-08-14 실측) — 모바일에서만 한 단계 작은 h1 크기로 줄인다. */}
        <Heading size="display" className="text-balance text-h1 sm:text-display">
          혹시, 홈페이지는 있는데
          <br />
          <span className="text-brand-accent whitespace-nowrap">문의는 오지</span> 않으시나요?
        </Heading>

        <Heading as="p" size="h2" className="text-balance text-brand-text-secondary">
          우리는 방문자가 <span className="text-brand-accent">신뢰</span>하고,{" "}
          <span className="text-brand-accent">문의</span> 버튼을 누르게 만드는 홈페이지를
          설계합니다.
        </Heading>

        <HeroModelPlaceholder />

        <HeroCtaGroup
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
          riskReversalItems={riskReversalItems}
        />
      </Container>

      <ScrollIndicator className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10" />
    </section>
  );
}
