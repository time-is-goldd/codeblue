"use client";

import { useEffect, useRef } from "react";
import { invalidate } from "@react-three/fiber";
import gsap from "gsap";
import type { DirectionalLight } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const BASE_INTENSITY = 1.2;
const PEAK_INTENSITY = 1.5;

/**
 * Hero 3D 씬 조명 — DEVELOPMENT_PLAN.md Phase 4C(기본 구성) + 4D(스크롤 연동 세기 변화).
 *
 * AmbientLight는 정적으로 유지하고, DirectionalLight의 세기만 Model의 회전/스케일과
 * 동일한 30~70% 구간에서 아주 미세하게(1.2 → 1.5 → 1.2) 밝아졌다 되돌아와 모델에
 * 생동감을 준다. Model.tsx와 동일하게 `#hero`를 트리거로 사용해 같은 스크롤 구간에서
 * 함께 움직이도록 동기화한다.
 */
export function Lights() {
  const directionalLightRef = useRef<DirectionalLight>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !directionalLightRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: () => invalidate(),
          },
        })
        .to(directionalLightRef.current!, { intensity: PEAK_INTENSITY, duration: 0.4, ease: "sine.inOut" }, 0.3)
        .to(directionalLightRef.current!, { intensity: BASE_INTENSITY, duration: 0.3, ease: "sine.inOut" }, 0.7);
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight ref={directionalLightRef} position={[3, 4, 5]} intensity={BASE_INTENSITY} />
    </>
  );
}
