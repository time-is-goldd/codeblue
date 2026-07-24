"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * ANIMATION_PLAN.md 7.2 — 데스크톱(정밀 포인터)과 모바일/터치(coarse 포인터)의
 * 애니메이션 분기 판단 기준. 예: Hero 3D의 마우스 parallax는 coarse 포인터에서 비활성화.
 */
export function usePointerCoarse(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
