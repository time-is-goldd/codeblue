"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { CTABanner } from "@/components/common/cta-banner";
import { Grid } from "@/components/common/grid";
import { PricingCard } from "./pricing-card";
import { PricingValueProof } from "./pricing-value-proof";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Cta, PricingTier, PricingValueProofItem } from "@/types";

export interface PricingSectionProps {
  tiers: PricingTier[];
  valueProofItems: PricingValueProofItem[];
  cta: Cta | null;
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Pricing 섹션 — CRO 재설계(2026-07-23) 신설. DEVELOPMENT_PLAN.md 원안에는 없던 섹션으로,
 * 가격 완전 비공개로 인한 문의 이탈("일단 문의"의 심리적 장벽)을 막기 위해 추가되었다.
 *
 * 배치: Services(구체적으로 무엇을 만들어주는가) 바로 다음, Faq 바로 전. 방문자가 이미
 * Hero→Portfolio→Review→Urgency→Difference→Services를 거치며 신뢰와 관심을 충분히
 * 쌓은 뒤 가격을 마주하게 된다(2026-08-14 메인 콘텐츠 재배치로 Portfolio/Review가 Hero
 * 직후로 이동하면서, 이전에 있던 "Portfolio 직후·Review 직전" 배치는 더 이상 유효하지
 * 않다 — 대신 Portfolio/Review가 이미 최상단에서 실물 증거·사회적 증거를 보여준 뒤라
 * 가격에 대한 신뢰 기반은 이미 마련된 상태로 이 섹션에 도달한다).
 *
 * background="base" — 원래는 elevated였으나 Services(elevated) 바로 다음이 되며 2연속
 * elevated가 되는 것을 피하려고 base로 바꿨다(2026-08-14).
 *
 * `pricing-section-bottom` CTA("제 상황에 맞는 플랜 추천받기")가 이 섹션의 핵심 전환
 * 지점이다 — 3티어 중 하나를 스스로 고르게 하는 대신 상담으로 안내해 결정 피로를
 * 없앤다(PricingCard에 "추천" 배지를 넣지 않는 이유와 동일한 설계 원칙).
 */
export function PricingSection({ tiers, valueProofItems, cta }: PricingSectionProps) {
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
    <Section id="pricing" background="base">
      <Container className="flex flex-col items-center gap-16">
        <div ref={headingRef} className="w-full">
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="예상보다 부담 없는 가격입니다"
            description="어떤 게 맞는지 고르실 필요 없어요. 지금 상황만 말씀해주시면 저희가 골라드립니다."
          />
        </div>

        <Grid cols={{ base: 1, md: 3, lg: 3 }} className="w-full items-start">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.id} tier={tier} index={index} />
          ))}
        </Grid>

        <PricingValueProof items={valueProofItems} />

        {cta && (
          <CTABanner
            title={cta.title ?? cta.buttonLabel}
            description={cta.description}
            ctaLabel={cta.buttonLabel}
            ctaHref={cta.buttonHref}
            className="w-full"
          />
        )}
      </Container>
    </Section>
  );
}
