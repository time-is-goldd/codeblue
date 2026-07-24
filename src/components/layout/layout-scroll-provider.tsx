"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLenis } from "@/components/providers/lenis-provider";
import { useActiveSection } from "@/hooks/use-active-section";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { NAV_SECTION_IDS } from "@/lib/constants/nav";

export interface ScrollTick {
  scrollY: number;
  /** 0~1 */
  progress: number;
  direction: 1 | -1;
}

type ProgressListener = (tick: ScrollTick) => void;

export interface LayoutScrollContextValue {
  /** Hero 영역(첫 콘텐츠 섹션 이전) 여부 — Header 배경 전환, FloatingCTA 노출에 사용 */
  isInHeroZone: boolean;
  /** 스크롤 방향에 따른 Header 표시 여부 (Hero 영역에서는 항상 true) */
  isHeaderVisible: boolean;
  /** 현재 뷰포트 상단 근처의 섹션 id (IntersectionObserver 기반) */
  activeSectionId: string | null;
  /**
   * 매 스크롤 tick(고빈도)마다 호출되는 리스너를 등록한다. React 상태를 거치지 않으므로
   * 구독자가 재렌더링되지 않는다 — Scroll Progress Bar처럼 매 프레임 DOM을 직접
   * 갱신해야 하는 경우에 사용한다 (DEVELOPMENT_PLAN.md Phase 3B 성능 요구사항).
   */
  subscribeProgress: (listener: ProgressListener) => () => void;
}

const LayoutScrollContext = createContext<LayoutScrollContextValue | null>(null);

/**
 * "Hero Zone"(Hero+Bridge+Trust) 바로 다음에 오는 첫 실제 콘텐츠 섹션 id — 이 섹션의
 * 문서상 위치를 기준으로 Header 투명/Glass 전환, FloatingCTA 노출 여부를 계산한다.
 * 2026-07-22: 이 자리에 있던 `id="about"` 홈 자리표시자를 제거하면서 `id="difference"`가
 * 새로 이 경계를 넘겨받았다(Trust 바로 다음이라는 상대적 위치는 동일하게 유지됨).
 */
const HERO_BOUNDARY_ID = "difference";
/** 미세한 스크롤 떨림(트랙패드 관성 등)으로 방향이 잘못 뒤집히지 않도록 하는 최소 이동량(px) */
const DIRECTION_CHANGE_THRESHOLD = 8;

/**
 * Header/FloatingCTA/ScrollProgressBar가 스크롤 관련 상태를 공유하는 단일 소스.
 *
 * Phase 3A에서는 Header가 자체적으로 scroll 리스너를 두었으나, Phase 3B에서
 * FloatingCTA·ScrollProgressBar가 추가되며 동일한 정보(스크롤 위치, Hero 영역 여부,
 * 현재 섹션)가 세 곳에서 필요해졌다. 리스너/Observer를 컴포넌트마다 중복 등록하는 대신
 * 이 Provider가 스크롤 이벤트 1회, IntersectionObserver 1회만 등록하고 하위 컴포넌트는
 * 이 컨텍스트만 구독한다.
 *
 * 고빈도 값(progress)은 `subscribeProgress`로 ref 기반 구독만 제공해 재렌더링을
 * 유발하지 않고, 저빈도 값(isInHeroZone/isHeaderVisible/activeSectionId)만
 * React state로 관리해 실제 상태가 바뀔 때만 최소한으로 재렌더링되게 한다.
 */
export function LayoutScrollProvider({ children }: { children: ReactNode }) {
  const activeSectionId = useActiveSection(NAV_SECTION_IDS);
  const [isInHeroZone, setIsInHeroZone] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const listenersRef = useRef(new Set<ProgressListener>());
  const lastScrollYRef = useRef(0);

  const processTick = useCallback((scrollY: number, progress: number, direction: 1 | -1) => {
    listenersRef.current.forEach((listener) => listener({ scrollY, progress, direction }));

    const boundaryEl = document.getElementById(HERO_BOUNDARY_ID);
    const boundaryTop = boundaryEl
      ? boundaryEl.getBoundingClientRect().top + window.scrollY
      : Number.POSITIVE_INFINITY;
    const heroLimit = Math.max(boundaryTop - HEADER_HEIGHT, 0);
    const nextInHero = scrollY < heroLimit;

    setIsInHeroZone((prev) => (prev === nextInHero ? prev : nextInHero));

    const delta = scrollY - lastScrollYRef.current;
    lastScrollYRef.current = scrollY;

    setIsHeaderVisible((prev) => {
      if (nextInHero) return true;
      if (Math.abs(delta) < DIRECTION_CHANGE_THRESHOLD) return prev;
      return delta <= 0;
    });
  }, []);

  const lenis = useLenis((lenisInstance) => {
    processTick(lenisInstance.scroll, lenisInstance.progress, (lenisInstance.direction || 1) as 1 | -1);
  });

  useEffect(() => {
    // Lenis가 활성화되어 있으면 위 콜백이 유일한 스크롤 소스다 — 이중 등록하지 않는다.
    if (lenis) return;
    if (typeof window === "undefined") return;

    let frame = 0;

    function handleScroll() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scrollY = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
        const direction: 1 | -1 = scrollY >= lastScrollYRef.current ? 1 : -1;
        processTick(scrollY, progress, direction);
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [lenis, processTick]);

  const subscribeProgress = useCallback((listener: ProgressListener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const value = useMemo<LayoutScrollContextValue>(
    () => ({ isInHeroZone, isHeaderVisible, activeSectionId, subscribeProgress }),
    [isInHeroZone, isHeaderVisible, activeSectionId, subscribeProgress],
  );

  return <LayoutScrollContext.Provider value={value}>{children}</LayoutScrollContext.Provider>;
}

export function useLayoutScroll(): LayoutScrollContextValue {
  const ctx = useContext(LayoutScrollContext);
  if (!ctx) {
    throw new Error("useLayoutScroll은 LayoutScrollProvider 하위에서만 사용할 수 있습니다.");
  }
  return ctx;
}
