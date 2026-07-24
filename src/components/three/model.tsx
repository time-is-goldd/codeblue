"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCursor, useGLTF } from "@react-three/drei";
import { invalidate } from "@react-three/fiber";
import gsap from "gsap";
import { Box3, Vector3, type Group } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePointerCoarse } from "@/hooks/use-pointer-coarse";

const DEV = process.env.NODE_ENV !== "production";

/**
 * 개발 중 등장 연출을 매 새로고침마다 강제로 재생하기 위한 디버그 플래그.
 * URL에 `?debugHero3D=1`을 붙이면 `prefers-reduced-motion` 설정과 무관하게 등장
 * 애니메이션이 항상 재생된다(운영 환경 동작에는 영향을 주지 않는, 순수 개발 편의 기능).
 * 이 컴포넌트는 이미 `ssr:false`로만 로드되므로(HeroModelPlaceholder → next/dynamic)
 * window를 렌더 중 직접 읽어도 하이드레이션 불일치가 발생하지 않는다.
 */
function readDebugReplayFlag(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("debugHero3D");
}

/**
 * GLB 파일 경로. Three.js GLTFLoader는 URL을 fetch하는 방식으로 동작하므로
 * Next.js가 정적으로 서빙하는 `public/models/` 아래에 위치해야 한다(`src/assets/`는
 * 번들러 import 전용 경로라 fetch로 접근할 수 없다 — ARCHITECTURE.md 9장 경계와
 * 별개로, 이 파일 하나만 예외적으로 public 배치가 필요하다).
 */
const MODEL_PATH = "/models/logo.glb";

/**
 * 원본 GLB의 좌표 단위/스케일은 내보낸 도구마다 제각각이라(이 브랜드 로고 GLB는 노드에
 * 0.05 배율이 이미 베이크되어 있음에도 최종 크기가 카메라 프러스텀보다 훨씬 큼 —
 * 그대로 두면 카메라가 모델 표면 안쪽에 들어가 화면이 색만 꽉 채운 것처럼 보인다),
 * 로드된 모델의 실제 바운딩 박스를 계산해 항상 동일한 시각적 크기(가장 긴 변 기준)로
 * 정규화하고 중심을 원점으로 옮긴다. 이렇게 하면 다른 GLB로 다시 교체되어도 코드 수정
 * 없이 항상 Canvas 프레임 안에 알맞게 들어온다.
 */
const TARGET_SIZE = 2.4;

/** 30~70% 구간에서 도달하는 최대 회전각(약 18도) — 과도한 회전 금지 원칙 준수 */
const ROTATION_Y = Math.PI * (18 / 180);
const SCALE_PEAK = 1.05;

/** 최초 마운트 시 1회만 재생되는 등장 연출의 시작 회전각(90도)/재생 시간 —
 *  스크롤 연동 회전(ROTATION_Y)과는 별개의, 스크롤과 무관한 진입 모션이다. */
const ENTRANCE_ROTATION = Math.PI * 0.5;
const ENTRANCE_DURATION = 0.9;

/**
 * 마우스 호버 시 연속 회전. `prefers-reduced-motion` 사용자에게도 이 호버 인터랙션만은
 * 끄지 않는다 — reduced-motion이 막는 것은 사용자 의지와 무관한 자동 재생(autoplay)
 * 모션이고, 호버는 사용자가 직접 커서를 움직여 만든 결과이자 커서를 치우면 즉시
 * 멈추므로 접근성 원칙과 충돌하지 않는다. Coarse pointer(터치)에는 "호버" 개념 자체가
 * 없으므로 `usePointerCoarse`로 비활성화한다.
 */
/** 360도 1바퀴를 도는 데 걸리는 시간(초) — 호버하고 있는 동안 이 속도로 계속 회전한다.
 *  천천히, 부드럽게 도는 느낌을 위해 일부러 느리게 잡는다. */
const HOVER_SPIN_DURATION = 5;
/** 커서를 뗐을 때 감속하며 멈추는 데 걸리는 시간(초) — 뚝 끊기지 않고 여운을 두고
 *  천천히 멈추도록 넉넉하게 잡는다. */
