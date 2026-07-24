"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(query: string, callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

/**
 * 범용 미디어쿼리 훅. useReducedMotion, usePointerCoarse 등 상위 훅의 기반이 된다.
 * useSyncExternalStore를 사용해 서버/클라이언트 스냅샷 불일치(hydration mismatch)
 * 없이 브라우저 API를 구독한다.
 */
export function useMediaQuery(query: string): boolean {
  const subscribeFn = useCallback((callback: () => void) => subscribe(query, callback), [query]);
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribeFn, getSnapshot, getServerSnapshot);
}
