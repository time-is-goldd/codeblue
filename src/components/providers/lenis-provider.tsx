"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * 전역 스무스 스크롤 Provider — ANIMATION_PLAN.md 1장(Lenis 역할), 3.3~3.4(GSAP/앵커 연동).
 *
 * 여기서는 스크롤 "인프라"만 제공한다. 실제 Hero/Storytelling 등의 스크롤 연동
 * 애니메이션(GSAP ScrollTrigger 타임라인 등)은 이후 화면 구현 Phase에서 만든다.
 *
 * `prefers-reduced-motion` 사용자는 Lenis를 아예 적용하지 않고 브라우저 네이티브 스크롤을
 * 그대로 사용한다 (DESIGN_SYSTEM.md 13.4).
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export { useLenis } from "lenis/react";
