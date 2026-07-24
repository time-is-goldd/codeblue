"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { HeroStatic } from "./hero-static";
import { HeroScrollytelling } from "./hero-scrollytelling";
import type { AssuranceChecklistItem, Cta } from "@/types";

export interface HeroSectionProps {
  ctaPrimary: Cta | null;
  ctaSecondary: Cta | null;
  riskReversalItems: AssuranceChecklistItem[];
}

/**
 * 홈페이지 첫 화면 — DEVELOPMENT_PLAN.md Phase 4A(Layout) + 4B(Storytelling).
 *
 * `prefers-reduced-motion` 사용자에게는 스크롤 스크러빙 없는 `HeroStatic`을,
 * 그 외에는 GSAP ScrollTrigger 기반 `HeroScrollytelling`을 렌더링한다.
 * 두 변형 모두 동일한 카피/구조(H1 하나, `HeroModelPlaceholder`, `ScrollIndicator`,
 * CRO 재설계로 추가된 `HeroCtaGroup`)를 공유하며 표현 방식만 다르다.
 */
export function HeroSection({ ctaPrimary, ctaSecondary, riskReversalItems }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const props = { ctaPrimary, ctaSecondary, riskReversalItems };
  return prefersReducedMotion ? <HeroStatic {...props} /> : <HeroScrollytelling {...props} />;
}
