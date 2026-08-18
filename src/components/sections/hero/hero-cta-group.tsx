import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Text } from "@/components/ui/typography/text";
import type { Cta } from "@/types";

export interface HeroCtaGroupProps {
  ctaPrimary: Cta | null;
  ctaSecondary: Cta | null;
}

/** Hero CTA 바로 아래 신뢰 문구 — 결제 조건 카피 전면 개편(2026-08-15)으로 고정 문구를
 *  그대로 사용한다. "리스크 0%"류의 절대적 표현 대신 실제 계약·결제 조건(소규모 프로젝트
 *  범위, 계약서 작성, 최종 검수 후 결제)을 구체적으로 명시한다 — Pricing 섹션의
 *  Launch/Business 결제 조건("선금 0원, 최종 검수 후 100% 결제")과 모순되지 않아야
 *  하므로, Custom(계약 시 30%/최종 검수 후 70%)까지 포함하는 전체 사이트에 적용되는
 *  범위로 "소규모 프로젝트"를 명시해 과장하지 않는다. */
const TRUST_CAPTION = "소규모 프로젝트 선금 0원 · 계약서 작성 · 최종 검수 후 결제";

/**
 * Hero의 즉시 행동 유도(CTA) + 결제 조건 신뢰 문구.
 *
 * HeroStatic/HeroScrollytelling 양쪽에서 공유하는 이 컴포넌트 하나로 CTA 버튼 2개(주/보조)와
 * 신뢰 문구 한 줄을 추가한다 — 두 Hero 변형이 서로 다른 카피를 갖지 않도록 단일 소스로 관리.
 *
 * 신뢰 문구(2026-08-15 개편)는 읽을 수 있는 크기/명암을 쓰되 CTA보다 시각적으로 강조하지
 * 않도록 `color="tertiary"`(Difference 등 다른 섹션의 캡션과 동일한 위계)를 사용한다 —
 * 이전에는 Difference AssuranceBlock 체크리스트 첫 3개를 그대로 재사용했으나, 이제
 * 고정된 한 줄 문구로 대체되어 그 데이터 의존성이 필요 없어졌다.
 */
export function HeroCtaGroup({ ctaPrimary, ctaSecondary }: HeroCtaGroupProps) {
  if (!ctaPrimary && !ctaSecondary) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {ctaPrimary && (
          <CtaLinkButton href={ctaPrimary.buttonHref} variant="cta" size="lg">
            {ctaPrimary.buttonLabel}
          </CtaLinkButton>
        )}
        {ctaSecondary && (
          <CtaLinkButton href={ctaSecondary.buttonHref} variant="secondary" size="lg">
            {ctaSecondary.buttonLabel}
          </CtaLinkButton>
        )}
      </div>

      <Text size="sm" color="tertiary" className="text-center">
        {TRUST_CAPTION}
      </Text>
    </div>
  );
}
