"use client";

import { HeroGlyph } from "./hero-glyph";
import type { Cta } from "@/types";

export interface HeroSectionProps {
  ctaPrimary: Cta | null;
  ctaSecondary: Cta | null;
}

/**
 * 홈페이지 첫 화면.
 *
 * `prefers-reduced-motion` 사용자에게는 배경 장식 애니메이션이 없는 `HeroStatic`을,
 * 그 외에는 "CODEBLUE" 글자 안으로 들어가는 스크롤 연출 `HeroGlyph`를 렌더링한다(2026-10-06,
 * 이전의 `HeroScrollytelling`(3D 모델 + 글로우)은 파일만 남겨 두었다 — 복구 시 이 줄의
 * `HeroGlyph`를 다시 `HeroScrollytelling`으로 바꾸면 된다). 아래 설명은 기존 두 변형 기준이다. 두 변형 모두
 * 동일한 카피/구조(H1 하나, `HeroModelPlaceholder`, `ScrollIndicator`, `HeroCtaGroup`)를
 * 공유하며 표현 방식만 다르다.
 *
 * Hero 카피 전면 개편(2026-08-15): 이전에는 "문제 제기 → 해결책" 두 문장을 스크롤에 맞춰
 * 크로스페이드시키는 스토리텔링 구조였으나, 방문자가 스크롤해야만 메인 메시지를 볼 수
 * 있는 구조는 접속 즉시 핵심 카피/CTA를 보여줘야 한다는 요구사항과 맞지 않아 제거했다.
 * 이제 Eyebrow/H1(두 줄)/보조 문구/CTA는 두 변형 모두에서 접속 즉시 완전히 보이는
 * 정적 콘텐츠이며, 스크롤에 반응하는 요소는 배경 글로우 같은 장식 효과로만 제한된다.
 */
export function HeroSection({ ctaPrimary, ctaSecondary }: HeroSectionProps) {
  // 2026-10-06: 사용자 요청으로 모션 감소 설정과 무관하게 항상 HeroGlyph를 쓴다
  // (HeroStatic/HeroScrollytelling은 파일만 남겨 둠).
  return <HeroGlyph ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} />;
}
