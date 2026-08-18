"use client";

import { useCallback, useSyncExternalStore } from "react";
import { detectWebglSupport } from "@/lib/webgl/detect-webgl-support";

/** WebGL 지원 여부는 페이지 수명 동안 바뀌지 않으므로(새로고침 전까지) 구독할 "변경
 *  이벤트" 자체가 없다 — `useSyncExternalStore`가 요구하는 구독 함수 자리에 아무 것도
 *  하지 않는 no-op을 넣는다(클라이언트에서 최초 1회 계산한 스냅샷을 그대로 유지). */
function subscribe() {
  return () => {};
}

/**
 * WebGL 지원 여부를 하이드레이션 불일치 없이 판별한다 — `useMediaQuery`(→
 * `useReducedMotion`/`usePointerCoarse`)와 동일한 `useSyncExternalStore` 패턴을 따른다.
 * `getServerSnapshot`은 서버/최초 클라이언트 렌더에서 안전한 기본값(`false`, "아직 모름
 * → 3D를 시도하지 않는다")을 반환하고, 하이드레이션 직후 실제 클라이언트 값으로 다시
 * 렌더링된다(React가 SSR-safe 브라우저 API 판별을 위해 공식적으로 제공하는 메커니즘 —
 * `useState` + `useEffect`로 직접 구현하면 "effect 안에서 setState를 동기 호출"이 되어
 * 불필요한 cascading render를 유발한다).
 */
export function useWebglSupport(): boolean {
  const getSnapshot = useCallback(() => detectWebglSupport(), []);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
