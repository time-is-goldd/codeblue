import { CheckIcon } from "lucide-react";
import { CtaLinkButton } from "@/components/common/cta-link-button";
import { Text } from "@/components/ui/typography/text";
import type { AssuranceChecklistItem, Cta } from "@/types";

export interface HeroCtaGroupProps {
  ctaPrimary: Cta | null;
  ctaSecondary: Cta | null;
  /** Hero 리스크 리버설 배지에 노출할 항목 — Difference 섹션 AssuranceBlock과 동일한
   *  체크리스트를 재사용한다(첫 3개만, "고객님의 리스크를 0%로..." 문구는 여기서는 생략). */
  riskReversalItems: AssuranceChecklistItem[];
}

/**
 * Hero의 즉시 행동 유도(CTA) + 리스크 리버설 배지 — CRO 재설계(2026-07-23) 신설.
 *
 * 기존 Hero는 3문장만 보여주고 CTA 버튼이 전혀 없어, 첫 화면 체류 시간 동안 방문자가
 * 누를 수 있는 행동이 없다는 것이 가장 큰 전환율 저해 요소였다. HeroStatic/
 * HeroScrollytelling 양쪽에서 공유하는 이 컴포넌트 하나로 CTA 버튼 2개(주/보조)와
 * 후불제 근거 3줄을 추가한다 — 두 Hero 변형이 서로 다른 카피를 갖지 않도록 단일 소스로 관리.
 *
 * HeroScrollytelling은 `overflow-hidden` + `h-screen`인 sticky 박스 안에 렌더링되므로,
 * 세로 여백을 최소화한 컴팩트한 레이아웃(버튼 줄 1개 + 캡션 줄 1개)으로 구성했다.
 */
export function HeroCtaGroup({ ctaPrimary, ctaSecondary, riskReversalItems }: HeroCtaGroupProps) {
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

      {riskReversalItems.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {riskReversalItems.map((item) => (
            <li key={item.id} className="flex items-center gap-1.5">
              <CheckIcon aria-hidden className="size-3.5 shrink-0 text-brand-accent" />
              <Text as="span" size="sm" color="tertiary">
                {item.label}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
