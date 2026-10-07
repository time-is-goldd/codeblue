"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { ReviewCard } from "./review-card";
import type { Review } from "@/types";

export interface ReviewMarqueeProps {
  reviews: Review[];
}

/** 흐르는 속도(px/초) — 클수록 빠르다. */
const SPEED_PX_PER_SEC = 36;
/** 한 묶음(set)에 최소 이만큼의 카드가 들어가도록 후기를 반복한다 — 넓은 화면에서도 이음매가 안 보이게. */
const MIN_CARDS_PER_SET = 8;
/** 터치로 멈춘 뒤 손을 떼고 다시 흐르기까지 기다리는 시간(ms) */
const TOUCH_RESUME_DELAY_MS = 2500;
/** 드래그를 놓은 뒤 관성으로 미끄러지는 정도 — 16ms마다 속도에 곱하는 값(1에 가까울수록 오래 미끄러짐). */
const INERTIA_FRICTION = 0.94;
/** 이 속도(px/ms) 아래로 떨어지면 관성을 멈춘다. */
const INERTIA_STOP = 0.02;

/**
 * 고객 후기 한 줄 가로 무한 흐름(마키, 2026-10-07).
 *
 * 이전에는 PC 3열 그리드 / 모바일 가로 스와이프였다. 이제 후기 카드가 한 줄로 오른쪽에서
 * 왼쪽으로 끊김 없이 천천히 흐른다. 같은 묶음을 두 번 이어 붙이고, 이동 거리가 묶음 하나의
 * 폭에 닿으면 0으로 되돌려 이음매 없이 반복한다. 후기가 적어도(현재 3개) 넓은 화면을 채우도록
 * 묶음 안에서 후기를 `MIN_CARDS_PER_SET`장 이상이 되게 반복한다.
 *
 * - 마우스를 올리거나 키보드 포커스가 들어오면 멈춰서 읽을 수 있다. 터치는 손을 뗀 뒤
 *   잠시(`TOUCH_RESUME_DELAY_MS`) 기다렸다가 다시 흐른다.
 * - 드래그(2026-10-07): 마우스로 꾹 눌러(또는 손가락으로) 좌우로 끌면 그만큼 넘어가고, 놓으면
 *   끈 속도대로 관성 있게 미끄러지다 멈춘다. 세로 스크롤은 그대로 두도록 `touch-action: pan-y`.
 * - 화면 밖에 있을 때는 계산을 멈춘다(IntersectionObserver).
 * - JS(framer-motion)로 움직여 OS 모션 감소 설정과 무관하게 항상 동작한다(사이트 공통 방침).
 * - 스크린리더에는 첫 번째 원본 후기 목록만 읽히고, 반복 복제본은 `aria-hidden`/`inert`로 숨긴다.
 * - 포트폴리오 캐러셀과 같이 본문 폭 밖 화면 양 끝까지 이어지고, 양 끝은 마스크로 서서히 사라진다.
 */
