"use client";

import { useProgress } from "@react-three/drei";
import { PlaceholderVisual } from "./placeholder-visual";

/**
 * GLB 로딩 중 표시되는 DOM 오버레이 — DEVELOPMENT_PLAN.md Phase 4C.
 *
 * `<Canvas>` 내부의 `<Suspense>`는 fallback으로 일반 DOM 요소를 렌더링할 수 없으므로
 * (R3F 트리는 별도 리컨실러가 관리하는 Three.js 씬 그래프다), Canvas 바깥에서
 * `useProgress()`(THREE.DefaultLoadingManager 구독)로 전역 로딩 상태를 읽어
 * Canvas 위에 겹쳐 그리는 방식으로 구현한다. Canvas 안의 Suspense는 `fallback={null}`로
 * 비워 두고, 실제 로딩 UI는 이 컴포넌트가 전담한다.
 */
export function LoadingFallback() {
  const { active } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0">
      <PlaceholderVisual />
    </div>
  );
}
