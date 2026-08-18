"use client";

import { useEffect, useRef } from "react";
import { CheckIcon } from "lucide-react";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Eyebrow } from "@/components/ui/typography/eyebrow";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { GLASS_CARD_CLASS } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioPartnerProgram } from "@/types";

export interface PortfolioPartnerCardProps {
  program: PortfolioPartnerProgram;
}

function BenefitList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" weight="semibold" color="primary">
        {title}
      </Text>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckIcon aria-hidden className="mt-0.5 size-icon-sm shrink-0 text-brand-accent" />
            <Text size="sm" color="secondary">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Pricing 카드 바로 아래, 공통 포함 사항/추가 비용 안내보다 앞에 배치하는 포트폴리오
 * 협력 프로그램 카드(2026-08-18 신설) — 가격을 확인한 방문자가 "왜 이렇게 저렴한지"와
 * 협력 조건을 바로 이어서 이해하도록 한다. 별도의 거대한 섹션이 아니라 Pricing 카드와
 * 같은 `GLASS_CARD_CLASS` 재질의 카드 하나로만 구성한다 — 할인만 크게 보이는 쿠폰
 * 사이트처럼 보이지 않도록 "10%"는 쉽게 인식되되 Pricing 카드의 실제 가격(`text-2xl`)보다
 * 강조하지 않는다.
 *
 * 애니메이션: `PricingCommonInclusions`/`PricingAddOns`(이 카드의 바로 아래 형제
 * 컴포넌트들)와 동일하게 진입 애니메이션을 두지 않는다 — "화면 진입 후 즉시 읽을 수
 * 있어야 한다"는 요구사항을 지연 애니메이션을 아예 만들지 않는 방식으로 만족한다.
 * IntersectionObserver는 오직 GA4 노출 이벤트(`portfolio_partner_view`) 측정용이며 화면에
 * 아무 영향도 주지 않는다(1회만 발화, once 패턴은 다른 ScrollTrigger 진입 애니메이션과
 * 동일한 원칙).
 *
 * `isActive`가 false일 때는 이 컴포넌트 자체를 렌더링하지 않는다(호출부
 * `pricing-section.tsx`에서 분기) — 모집 완료 후 잔여 인원을 실시간으로 보여줄 방법이
 * 없으므로, 프로그램을 통째로 숨기는 것이 "현재 2자리 남음" 같은 부정확한 표시보다 낫다.
 */
export function PortfolioPartnerCard({ program }: PortfolioPartnerCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          trackEvent("portfolio_partner_view", { location: "pricing_section" });
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(rootEl);
    return () => observer.disconnect();
  }, []);

  const discountPercentLabel = `${program.discountRate * 100}%`;

  return (
    <div
      ref={rootRef}
      className={cn(GLASS_CARD_CLASS, "flex w-full flex-col gap-6 rounded-lg p-6 lg:p-8")}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <Eyebrow>{program.eyebrow}</Eyebrow>
          <Heading as="h3" size="h4">
            {program.title}
          </Heading>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-lg border border-brand-accent/30 bg-brand-accent-muted px-4 py-2">
          <Text as="span" size="lg" weight="semibold" className="text-xl text-brand-accent">
            {discountPercentLabel}
          </Text>
          <Text as="span" size="sm" color="secondary">
            기본 제작비 할인
          </Text>
        </div>
      </div>

      <Text size="base" color="secondary">
        {program.description}
      </Text>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <BenefitList title="고객 혜택" items={program.customerBenefits} />
        <BenefitList title="협력 내용" items={program.partnerRequirements} />
      </div>

      <div className="flex flex-col gap-1.5 border-t border-brand-border-subtle pt-4">
        {program.disclaimers.map((disclaimer) => (
          <Text key={disclaimer} size="sm" color="tertiary">
            {disclaimer}
          </Text>
        ))}
      </div>

      <CtaLinkButton
        href={program.ctaHref}
        variant="secondary"
        size="default"
        className="w-full sm:w-fit"
        onNavigate={() => trackEvent("portfolio_partner_cta_click", { location: "pricing_section" })}
      >
        {program.ctaLabel}
      </CtaLinkButton>
    </div>
  );
}