export function ReviewMarquee({ reviews }: ReviewMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const resumeTimerRef = useRef(0);
  /** 드래그 상태 — 누른 포인터, 직전 x 좌표·시각 */
  const dragRef = useRef<{ pointerId: number; lastX: number; lastTime: number } | null>(null);
  /** 놓은 직후 관성 속도(px/ms, 오른쪽이 +) */
  const velocityRef = useRef(0);

  const repeat = Math.max(1, Math.ceil(MIN_CARDS_PER_SET / Math.max(1, reviews.length)));
  const setItems = Array.from({ length: repeat }, (_, r) => reviews.map((review) => ({ review, r }))).flat();

  /** 묶음 하나의 폭 안으로 위치를 감아 넣는다 — 어느 방향으로 끌어도 이음매 없이 이어진다. */
  const wrap = (value: number) => {
    const setWidth = setRef.current?.offsetWidth ?? 0;
    if (!setWidth) return value;
    let next = value % setWidth;
    if (next > 0) next -= setWidth;
    return next;
  };

  useAnimationFrame((_, delta) => {
    if (!visibleRef.current || dragRef.current) return;
    // 탭 전환 등으로 프레임 간격이 크게 벌어져도 한 번에 튀지 않게 제한한다.
    const dt = Math.min(delta, 64);
    if (Math.abs(velocityRef.current) > INERTIA_STOP) {
      // 드래그를 놓은 직후: 끈 속도대로 미끄러지며 서서히 멈춘다(멈춤 상태여도 관성은 끝까지).
      x.set(wrap(x.get() + velocityRef.current * dt));
      velocityRef.current *= INERTIA_FRICTION ** (dt / 16);
      return;
    }
    velocityRef.current = 0;
    if (pausedRef.current) return;
    x.set(wrap(x.get() - (SPEED_PX_PER_SEC * dt) / 1000));
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    observer.observe(viewport);
    return () => {
      observer.disconnect();
      window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pause = () => {
    window.clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };
  const resumeLater = () => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(resume, TOUCH_RESUME_DELAY_MS);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pause();
    velocityRef.current = 0;
    dragRef.current = { pointerId: event.pointerId, lastX: event.clientX, lastTime: event.timeStamp };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dt = Math.max(1, event.timeStamp - drag.lastTime);
    x.set(wrap(x.get() + dx));
    // 직전 속도와 섞어 손 떨림에 덜 민감하게 한다.
    velocityRef.current = velocityRef.current * 0.4 + (dx / dt) * 0.6;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    // 놓기 직전 잠시 멈췄다면 관성 없이 그 자리에 멈춘다.
    if (event.timeStamp - drag.lastTime > 80) velocityRef.current = 0;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // 마우스는 아직 위에 있으면 계속 멈춤(hover), 터치는 잠시 뒤 다시 흐른다.
    if (event.pointerType !== "mouse") resumeLater();
  };

  const renderSet = (copy: number) => (
    <div
      ref={copy === 0 ? setRef : undefined}
      aria-hidden={copy > 0 ? true : undefined}
      inert={copy > 0 ? true : undefined}
      // pr-5/md:pr-6: 묶음 끝 간격 — 카드 사이 gap과 같아야 두 묶음 이음매 간격이 일정하다.
      className="flex shrink-0 gap-5 pr-5 md:gap-6 md:pr-6"
    >
      {setItems.map(({ review, r }, index) => (
        <ReviewCard
          key={`${review.id}-${r}`}
          review={review}
          index={index}
          // 원본(첫 묶음의 첫 반복)만 목록 항목으로 읽히고, 나머지 반복은 스크린리더에서 숨긴다.
          hiddenFromScreenReader={copy === 0 && r > 0}
          animateEntrance={false}
          className="w-[300px] shrink-0 md:w-[380px]"
        />
      ))}
    </div>
  );

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-label="고객 후기 목록"
      onPointerEnter={(event) => event.pointerType === "mouse" && pause()}
      onPointerLeave={(event) => event.pointerType === "mouse" && !dragRef.current && resume()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDragStart={(event) => event.preventDefault()}
      onFocus={pause}
      onBlur={resume}
      // 풀블리드: 본문 폭 밖 화면 양 끝까지 넓히고(포트폴리오와 동일), 양 끝은 마스크로
      // 서서히 사라지게 한다. 넘침은 Section의 overflow-x-clip이 잘라낸다. self-stretch: 부모가
      // items-center라 그대로 두면 폭이 콘텐츠(수천 px)까지 늘어난다. py-4: 카드
      // hover 이동이 위아래로 잘리지 않게 하는 여유.
      // cursor-grab/select-none/touch-pan-y: 끌어서 넘기기(드래그) — 마우스 커서는 손 모양, 끄는 동안
      // 글자가 선택되지 않게 하고, 터치에서는 세로 스크롤만 브라우저에 맡긴다.
      className="mx-[calc(50%-50vw)] w-auto cursor-grab touch-pan-y self-stretch overflow-hidden py-4 select-none active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <motion.div style={{ x }} className="flex w-max items-stretch">
        {renderSet(0)}
        {renderSet(1)}
      </motion.div>
    </div>
  );
}
