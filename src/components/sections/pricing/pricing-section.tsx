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
import { PricingCommonInclusions } from "./pricing-common-inclusions";
import { PricingAddOns } from "./pricing-addons";
import { PricingRevisionPolicy } from "./pricing-revision-policy";
import { PortfolioPartnerCard } from "./portfolio-partner-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type {
  Cta,
  PortfolioPartnerProgram,
  PricingAddOnItem,
  PricingCommonInclusionItem,
  PricingTier,
  PricingValueProofItem,
} from "@/types";

export interface PricingSectionProps {
  tiers: PricingTier[];
  valueProofItems: PricingValueProofItem[];
  commonInclusions: PricingCommonInclusionItem[];
  addOns: PricingAddOnItem[];
  cta: Cta | null;
  portfolioPartnerProgram: PortfolioPartnerProgram;
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Pricing 섹션 — CRO 재설계(2026-07-23) 신설. DEVELOPMENT_PLAN.md 원안에는 없던 섹션으로,
 * 가격 완전 비공개로 인한 문의 이탈("일단 문의"의 심리적 장벽)을 막기 위해 추가되었다.
 *
 * 배치: Difference(왜 코드블루를 선택해야 하는가) 바로 다음, Faq 바로 전. 방문자가 이미
 * Hero→Portfolio→Review→Founder→Difference를 거치며 신뢰와 관심을 충분히 쌓은 뒤 가격을
 * 마주하게 된다.
 *
 * 가격 정책 전면 개편(2026-08-15): Standard/Deluxe/Premium 3티어를 Launch/Business/Custom으로
 * 교체하고, 카드 밖에 공통 포함 사항(`PricingCommonInclusions`)과 추가 비용 아코디언
 * (`PricingAddOns`)을 신설했다 — 카드 안 핵심 정보(가격/포함 범위/결제 조건)가 너무 길어
 * 보이지 않도록, 세 플랜 공통 항목과 예외적인 추가 비용은 카드 밖으로 분리한다.
 *
 * `pricing-section-bottom` CTA("제 상황에 맞는 플랜 추천받기")가 이 섹션의 핵심 전환
 * 지점이다 — 3티어 중 하나를 스스로 고르게 하는 대신 상담으로 안내해 결정 피로를
 * 없앤다(PricingCard에 "추천" 배지를 넣지 않는 이유와 동일한 설계 원칙).
 *
 * 카드 아래 영역 순서(2026-08-18 확정): Grid(가격 카드 3개) → `PricingRevisionPolicy`
 * (제작 기간 내 수정 무제한 정책) → `PortfolioPartnerCard`(포트폴리오 협력 고객 안내,
 * `isActive`가 false면 렌더링하지 않는다) → `PricingCommonInclusions`(공통 포함 사항) →
 * `PricingAddOns`(추가 비용 안내). 상품별 "통합 수정 N회"를 카드에서 없앤 대신 이
 * 순서로 "가격을 본 직후 → 왜 저렴한지 → 뭐가 포함/추가되는지"를 자연스럽게 설명한다.
 */
export function PricingSection({
  tiers,
  valueProofItems,
  commonInclusions,
  addOns,
  cta,
  portfolioPartnerProgram,
}: PricingSectionProps) {
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

        <PricingRevisionPolicy />

        {portfolioPartnerProgram.isActive && <PortfolioPartnerCard program={portfolioPartnerProgram} />}

        <PricingCommonInclusions items={commonInclusions} />

        <PricingAddOns items={addOns} />

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
