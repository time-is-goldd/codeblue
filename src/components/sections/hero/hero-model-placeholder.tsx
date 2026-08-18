"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useWebglSupport } from "@/hooks/use-webgl-support";
import { PlaceholderVisual } from "@/components/three/placeholder-visual";
import { StaticBrandVisual } from "@/components/three/static-brand-visual";
import { ModelErrorBoundary } from "@/components/three/model-error-boundary";

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
 * 전혀 관여하지 않는다. 완전히 장식적인 요소이므로 스크린리더에서는 숨긴다.
 *
 * WebGL 미지원 대응(2026-08-19, 운영 홈페이지 개선): `<CanvasScene>`(내부에서
 * `THREE.WebGLRenderer`를 실제로 생성한다)을 마운트하기 전에 `useWebglSupport()`
 * (`detectWebglSupport()`를 `useSyncExternalStore`로 감싼 훅)로 먼저 검사한다 —
 * 두 단계 방어:
 * 1) 사전 검사(주 방어선): 지원하지 않으면 `<CanvasScene>` 자체를 한 번도 마운트하지
 *    않고 `StaticBrandVisual`(정적 브랜드 이미지)로 바로 대체한다 — "THREE.WebGLRenderer:
 *    Error creating WebGL context" 콘솔 오류가 애초에 발생할 일이 없다.
 * 2) 안전망(보조 방어선): 사전 검사를 통과했는데도 실제 렌더러 생성이 예외를 던지는
 *    드문 경우(예: 컨텍스트 한도 초과)에 대비해 기존 `ModelErrorBoundary`로 감싸되
 *    `fallback`을 `StaticBrandVisual`로 지정한다. React Error Boundary는 한 번 걸리면
 *    그 인스턴스가 계속 `fallback`만 보여주고 `children`을 다시 마운트하지 않으므로
 *    (리렌더돼도 `state.hasError`가 유지됨), 반복 마운트/무한 재시도나 콘솔 오류 반복
 *    누적이 일어나지 않는다.
 *
 * `useWebglSupport()`는 서버/최초 클라이언트 렌더에서 `false`(안전한 기본값)를 반환하고
 * 하이드레이션 직후 실제 값으로 다시 렌더링되므로(`useReducedMotion`/`usePointerCoarse`와
 * 동일한 `useSyncExternalStore` 패턴, `hooks/use-webgl-support.ts` 참고)
 * 서버/클라이언트 렌더 결과가 항상 일치해 하이드레이션 불일치가 없다.
 *
 * `prefersReducedMotion`/모바일/저전력 환경도 이 로직과 무관하게 동일하게 동작한다 —
 * `detectWebglSupport()`는 순수 브라우저 API 검사라 기기·설정에 따라 분기하지 않는다.
 * WebGL이 정상 지원되는 환경에서는 이 컴포넌트가 하던 일이 전혀 바뀌지 않으므로
 * 기존 3D 효과(호버 회전, 스크롤 연동 등, `components/three/model.tsx`)는 그대로 동작한다.
 */
export function HeroModelPlaceholder({ className }: HeroModelPlaceholderProps) {
  const isWebglSupported = useWebglSupport();

  return (
    <div
      aria-hidden="true"
      className={cn(
        // Hero 카피 전면 개편(2026-08-15): CTA/신뢰 문구까지 스크롤 없이 한 화면에 모두
        // 보여야 한다는 요구사항 때문에 기존 240/320/400px에서 크기를 줄였다 — 실측
        // 결과 1366×768 등 흔한 노트북 해상도에서 기존 크기로는 CTA 버튼이 뷰포트
        // 아래로 잘렸다. 장식 요소(배경/오브젝트) 역할로만 쓰이므로 작아져도 Hero의
        // 핵심 메시지 전달에는 영향이 없다.
        "relative size-[64px] overflow-hidden rounded-full shadow-glow-accent sm:size-[130px] lg:size-[150px]",
        className,
      )}
    >
      {isWebglSupported ? (
        <ModelErrorBoundary fallback={<StaticBrandVisual />}>
          <CanvasScene />
        </ModelErrorBoundary>
      ) : (
        <StaticBrandVisual />
      )}
    </div>
  );
}
