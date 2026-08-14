"use client";

import { createContext, useContext, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface AnimationContextValue {
  /** 모든 스크롤/3D 애니메이션 컴포넌트가 참조해야 하는 전역 모션 감소 상태 */
  prefersReducedMotion: boolean;
}

const AnimationContext = createContext<AnimationContextValue>({
  prefersReducedMotion: false,
});

// 모듈 스코프(top-level) 등록 — DEVELOPMENT_PLAN.md Phase 7C(Animation Architecture Fix).
//
// 이전에는 useEffect 안에서 등록했으나, React는 커밋마다 이펙트를 "자식 → 부모" 순서로
// 실행한다. AnimationProvider는 모든 Section의 조상(ancestor)이므로 그 useEffect는 항상
// Hero/CapacityBadge/Urgency/Difference/Review 등 자식들의 useLayoutEffect(심지어 useEffect)보다
// 늦게 실행되었고, 그 결과 각 컴포넌트가 등록 전에 `ScrollTrigger.create()`를 호출해
// "Missing plugin?" 경고와 크래시가 발생했다 — 부모가 자식보다 늦게 실행되는 React
// 커밋 순서에 등록 시점을 맡긴 것 자체가 근본 원인이다.
//
// ES 모듈은 최초 1회만 평가되어 캐시되므로(멱등), 이 줄은 애플리케이션 전체에서 정확히
// 한 번만 실행되며, React 트리가 구성/마운트/커밋되기 전(import 시점)에 이미 끝나 있다 —
// 따라서 어떤 컴포넌트가 트리의 어디에 있든, StrictMode의 이펙트 이중 호출이든 상관없이
// "ScrollTrigger는 항상 이미 등록되어 있다"를 React 생명주기와 무관하게 보장한다.
//
// 이 파일이 프로젝트에서 `gsap.registerPlugin(ScrollTrigger)`를 호출하는 유일한 지점이다
// (요구사항 ③) — 다른 Section/카드 컴포넌트는 등록을 반복하지 않고 이 등록에 의존한다.
gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP 플러그인 등록(모듈 스코프, 위 참고)과 prefers-reduced-motion 상태를 하위 트리
 * 어디서나 조회할 수 있게 하는 Provider — ANIMATION_PLAN.md 1장.
 *
 * 실제 타임라인/ScrollTrigger 인스턴스는 각 섹션 컴포넌트(Phase 4~11, components/motion,
 * components/three)에서 만든다. 이 Provider는 "상태 조회"만 담당한다(등록은 모듈 로드
 * 시점에 이미 끝나 있다).
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimationContext.Provider value={{ prefersReducedMotion }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext(): AnimationContextValue {
  return useContext(AnimationContext);
}
