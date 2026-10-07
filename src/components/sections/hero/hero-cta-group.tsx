"use client";

import { CtaLinkButton } from "@/components/common/cta-link-button";
import { trackEvent, getDeviceType } from "@/lib/analytics";
import type { Cta } from "@/types";

export interface HeroCtaGroupProps {
  ctaPrimary: Cta | null;
  ctaSecondary: Cta | null;
  /** "onBlue": 블루 배경 위(HeroGlyph의 "O" 안 화면)에서 묻히지 않도록 흰색 주 버튼/반투명 보조 버튼으로 바꾼다. */
  tone?: "default" | "onBlue";
}

const HERO_CTA_LOCATION = "hero";

/**
 * Hero의 즉시 행동 유도(CTA) 버튼 2개(주/보조).
 *
 * Hero 신뢰 문구 삭제(2026-08-20): CTA 아래에 있던 결제 조건 한 줄
 * ("소규모 프로젝트 선금 0원 · 계약서 작성 · 최종 검수 후 결제", `TRUST_CAPTION`)을
 * DOM에서 완전히 제거했다 — CSS로 숨기지 않고 요소 자체를 없애 스크린리더 접근성
 * 트리에서도 사라진다. 같은 내용은 Pricing/안심 제작 원칙(Difference) 섹션에 이미
 * 있으므로 그쪽 문구는 그대로 둔다. 문구를 감싸던 바깥 `flex-col gap-3` 래퍼도
 * 자식이 버튼 줄 하나만 남아 더 이상 필요 없어 함께 제거했다 — 불필요한 빈 여백이
 * 생기지 않는다.
 *
 * HeroStatic/HeroScrollytelling 양쪽에서 공유하는 이 컴포넌트 하나로 CTA 버튼 2개를
 * 추가한다 — 두 Hero 변형이 서로 다른 카피를 갖지 않도록 단일 소스로 관리.
 *
 * CTA 분리(2026-08-21): Hero는 신규 제작 고객과 기존 홈페이지 보유 고객을 모두
 * 대상으로 하므로 문구/버튼 개수는 그대로 유지한다("진단" 전용 문구로 바꾸지 않는다).
 * 다만 이벤트 추적 파라미터(`cta_location: "hero"`)는 추가한다 — 주 CTA만 `consult`로
 * 기록하고, "실제 제작 사례 보기"(보조 CTA)는 상담/진단 어느 쪽도 아니므로 추적하지
 * 않는다("use client" 전환은 이 트래킹 호출 하나 때문이다).
 */
export function HeroCtaGroup({ ctaPrimary, ctaSecondary, tone = "default" }: HeroCtaGroupProps) {
  const onBlue = tone === "onBlue";
  if (!ctaPrimary && !ctaSecondary) return null;

  function handlePrimaryClick() {
    trackEvent("consult", { cta_location: HERO_CTA_LOCATION, device_type: getDeviceType() });
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {ctaPrimary && (
        <CtaLinkButton href={ctaPrimary.buttonHref} variant="cta"
          size="lg"
          onNavigate={handlePrimaryClick}
          className={onBlue ? "bg-white text-[#0d2a66] shadow-lg hover:bg-white/90" : undefined}
        >
          {ctaPrimary.buttonLabel}
        </CtaLinkButton>
      )}
      {ctaSecondary && (
        <CtaLinkButton
          href={ctaSecondary.buttonHref}
          variant="secondary"
          size="lg"
          className={onBlue ? "border-white/40 bg-white/10 text-white hover:bg-white/20" : undefined}
        >
          {ctaSecondary.buttonLabel}
        </CtaLinkButton>
      )}
    </div>
  );
}
