"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePointerCoarse } from "@/hooks/use-pointer-coarse";
import { Camera } from "./camera";
import { Lights } from "./lights";
import { Model } from "./model";
import { LoadingFallback } from "./loading-fallback";
import { ErrorFallback } from "./error-fallback";
import { ModelErrorBoundary } from "./model-error-boundary";

/**
 * Hero 3D 영역의 유일한 진입점 — DEVELOPMENT_PLAN.md Phase 4C.
 * `HeroModelPlaceholder`가 이 컴포넌트 하나만 import하므로, Hero 레이어는
 * Three.js 내부 구현(Canvas/Model/Lights/Camera 등)을 전혀 알 필요가 없다.
 *
 * 성능:
 * - `frameloop="demand"`: 카메라/모델이 정적이라 매 프레임 재렌더할 필요가 없다
 *   (자동 회전·카메라 애니메이션·스크롤 연동 모두 이번 단계 제외 대상이라 안전하게 적용 가능).
 * - `dpr`/`antialias`: 모바일(coarse pointer) 여부에 따라 해상도 배율과 안티앨리어싱을
 *   낮춰 GPU 부담을 줄인다(usePointerCoarse — Foundation 단계 훅 재사용).
 */
export function CanvasScene() {
  const isCoarsePointer = usePointerCoarse();

  return (
    <ModelErrorBoundary fallback={<ErrorFallback />}>
      <div className="relative size-full">
        <Canvas
          dpr={isCoarsePointer ? 1 : [1, 2]}
          gl={{ antialias: !isCoarsePointer, alpha: true }}
          frameloop="demand"
        >
          <Camera />
          <Lights />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Canvas>
        <LoadingFallback />
      </div>
    </ModelErrorBoundary>
  );
}
