"use client";

import { useEffect, useRef } from "react";
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

/**
 * 포트폴리오 협력 프로그램 배너 — 가로형 축약(2026-08-19).
 *
 * 기존에는 "고객 혜택"/"협력 내용" 두 목록과 안내 문구 여러 줄을 담은 세로로 긴 카드였다.
 * 페이지 후반부 길이를 줄이기 위해 제목 + 한 줄 설명 + 버튼만 남긴 배너로 축약했고,
 * PC에서도 텍스트를 왼쪽/버튼을 오른쪽에 두는 좌우 분할 대신 항상 중앙 정렬로 쌓는다
 * (2026-08-20 재조정 — 다른 Pricing 배너들과 시각적으로 더 통일감 있다는 판단). 모집
 * 인원 숫자는 표시하지 않는다 — Pricing 카드보다 과도하게 강조하지 않도록
 * `GLASS_CARD_CLASS` 재질과 `secondary` 버튼을 그대로 사용한다(할인 쿠폰처럼 보이는
 * 원색 강조를 쓰지 않는다).
 *
 * `isActive`가 false일 때는 이 컴포넌트 자체를 렌더링하지 않는다(호출부
 * `pricing-section.tsx`에서 분기) — 모집 완료 후 잔여 인원을 실시간으로 보여줄 방법이
 * 없으므로, 프로그램을 통째로 숨기는 것이 부정확한 숫자 표시보다 낫다.
 *
 * 애니메이션은 두지 않는다(형제 배너인 `PricingRevisionPolicy`/`PricingCommonInclusions`와
 * 동일한 원칙) — 화면 진입 즉시 읽을 수 있어야 한다. IntersectionObserver는 GA4 노출
 * 이벤트(`portfolio_partner_view`) 측정 전용이며 화면에는 영향을 주지 않는다.
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

  return (
    <div
      ref={rootRef}
      className={cn(
        GLASS_CARD_CLASS,
        "flex w-full flex-col items-center gap-4 rounded-lg px-6 py-6 text-center",
      )}
    >
      <div className="flex flex-col items-center gap-1.5">
        <Eyebrow>{program.eyebrow}</Eyebrow>
        <Heading as="h3" size="h4">
          {program.title}
        </Heading>
        <Text size="sm" color="secondary">
          {program.description}
        </Text>
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
