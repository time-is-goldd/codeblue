"use client";

/**
 * DESIGN_SYSTEM.md 13.4 / ANIMATION_PLAN.md 7.3 — 모션 감소 사용자 판별.
 *
 * 사이트 정책(2026-10-07, 사용자 요청): OS의 "동작 줄이기"·"애니메이션 효과 끄기" 설정과
 * 무관하게 사이트의 모든 효과(스크롤 연출, 등장 애니메이션, Lenis 부드러운 스크롤, Hover 등)를
 * 보여준다. 이 훅을 쓰는 모든 컴포넌트가 한 번에 따르도록 여기서 항상 false를 돌려준다.
 * 다시 설정을 따르게 하려면 `RESPECT_OS_REDUCED_MOTION`을 true로 바꾸면 된다(globals.css의
 * 전역 규칙도 함께 되살려야 한다).
 */
import { useMediaQuery } from "./use-media-query";

const RESPECT_OS_REDUCED_MOTION = false;

export function useReducedMotion(): boolean {
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return RESPECT_OS_REDUCED_MOTION && prefersReduced;
}