const HOVER_STOP_DURATION = 1.6;

/**
 * GLB 로드 + 스크롤 연동 회전/스케일 — DEVELOPMENT_PLAN.md Phase 4D.
 *
 * `useGLTF`가 Suspense로 로딩을 지연시키므로, 이 컴포넌트의 effect는 GLB 로딩이
 * 끝나 실제로 렌더링된 이후에만 실행된다 — group ref가 항상 준비된 상태에서
 * ScrollTrigger를 설정할 수 있다(부모에서 ref를 미리 만들어 내려주는 방식은
 * Suspense 해제 타이밍과 어긋날 수 있어 피했다).
 *
 * ScrollTrigger 플러그인은 `AnimationProvider`(루트 레이아웃)가 앱 전체에서 1회만
 * 등록하므로 이 파일에서 다시 import/등록하지 않는다.
 *
 * ScrollTrigger는 이 Canvas를 감싸는 DOM 요소가 아니라 `#hero`(Hero 섹션 자체)를
 * 셀렉터로 직접 참조한다 — Three.js 씬은 별도 리컨실러 트리에 있지만, DOM 셀렉터
 * 조회는 트리 경계와 무관하게 항상 가능하므로 이 방식으로 Hero의 텍스트
 * 타임라인(hero-scrollytelling.tsx)과 동일한 스크롤 구간을 공유하며 자연히
 * 동기화된다(두 타임라인 모두 동일한 trigger/start/end/scrub 설정을 사용).
 */
