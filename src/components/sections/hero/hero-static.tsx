import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { HeroModelPlaceholder } from "./hero-model-placeholder";
import { HeroCtaGroup } from "./hero-cta-group";
import { ScrollIndicator } from "./scroll-indicator";
import type { HeroSectionProps } from "./hero-section";

/**
 * Hero의 prefers-reduced-motion 대체 버전 — DEVELOPMENT_PLAN.md Phase 4B.
 * 스크롤 스크러빙(GSAP ScrollTrigger) 없이 3문장을 한 화면에 순서대로 정적 표시한다.
 * HeroScrollytelling의 300vh 스크롤 여유 구간도 함께 제거해, 모션 감소 사용자가
 * 발생하지도 않는 애니메이션을 위해 불필요하게 더 스크롤하지 않도록 한다.
 */
export function HeroStatic({ ctaPrimary, ctaSecondary, riskReversalItems }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl"
      />

      <Container className="relative flex flex-col items-center gap-8 text-center sm:gap-10">
        <Heading size="display" className="text-balance">
          단순히{" "}
          <span className="text-brand-accent whitespace-nowrap">&apos;예쁜&apos;</span> 홈페이지
          제작을 찾으시나요?
        </Heading>

        <Heading as="p" size="h2" className="text-balance text-brand-text-secondary">
          그렇다면 죄송하지만, 다른 홈페이지 제작 업체를 추천드립니다.
        </Heading>

        <Heading as="p" size="h2" className="text-balance text-brand-text-secondary">
          예쁘기만 한 홈페이지는 매출을 만들지 않기 때문입니다.
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
