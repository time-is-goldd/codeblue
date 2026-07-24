"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { PlaceholderVisual } from "@/components/three/placeholder-visual";

/**
 * Three.js/React Three Fiber는 브라우저 전용(WebGL)이라 서버 렌더링 대상이 아니다.
 * ANIMATION_PLAN.md 4장 방침대로 `next/dynamic` + `ssr:false`로 지연 로드해
 * 초기 페이지 로드(및 SSR)에 Three.js 번들이 섞이지 않게 한다. 청크가 아직
 * 로드되기 전에는 `loading`으로 지정한 동일한 Placeholder 시각 요소를 보여준다.
 */
const CanvasScene = dynamic(() => import("@/components/three/canvas-scene").then((mod) => mod.CanvasScene), {
  ssr: false,
  loading: () => <PlaceholderVisual />,
});

export interface HeroModelPlaceholderProps {
  className?: string;
}

/**
 * 향후 Three.js/GLB 씬이 렌더링되는 영역 — Phase 4A에서는 정적 Placeholder였으나
 * Phase 4C에서 실제 React Three Fiber Canvas로 교체되었다. Hero(HeroStatic/
 * HeroScrollytelling)는 이 컴포넌트만 알 뿐, 내부의 Three.js 구현(components/three/*)에는
 * 전혀 관여하지 않는다 — 두 Hero 변형 파일은 이번 Phase에서 한 줄도 수정하지 않았다.
 * 완전히 장식적인 요소이므로 스크린리더에서는 숨긴다.
 */
export function HeroModelPlaceholder({ className }: HeroModelPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative size-[240px] overflow-hidden rounded-full shadow-glow-accent sm:size-[320px] lg:size-[400px]",
        className,
      )}
    >
      <CanvasScene />
    </div>
  );
}