export function Model() {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);
  const prefersReducedMotion = useReducedMotion();
  // 지연 초기화(lazy initializer) — 마운트 시 1회만 읽으므로, 실제 새로고침(리마운트)마다
  // 다시 평가된다("매번 새로고침 시 재생" 요구사항).
  const [debugReplay] = useState(readDebugReplayFlag);

  const isCoarsePointer = usePointerCoarse();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  // 호버 중인 연속 회전 트윈 참조 — 커서가 떠날 때 이 트윈을 죽이고 감속 트윈으로
  // 이어받아야 하므로 ref로 들고 있는다(리렌더와 무관하게 항상 최신 트윈을 가리켜야 함).
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);

  const handlePointerOver = useCallback(() => {
    if (isCoarsePointer || !groupRef.current) return;
    setHovered(true);
    spinTweenRef.current?.kill();
    // 상대값("+=2π") + repeat: -1 + ease: "none"으로 끊김 없이 계속 도는 회전을 만든다.
    // 호버가 유지되는 한 계속 반복되며, 커서가 떠나기 전까지는 절대 멈추지 않는다.
    spinTweenRef.current = gsap.to(groupRef.current.rotation, {
      y: `+=${Math.PI * 2}`,
      duration: HOVER_SPIN_DURATION,
      repeat: -1,
      ease: "none",
      onUpdate: () => invalidate(),
    });
  }, [isCoarsePointer]);

  const handlePointerOut = useCallback(() => {
    if (isCoarsePointer || !groupRef.current) return;
    setHovered(false);
    spinTweenRef.current?.kill();
    spinTweenRef.current = null;

    const group = groupRef.current;
    // 갑자기 멈추면 어색하므로, 방향을 반전시키지 않고 현재 바퀴를 마저 돌아 가장 가까운
    // "정면" 각도(2π의 배수)까지 감속하며 이어서 도착한다.
    const fullTurn = Math.PI * 2;
    const target = Math.ceil((group.rotation.y - 1e-4) / fullTurn) * fullTurn;
    gsap.to(group.rotation, {
      y: target,
      duration: HOVER_STOP_DURATION,
      ease: "sine.out",
      onUpdate: () => invalidate(),
      onComplete: () => {
        // 호버를 여러 번 반복해도 rotation.y가 계속 커지지만 않도록 매번 0으로 정규화한다
        // (시각적으로는 target과 완전히 동일한 각도라 정규화해도 튀지 않는다).
        group.rotation.y = 0;
      },
    });
  }, [isCoarsePointer]);

  // 언마운트 시 호버 회전 트윈이 남아있다면 정리한다(제거된 Three.js 객체를 계속
  // 갱신하려 드는 것을 방지) — 진입/스크롤 타임라인은 별도의 gsap.context가 이미
  // 자체적으로 정리하므로, 이 트윈만 별도로 챙기면 된다.
  useEffect(() => {
    return () => {
      spinTweenRef.current?.kill();
    };
  }, []);

  const { fitScale, fitPosition } = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDimension;
    return {
      fitScale: scale,
      fitPosition: [-center.x * scale, -center.y * scale, -center.z * scale] as const,
    };
  }, [scene]);

  useEffect(() => {
    if (DEV) {
      // StrictMode(dev)는 이 effect를 mount→cleanup→mount 순으로 2번 실행한다 — 정상이다.
      // 첫 번째 실행의 타임라인은 GSAP 티커가 한 프레임도 돌기 전에 cleanup(ctx.revert())으로
      // 즉시 kill되므로 화면에는 절대 보이지 않고, 실제로 재생되는 것은 두 번째 실행뿐이다.
      console.log(`[Hero3D] effect mount — prefersReducedMotion=${prefersReducedMotion}, debugReplay=${debugReplay}`);
    }

    // Reduced Motion 사용자는 등장/회전/스케일 애니메이션 없이 정적인 모델만 본다.
    // 단, ?debugHero3D=1 디버그 플래그가 있으면 개발 중 항상 등장 연출을 볼 수 있도록 우회한다.
    if ((prefersReducedMotion && !debugReplay) || !groupRef.current) {
      if (DEV) console.log("[Hero3D] entrance skipped (reduced motion, no debug override)");
      return;
    }

    const group = groupRef.current;

    const ctx = gsap.context(() => {
      // 등장 연출: 스크롤과 무관하게 마운트 시 1회만 재생된다(스케일 0→1 + 살짝 회전하며
      // 나타남). 이 타임라인의 onComplete에서만 아래 스크롤 연동 타임라인을 생성해, 두
      // 애니메이션이 동시에 같은 속성(scale/rotation)을 갱신하며 충돌하지 않게 한다.
      gsap.set(group.scale, { x: 0, y: 0, z: 0 });
      gsap.set(group.rotation, { y: -ENTRANCE_ROTATION });
      invalidate();

      gsap
        .timeline({
          onStart: () => {
            if (DEV) console.log(`[Hero3D] entrance START t=${performance.now().toFixed(0)}ms`);
          },
          onUpdate: () => invalidate(),
          onComplete: () => {
            if (DEV) console.log(`[Hero3D] entrance COMPLETE t=${performance.now().toFixed(0)}ms`);

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: "#hero",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1,
                  // frameloop="demand"이므로 GSAP이 값을 바꿀 때마다 R3F에 재렌더를 요청한다.
                  // React State를 매 프레임 갱신하지 않고, Three.js 객체 속성만 직접 mutate한다.
                  onUpdate: () => invalidate(),
                },
              })
              // 0~30%: 정면 유지(트윈 없음) → 30~70%: 아주 천천히 회전 + 미세 확대
              .to(group.rotation, { y: ROTATION_Y, duration: 0.4, ease: "sine.inOut" }, 0.3)
              .to(
                group.scale,
                { x: SCALE_PEAK, y: SCALE_PEAK, z: SCALE_PEAK, duration: 0.4, ease: "sine.inOut" },
                0.3,
              )
              // 70~100%: 다시 정면을 바라보며 scale도 1.0으로 안정적으로 정착
              // (마지막 문장이 완전히 등장하는 시점과 맞물려 가장 안정적인 상태가 된다)
              .to(group.rotation, { y: 0, duration: 0.3, ease: "sine.inOut" }, 0.7)
              .to(group.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: "sine.inOut" }, 0.7);
          },
        })
        .to(group.scale, { x: 1, y: 1, z: 1, duration: ENTRANCE_DURATION, ease: "back.out(1.6)" }, 0)
        .to(group.rotation, { y: 0, duration: ENTRANCE_DURATION, ease: "power3.out" }, 0);
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, debugReplay]);

  return (
    <group ref={groupRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <group scale={fitScale} position={fitPosition}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
