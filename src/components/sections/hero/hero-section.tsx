"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { HeroStatic } from "./hero-static";
import { HeroScrollytelling } from "./hero-scrollytelling";
import type { Cta } from "@/types";

export interface HeroSectionProps {
  ctaPrimary: Cta | null;
  ctaSecondary: Cta | null;
}

/**
 * 홈페이지 첫 화면.
 *
 * `prefers-reduced-motion` 사용자에게는 배경 장식 애니메이션이 없는 `HeroStatic`을,
 * 그 외에는 배경 장식만 스크롤에 반응하는 `HeroScrollytelling`을 렌더링한다. 두 변형 모두
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
  const prefersReducedMotion = useReducedMotion();
  const props = { ctaPrimary, ctaSecondary };
  return prefersReducedMotion ? <HeroStatic {...props} /> : <HeroScrollytelling {...props} />;
}
