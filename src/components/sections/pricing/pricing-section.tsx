"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Grid } from "@/components/common/grid";
import { PricingCard } from "./pricing-card";
import { PricingAddOns } from "./pricing-addons";
import { PricingRevisionPolicy } from "./pricing-revision-policy";
import { PortfolioPartnerCard } from "./portfolio-partner-card";
import { PricingBottomCta } from "./pricing-bottom-cta";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { PortfolioPartnerProgram, PricingAddOnItem, PricingTier } from "@/types";

export interface PricingSectionProps {
  tiers: PricingTier[];
  addOns: PricingAddOnItem[];
  portfolioPartnerProgram: PortfolioPartnerProgram;
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Pricing 섹션 — CRO 재설계(2026-07-23) 신설. DEVELOPMENT_PLAN.md 원안에는 없던 섹션으로,
 * 가격 완전 비공개로 인한 문의 이탈("일단 문의"의 심리적 장벽)을 막기 위해 추가되었다.
 *
 * 배치: Difference(안심 제작 원칙) 바로 다음, Faq 바로 전.
 *
 * 문구/구조 전면 정리(2026-08-19, 홈페이지 길이 정리): 제목을 "프로젝트 범위별 예상
 * 제작비"(Eyebrow "PRICING")로, 설명을 "어떤 플랜이 맞는지 모르셔도 괜찮습니다. 필요한
 * 범위만 제안합니다."로 바꿨다. 섹션 내부 순서를 다음으로 재배치했다:
 * ① 제목/설명 → ② 가격 카드 3개 → ③ 추가 비용 아코디언(`PricingAddOns`, 카드 바로
 * 아래로 이동) → ④ 수정 횟수 안내(`PricingRevisionPolicy`, 가로형 배너로 축약) →
 * ⑤ 포트폴리오 협력 배너(`PortfolioPartnerCard`, 가로형으로 축약, `isActive`가
 * false면 렌더링하지 않음) → ⑥ 최종 상담 CTA(`PricingBottomCta`, 카카오톡 상담으로
 * 단일화).
 *
 * 삭제된 것: "왜 이렇게 저렴할까요?" 카드(`PricingValueProof`, 컴포넌트/데이터/Repository
 * 함수까지 전부 제거)와 `cta-004`("어떤 플랜이 맞을지 고민되시나요?" `CTABanner`) — 두
 * 영역 모두 반복 설명이라 페이지 길이만 늘렸다. `PricingSectionProps`에서 `valueProofItems`/
 * `cta` prop이 사라졌으므로 `app/(public)/page.tsx`도 함께 정리했다.
 *
 * "모든 플랜 공통 포함" 카드 삭제(2026-08-21): `PricingCommonInclusions` 컴포넌트를
 * 데이터(`PRICING_COMMON_INCLUSION_DATA`)·Repository 함수(`getAllPricingCommonInclusions`)·
 * 타입(`PricingCommonInclusionItem`)까지 전부 제거했다(`PricingValueProof`를 지운 것과
 * 동일한 원칙 — 화면에 없는 코드/데이터를 남겨두지 않는다). 목록 중 "배포 후 30일간
 * 제작 오류 무상 수정"은 FAQ(`faq.data.ts`)에 이미 동일하게 안내되어 있어 이 정보 자체가
 * 사이트에서 사라지지는 않는다. 빈자리는 별도 spacer 없이 Container의 기존
 * `gap-12`(flex-col)가 자연스럽게 메워준다 — 남은 형제 요소들 사이 간격만 그대로
 * 이어진다.
 *
 * `spacing="comfortable"`(PC 96px)로 다른 일반 섹션과 여백을 통일하고, Container 내부
 * 블록 간 간격도 `gap-16`(64px) → `gap-12`(48px)로 좁혀 전체 스크롤 길이를 줄였다
 * (요청 범위 48~64px의 하한).
 */
export function PricingSection({ tiers, addOns, portfolioPartnerProgram }: PricingSectionProps) {
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
    <Section id="pricing" background="base" spacing="comfortable">
      <Container className="flex flex-col items-center gap-12">
        <div ref={headingRef} className="w-full">
          <SectionHeading
            align="center"
            eyebrow="PRICING"
            title="프로젝트 범위별 예상 제작비"
            description={
              // md:hidden(2026-08-19): 모바일에서만 "괜찮습니다." 다음에 줄바꿈을 넣는다.
              // "괜찮습니다." 온점은 그대로, "제안합니다." 끝의 기존 온점도 그대로 두고
              // 새 온점을 추가하지 않는다. PC는 <br>이 렌더링되지 않아 기존과 동일한
              // 한 줄 배치.
              <>
                어떤 플랜이 맞는지 모르셔도 괜찮습니다.<br className="md:hidden" /> 필요한 범위만 제안합니다.
              </>
            }
          />
        </div>

        <Grid cols={{ base: 1, md: 3, lg: 3 }} className="w-full items-start">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.id} tier={tier} index={index} />
          ))}
        </Grid>

        <PricingAddOns items={addOns} />

        <PricingRevisionPolicy />

        {portfolioPartnerProgram.isActive && <PortfolioPartnerCard program={portfolioPartnerProgram} />}

        <PricingBottomCta />
      </Container>
    </Section>
  );
}
