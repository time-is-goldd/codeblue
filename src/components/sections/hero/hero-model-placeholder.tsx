"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
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

/**
 * PageSpeed Insights 모바일 성능 감사(2026-08-19)에서 실측 — 이 컴포넌트가 마운트
 * 즉시 `<CanvasScene />`을 렌더링하면 `next/dynamic`의 `import()`가 곧바로 트리거되어
 * Three.js/@react-three 청크(gzip 약 90KB대, GLB 모델 포함 시 약 380KB)가 CSS·서브셋
 * 폰트·다른 초기 스크립트 청크들과 동시에 네트워크 대역폭을 두고 경쟁하게 된다.
 * 실제 프로덕션 도메인 대상 CDP 트레이스(모바일 스로틀링)에서 LCP 요소(Hero H1)가
 * 필요로 하는 폰트가 이 경쟁 때문에 늦게 완료되는 것을 확인했다 — Three.js 자체를
 * 삭제하지 않고, "핵심 콘텐츠가 렌더링된 뒤 3D를 점진적으로 로드"하는 방향으로
 * 타이밍만 늦춘다. `requestIdleCallback`(미지원 브라우저는 짧은 `setTimeout`)로
 * 메인 스레드가 한가해진 뒤에야 `import()`를 트리거해, 초기 크리티컬 리소스와의
 * 대역폭 경쟁을 없앤다 — 그 전까지는 기존과 동일한 `PlaceholderVisual`을 보여준다.
 */
function useDeferredMount(delayMs: number): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => setReady(true), { timeout: delayMs });
    } else {
      timeoutId = window.setTimeout(() => setReady(true), delayMs);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return ready;
}

export interface HeroModelPlaceholderProps {
  className?: string;
}

/**
 * 향후 Three.js/GLB 씬이 렌더링되는 영역 — Phase 4A에서는 정적 Placeholder였으나
 * Phase 4C에서 실제 React Three Fiber Canvas로 교체되었다. Hero(HeroStatic/
 * HeroScrollytelling)는 이 컴포넌트만 알 뿐, 내부의 Three.js 구현(components/three/*)에는
 * 전혀 관여하지 않는다. 완전히 장식적인 요소이므로 스크린리더에서는 숨긴다.
 *
 * 로딩 중 정적 로고 플래시 제거(2026-08-20): 이전에는 `useWebglSupport()`(WebGL 지원
 * 사전 검사, `useSyncExternalStore` 기반 SSR-safe 훅)로 서버/최초 하이드레이션 시점에는
 * 항상 `StaticBrandVisual`을 먼저 보여준 뒤, 하이드레이션 직후 실제 값으로 다시
 * 렌더링해 `<CanvasScene>`으로 전환했다. 하지만 이 방식은 WebGL을 지원하는
 * 절대다수의 실제 사용자에게 "브랜드 로고 이미지 → (다시) 로딩 Placeholder →
 * 3D 모델"로 이어지는 부자연스러운 3단계 전환을 매번 강제했다(청크 로딩 자체는
 * `next/dynamic`의 `loading`이 이미 `<PlaceholderVisual>`을 보여주므로, 그 앞에
 * `StaticBrandVisual`이 한 번 더 끼어드는 모양새였다). 지금은 사전 검사 없이 항상
 * `<CanvasScene>` 마운트를 바로 시도하고, `ModelErrorBoundary`만으로 실패 시
 * `StaticBrandVisual`로 전환한다 — 로딩 시퀀스가 "Placeholder → 3D 모델" 한 번의
 * 전환으로 단순해진다.
 *
 * 트레이드오프: WebGL을 아예 지원하지 않는 극소수 환경(구형 브라우저, GPU 비활성화
 * 등)에서는 `THREE.WebGLRenderer`가 컨텍스트 생성을 시도하며 콘솔 경고를 한 번
 * 남길 수 있다(사전 검사가 있던 이전 버전은 이 시도 자체를 막았다) — `ModelErrorBoundary`가
 * 여전히 이를 잡아 `StaticBrandVisual`로 정상 대체하므로 화면이 깨지지는 않는다.
 */
export function HeroModelPlaceholder({ className }: HeroModelPlaceholderProps) {
  // 2000ms 안에 유휴 시점이 오지 않아도(예: 스크롤/입력이 계속되는 경우) 강제로
  // 로드를 시작한다 — 3D 등장이 무기한 미뤄지지 않게 하는 안전장치.
  const shouldLoad3D = useDeferredMount(2000);

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
      <ModelErrorBoundary fallback={<StaticBrandVisual />}>
        {shouldLoad3D ? <CanvasScene /> : <PlaceholderVisual />}
      </ModelErrorBoundary>
    </div>
  );
}
