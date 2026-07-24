"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * DESIGN_SYSTEM.md 13.4 / ANIMATION_PLAN.md 7.3 — 모션 감소 사용자 판별.
 * 실제 애니메이션 구현 Phase(4~11)에서 3D/스크롤 트리거 분기에 사용한다.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
